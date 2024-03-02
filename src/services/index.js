import { BASE_URL, TIMEOUT } from "./config";
import WdRequest from "./request";

const request = new WdRequest({
  baseUrl: BASE_URL,
  timeout: TIMEOUT,

})
export default request
