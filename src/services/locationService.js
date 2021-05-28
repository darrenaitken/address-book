// Custom modules
import http from "./httpService";
import { apiGeoURL } from "./config.json";

export async function getAPILocationData(latitude, longitude) {
  const results = await http.get(apiGeoURL, {
    params: {
      latitude: latitude,
      longitude: longitude,
    },
  });
  return results.data;
}
