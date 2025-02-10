import { describe } from "vitest";

import {
  capitalizeFirstLetter,
  reformatMySQLDate,
  startedButNotCompletedCount,
} from "./helperFunctions";

describe("Helper Functions", () => {
  describe("Capitalize First Letter", () => {
    it("should capitalize the first letter of a string", () => {
      expect(capitalizeFirstLetter("hello")).toBe("Hello");
    });
  });
  describe("Reformat MySQL Dates", () => {
    it("should reformat a MySQL Default Date to mm/dd/yyyy", () => {
      expect(reformatMySQLDate("1958-11-12 6:21:30")).toBe("11/12/1958");
    });
  });

  function items() {
    return [
      { started_dtm: "1958-11-12 6:21:30", completed_dtm: null },
      {
        started_dtm: "1958-11-12 6:21:30",
        completed_dtm: "1958-11-12 6:21:30",
      },
      { started_dtm: "1958-11-12 6:21:30", completed_dtm: null },
      {
        started_dtm: "1958-11-12 6:21:30",
        completed_dtm: "1958-11-12 6:21:30",
      },
    ];
  }
  describe("Return the number of items whose started date is set but whose completed date is null", () => {
    it("should return the count of started items that are not completed", () => {
      expect(startedButNotCompletedCount(items)).toBe(2);
    });
  });
});
