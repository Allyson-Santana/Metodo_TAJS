import { it, describe, expect, jest } from "@jest/globals";
import Person from "../src/person";

describe("#Person Suite", () => {
  describe("#Validate", () => {
    it.each([null, "", "  ", undefined])(
      "Should throw if the name is not present",
      (name) => {
        // Begin
        const mockInvalidPerson = {
          name: name,
          cpf: "123.456.789-00",
        };

        // When
        const personError = () => Person.validate(mockInvalidPerson);

        // Then
        expect(personError).toThrow(new Error("Name is required."));
      }
    );

    it.each([null, "", "  ", undefined])(
      "Should throw if the Cpf is not present",
      (cpf) => {
        // Begin
        const mockInvalidPerson = {
          name: "Allyson Santana",
          cpf: cpf,
        };

        // When
        const personError = () => Person.validate(mockInvalidPerson);

        // Then
        expect(personError).toThrow(new Error("Cpf is required."));
      }
    );

    it("Should not throw if the Cpf is not present", () => {
      // Begin
      const mockInvalidPerson = {
        name: "Allyson Santana",
        cpf: "123.456.789-00",
      };

      // When
      const personError = () => Person.validate(mockInvalidPerson);

      // Then
      expect(personError).not.toThrow();
    });
  });

  describe("#Format", () => {
    it("Should returns person with name and cpf formated", () => {
      // Begin
      const mockPerson = {
        name: "Allyson Santana",
        cpf: "123.456.789-00",
      };

      // When
      const personFormated = Person.format(mockPerson);

      // Then
      const expected = {
        name: "Allyson",
        cpf: "12345678900",
        lastname: "Santana",
      };

      expect(personFormated).toStrictEqual(expected);
    });
  });

  describe("#Process", () => {
    it("Should process a valid person", () => {
      // begin
      jest.spyOn(Person, Person.validate.name).mockReturnValue();

      jest.spyOn(Person, Person.format.name).mockReturnValue({
        name: "Allyson",
        cpf: "12345678900",
        lastname: "Santana",
      });

      // When
      const result = Person.process({});

      // Then
      const expected = "ok";
      expect(result).toStrictEqual(expected);
    });
  });
});
