import { describe } from "vitest";

import {
  capitalizeFirstLetter,
  reformatMySQLDate,
  startedButNotCompletedCount,
  affectItem,
} from "./helperFunctions";

describe("Helper Functions", () => {
  describe("test from vitest documentation", () => {
    it("should return 0", () => {
      const getApples = vi.fn(() => 0);

      getApples();

      expect(getApples).toHaveBeenCalled();
      expect(getApples).toHaveReturnedWith(0);

      getApples.mockReturnValueOnce(5);

      const res = getApples();
      expect(res).toBe(5);
      expect(getApples).toHaveNthReturnedWith(2, 5);
    });
  });
  describe("Affect Item Tests", () => {
    it("should fail if it is not a valid route", async () => {
      var route = "not a valid route";
      const result = await affectItem(route);
      expect(result.success).toBe(false);
    });
    it("should call fetch for a valid route", async () => {
      const fetch = vi.fn(
        (route, options) => new Promise((resolve) => resolve({ success: true }))
      );
      window.fetch = fetch;
      const result = await affectItem("add", "item", {}, "http://localhost");
      expect(fetch).toHaveBeenCalled();
    }, 10000);
    it("should call fetch for a valid route", async () => {
      const fetch = vi.fn(
        (route, options) => new Promise((resolve) => resolve({ success: true }))
      );
      window.fetch = fetch;
      const result = await affectItem("add", "item", {}, "http://localhost");
      expect(fetch).toHaveBeenCalled();
    }, 10000);
  });
  describe("Some other test", () => {
    it.todo();
  });
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
