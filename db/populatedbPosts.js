const { Client } = require("pg");
require("dotenv").config();

const SQL = `
CREATE TABLE IF NOT EXISTS posts (
   id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
   title VARCHAR ( 100 ),
   body VARCHAR ( 300 ),
   timestamp TIMESTAMP NOT NULL,
   user_id INT REFERENCES users(id)
);
`;

async function main() {
  console.log("seeding posts...");
  const client = new Client({
    connectionString: process.env.CONNECTION_STRING,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();
