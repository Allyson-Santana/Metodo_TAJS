import Service from "./service.js";

const filename = "./users.ndjson";
const service = new Service(filename);

const newUser = {
  username: "allyson_adm",
  password: "myP@ss2024",
};

service.create(newUser);

const users = await service.read();

console.log({ users });
