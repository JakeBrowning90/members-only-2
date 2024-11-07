const { Client } = require("pg");
require("dotenv").config();

const SQL = `
CREATE TABLE IF NOT EXISTS users (
   id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
   username VARCHAR ( 255 ),
   email VARCHAR ( 255 ),
   password VARCHAR ( 255 ),
   is_member BOOLEAN NOT NULL,
   is_admin BOOLEAN NOT NULL
);
`;

async function main() {
  console.log("seeding users...");
  const client = new Client({
    connectionString: process.env.CONNECTION_STRING,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();
