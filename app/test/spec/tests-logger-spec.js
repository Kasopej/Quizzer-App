import TestsLogger from "../../modules/tests-logger/tests-logger.js";

describe("TestsLogger is a class responsible for perfoming requests on the tests log in the database", function () {
  let testsLogger;
  beforeEach(function () {
    testsLogger = new TestsLogger();
  });
  it("can add a new test set to the tests log", async function () {
    let testSetData = {
      amount: 70,
      categoryName: "Science",
      category: "17",
      difficulty: "easy",
      type: "multiple",
      timing: "UntimedQuiz",
      expiryDate: "1640304000000",
      candidateEmails: ["sade@it.com", "ben@create.com"],
      testGroupId: "14596033566555",
      adminToken: "QpwL5tke4Pnpja7X4",
    };
    let responseData = await testsLogger.addNewTest(testSetData);
    delete responseData.id;
    expect(_.isEqual(testSetData, responseData)).toBeTrue();
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
    let responseData = await testsLogger.editExistingTest(testSetData, 1);
    testSetData.id = 1;
    expect(_.isEqual(testSetData, responseData)).toBeTrue();
  });
});
