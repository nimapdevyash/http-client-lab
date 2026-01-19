const { getDB } = require("../config/db");
const db = () => getDB();

exports.getAll = (filters = {}) => {
  let sql = "SELECT * FROM posts WHERE 1=1";
  const params = [];

  if (filters.user_id) {
    sql += " AND user_id = ?";
    params.push(filters.user_id);
  }

  if (filters.published !== undefined) {
    sql += " AND published = ?";
    params.push(filters.published);
  }

  return new Promise((resolve, reject) => {
    db().all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

exports.create = ({ user_id, title, body, published }) => {
  return new Promise((resolve, reject) => {
    db().run(
      `INSERT INTO posts (user_id, title, body, published)
       VALUES (?, ?, ?, ?)`,
      [user_id, title, body, published || 0],
      function (err) {
        if (err) return reject(err);
        resolve({ id: this.lastID });
      },
    );
  });
};
