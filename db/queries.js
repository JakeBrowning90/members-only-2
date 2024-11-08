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
  const { rows } = await pool.query("SELECT * FROM users WHERE email = ($1)", [
    email,
  ]);
  return rows[0];
}

async function getUserByUsername(username) {
  const { rows } = await pool.query(
    "SELECT * FROM users WHERE username = ($1)",
    [username]
  );
  return rows[0];
}

async function getUserById(id) {
  const { rows } = await pool.query("SELECT * FROM users WHERE id = ($1)", [
    id,
  ]);
  return rows[0];
}

async function updateUserToMember(id) {
  await pool.query("UPDATE users SET is_member = TRUE WHERE id = ($1)", [id]);
}

async function updateUserToAdmin(id) {
  await pool.query("UPDATE users SET is_admin = TRUE WHERE id = ($1)", [id]);
}

async function insertPost(post, user) {
  await pool.query(
    "INSERT INTO posts (title, body, user_id, timestamp) VALUES ($1, $2, $3, CURRENT_TIMESTAMP)",
    [post.postTitle, post.postBody, user.id]
  );
}

async function getAllPosts() {
  const { rows } = await pool.query(
    "SELECT posts.id, title, body, timestamp, user_id, username FROM posts INNER JOIN users ON posts.user_id = users.id ORDER BY timestamp DESC"
  );
  return rows;
}

async function deletePost(id) {
  await pool.query("DELETE FROM posts WHERE id = ($1)", [id]);
}

module.exports = {
  insertUser,
  getUserByUsername,
  getUserByEmail,
  getUserById,
  updateUserToMember,
  updateUserToAdmin,
  insertPost,
  getAllPosts,
  deletePost,
};
