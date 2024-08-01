import crypto from "node:crypto";
import fs from "node:fs/promises";
import fsSync from "node:fs";

export default class Service {
  #filename;

  constructor(filename) {
    this.#filename = filename;
  }

  #hashPassword(password) {
    const hash = crypto.createHash("sha256");
    hash.update(password);

    return hash.digest("hex");
  }

  async create({ username, password }) {
    const userData = JSON.stringify({
      username: username,
      password: this.#hashPassword(password),
      createdAt: new Date().toISOString(),
    }).concat("\n");

    return (await fs.appendFile(this.#filename, userData));
  }

  async read() {
    if (!fsSync.existsSync(this.#filename)) {
      return [];
    }

    const lines = (await fs.readFile(this.#filename, "utf-8"))
      .split("\n")
      .filter((line) => !!line);

    if (lines.length === 0) {
      return [];
    }

    return lines
      .map((line) => JSON.parse(line))
      .map(({ password, ...rest }) => ({ ...rest }));
  }
}
