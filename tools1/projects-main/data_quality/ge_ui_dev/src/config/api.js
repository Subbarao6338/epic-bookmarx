function get_api_address() {
  let api_url = window.location.protocol + "//" + window.location.host;
  return api_url;
  // return "http://localhost:8000";
}
export const ge_api_url = get_api_address();
