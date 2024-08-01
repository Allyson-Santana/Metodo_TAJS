import { it, describe, expect, jest, beforeEach } from "@jest/globals";
import Service from "../src/service.js";
import fs from "node:fs/promises";

describe("#Service Test Suite", () => {
  let _service = null;
  const filename = "./users.ndjson";

  beforeEach(() => {
    _service = new Service(filename);
  });

  describe("#Read", () => {
    it("Should return empty if file does not exist!", async () => {
      // Begin
      _service = new Service("./DoesNotExistsFile.ndjson");

      // When
      const result = await _service.read();

      // Then
      expect(result).toEqual([]);
    });

    it("Should return empty if file is empty!", async () => {
      // Begin
      jest.spyOn(fs, fs.readFile.name).mockResolvedValue("");

      // When
      const result = await _service.read();

      // Then
      expect(result).toEqual([]);
    });

    it("Should return users without password if file contains users!", async () => {
      // Begin
      const dbData = [
        {
          username: "user1",
          password: "pass1",
          createdAt: new Date().toISOString(),
        },
        {
          username: "user2",
          password: "pass2",
          createdAt: new Date().toISOString(),
        },
      ];

      const fileContents = dbData
        .map((data) => JSON.stringify(data).concat("\n"))
        .join("");

      jest.spyOn(fs, "readFile").mockResolvedValue(fileContents);

      // When
      const result = await _service.read();

      // Then
      const expected = dbData.map(({ password, ...rest }) => ({ ...rest }));
      expect(result).toStrictEqual(expected);
    });
  });
});
