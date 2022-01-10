import API_ServiceClass from "../../services/api-service.js";
import { TESTS_SETS_RESOURCE_BASEURL } from "../util/url.js";

const apiService = new API_ServiceClass();
export default class TestsLogger {
  async addNewTest(testSetData) {
    let response = await apiService.updatePut(TESTS_SETS_RESOURCE_BASEURL, {
      method: "POST",
      body: JSON.stringify(testSetData),
      headers: { "Content-Type": "application/json" },
    });
    return response;
  }
  async editExistingTest(testSetData, resourceId) {
    let response = await apiService.updatePut(
      TESTS_SETS_RESOURCE_BASEURL + resourceId,
      {
        method: "PUT",
        body: JSON.stringify(testSetData),
        headers: { "Content-Type": "application/json" },
      }
    );
    return response;
  }
  deleteTest() {}
}
