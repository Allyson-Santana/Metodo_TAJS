class Person {
  static validate(person) {
    if (typeof person.name != "string" || person.name.trim().length === 0) {
      throw new Error("Name is required.");
    }

    if (typeof person.cpf != "string" || person.cpf.trim().length === 0) {
      throw new Error("Cpf is required.");
    }
  }

  static format(person) {
    const [name, ...lastname] = person.name.split(" ");

    return {
      name: name.trim(),
      cpf: person.cpf.replace(/\D/g, ""),
      lastname: lastname.join(" ").trim(),
    };
  }

  static save(person) {
    if (!["name", "cpf", "lastname"].every((field) => person[field])) {
      throw new Error(`Cannot save invalid person: ${JSON.stringify(person)}`, {
        cause: "A Field not found",
      });
    }

    // Here you can save a new person with successfully!

    console.log("Person register with successfully", person);
  }

  static process(person) {
    this.validate(person);

    const personFormated = this.format(person);

    this.save(personFormated)

    return "ok";
  }
}

const person = {
  name: "Allyson Santana",
  cpf: "123.456.789-00",
};

Person.process(person);

export default Person;
