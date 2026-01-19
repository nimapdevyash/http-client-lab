const { getDB } = require("../config/db");
const db = () => getDB();

exports.getAll = () => {
  return new Promise((resolve, reject) => {
    db().all("SELECT * FROM users", [], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

exports.getById = (id) => {
  return new Promise((resolve, reject) => {
    db().get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
};

exports.create = ({ name, email, age }) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO users (name, email, age)
      VALUES (?, ?, ?)
    `;
    db().run(sql, [name, email, age], function (err) {
      if (err) return reject(err);
      resolve({ id: this.lastID });
    });
  });
};

exports.update = (id, { name, email, age }) => {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE users
      SET name = ?, email = ?, age = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    db().run(sql, [name, email, age, id], function (err) {
      if (err) return reject(err);
      resolve(this.changes);
    });
  });
};

exports.remove = (id) => {
  return new Promise((resolve, reject) => {
    db().run("DELETE FROM users WHERE id = ?", [id], function (err) {
      if (err) return reject(err);
      resolve(this.changes);
    });
  });
};
