const API_URL = "http://localhost:8080/api/v1/traffic/current";

export async function getCurrentTraffic() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error(`Traffic API error: ${response.status}`);
  }

  return response.json();
}