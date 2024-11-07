const pool = require("./pool");

// async function functionName(arg) {
//     return values;
// }

async function insertUser(username, email, password) {
  await pool.query(
    "INSERT INTO users (username, email, password, is_member, is_admin) VALUES ($1, $2, $3, false, false)",
    [username, email, password]
  );
}

async function getUserByEmail(email) {
  console.log(email);
  const { rows } = await pool.query("SELECT * FROM users WHERE email = ($1)", [
    email,
  ]);
  return rows[0];
}

async function getUserById(id) {
  const { rows } = await pool.query("SELECT * FROM users WHERE id = ($1)", [
    id,
  ]);
  return rows[0];
}

module.exports = { insertUser, getUserByEmail, getUserById };
