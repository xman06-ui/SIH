package handler

import (
	"encoding/json"
	"log"
	"net/http"

	"traffic-backend/internal/model"
	"traffic-backend/internal/repository"
	"traffic-backend/internal/service"
)

type TrafficHandler struct {
	repo *repository.TrafficRepository
}

func NewTrafficHandler(repo *repository.TrafficRepository) *TrafficHandler {
	return &TrafficHandler{
		repo: repo,
	}
}

func (h *TrafficHandler) HandleTrafficEvent(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var event model.TrafficEvent

	decoder := json.NewDecoder(r.Body)

	if err := decoder.Decode(&event); err != nil {
		http.Error(
			w,
			"invalid JSON: "+err.Error(),
			http.StatusBadRequest,
		)
		return
	}

	// --------------------------------------------------
	// 1. Calculate traffic values
	// --------------------------------------------------

	vehicleCount := service.CalculateVehicleCount(event.Vehicles)

	congestionScore := service.CalculateCongestionScore(event.Vehicles)

	// --------------------------------------------------
	// 2. Create geographic + time buckets
	// --------------------------------------------------

	locationBucket := service.CreateLocationBucket(event.Location)

	timeBucket := service.CreateTimeBucket(event.Timestamp)

	trafficDate := event.Timestamp.Format("2006-01-02")

	// --------------------------------------------------
	// 3. Save raw event + update aggregate
	// --------------------------------------------------

	err := h.repo.SaveEventAndUpdateAggregate(
		r.Context(),
		event,
		locationBucket,
		timeBucket,
		trafficDate,
		vehicleCount,
		congestionScore,
		event.Traffic.VehicleOccupancy,
	)

	if err != nil {

		if err.Error() == "duplicate event_id" {
			http.Error(
				w,
				"duplicate event_id",
				http.StatusConflict,
			)
			return
		}

		log.Println(
			"SaveEventAndUpdateAggregate ERROR:",
			err,
		)

		http.Error(
			w,
			"failed to process traffic event: "+err.Error(),
			http.StatusInternalServerError,
		)

		return
	}

	// --------------------------------------------------
	// 4. Get updated geographic aggregate
	// --------------------------------------------------

	aggregate, err := h.repo.GetTrafficAggregate(
		r.Context(),
		locationBucket,
		timeBucket,
		trafficDate,
	)

	if err != nil {
		log.Println(
			"GetTrafficAggregate ERROR:",
			err,
		)

		http.Error(
			w,
			"failed to get traffic aggregate: "+err.Error(),
			http.StatusInternalServerError,
		)

		return
	}

	// --------------------------------------------------
	// 5. Get historical average
	// --------------------------------------------------

	historicalVehicleAverage, _, err :=
		h.repo.GetHistoricalAverage(
			r.Context(),
			locationBucket,
			timeBucket,
			trafficDate,
		)

	if err != nil {
		log.Println(
			"GetHistoricalAverage ERROR:",
			err,
		)

		http.Error(
			w,
			"failed to get historical traffic: "+err.Error(),
			http.StatusInternalServerError,
		)

		return
	}

	// --------------------------------------------------
	// 6. Build the frontend JSON
	// --------------------------------------------------

	frontendResponse :=
		service.BuildFrontendTrafficFromAggregate(
			aggregate,
			historicalVehicleAverage,
		)

	// --------------------------------------------------
	// 7. POST frontend JSON to another API
	// --------------------------------------------------

	err = service.PostFrontendTraffic(
		frontendResponse,
	)

	if err != nil {
		log.Println(
			"PostFrontendTraffic ERROR:",
			err,
		)

		http.Error(
			w,
			"traffic processed but failed to send outgoing request: "+err.Error(),
			http.StatusBadGateway,
		)

		return
	}

	// --------------------------------------------------
	// 8. Respond to the original sender
	// --------------------------------------------------

	w.Header().Set(
		"Content-Type",
		"application/json",
	)

	response := map[string]interface{}{
		"success": true,
		"event_id": event.EventID,
		"message": "traffic processed and outgoing request sent",
	}

	w.WriteHeader(http.StatusOK)

	json.NewEncoder(w).Encode(response)
}

func (h *TrafficHandler) HandleCurrentTraffic(
	w http.ResponseWriter,
	r *http.Request,
) {
	if r.Method != http.MethodGet {
		http.Error(
			w,
			"method not allowed",
			http.StatusMethodNotAllowed,
		)
		return
	}

	aggregates, err := h.repo.GetCurrentTraffic(r.Context())

	if err != nil {
		log.Println("GetCurrentTraffic ERROR:", err)

		http.Error(
			w,
			"failed to get current traffic: "+err.Error(),
			http.StatusInternalServerError,
		)

		return
	}

	responses := make(
		[]model.FrontendTrafficResponse,
		0,
		len(aggregates),
	)

	for _, aggregate := range aggregates {

		trafficDate :=
			aggregate.TrafficDate.Format("2006-01-02")

		// Get previous 3-day historical baseline
		historicalVehicleAverage, _, err :=
			h.repo.GetHistoricalAverage(
				r.Context(),
				aggregate.LocationBucket,
				aggregate.TimeBucket,
				trafficDate,
			)

		if err != nil {
			log.Println(
				"GetHistoricalAverage ERROR:",
				err,
			)

			http.Error(
				w,
				"failed to get historical traffic: "+err.Error(),
				http.StatusInternalServerError,
			)

			return
		}

		response :=
			service.BuildFrontendTrafficFromAggregate(
				aggregate,
				historicalVehicleAverage,
			)

		responses = append(
			responses,
			response,
		)
	}

	w.Header().Set(
		"Content-Type",
		"application/json",
	)

	json.NewEncoder(w).Encode(responses)
}
