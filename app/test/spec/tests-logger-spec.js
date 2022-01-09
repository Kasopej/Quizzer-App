import TestsLogger from "../../modules/tests-logger/tests-logger.js";

describe("TestsLogger is a class responsible for perfoming requests on the tests log in the database", function () {
  let testsLogger;
  beforeEach(function () {
    testsLogger = new TestsLogger();
  });
  it("can update an existing test set in the database by a PUT request", async function () {
    let testSetData = {
      amount: 10,
      categoryName: "Science",
      category: "17",
      difficulty: "easy",
      type: "multiple",
      timing: "UntimedQuiz",
      expiryDate: "1640304000000",
      candidateEmails: ["ben@dev.com"],
      testGroupId: "14596033566555",
      adminToken: "QpwL5tke4Pnpja7X4",
    };
    let responseData = await testsLogger.editExistingTest(testsLogger);
    expect(_.isEqual(testSetData, responseData)).toBeTrue();
  });
});
