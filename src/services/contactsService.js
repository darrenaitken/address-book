// Custom modules
import http from "./httpService";
import { apiURL } from "./config.json";

export async function getAPIAllContacts() {
  // This is an array of contact details
  const results = await http.get(apiURL);
  return results.data;
}

export async function getAPIName(fullName) {
  const results = await http.get(apiURL, { params: { name: fullName } });
  return results.data;
}
