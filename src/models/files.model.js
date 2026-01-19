

const { getDB } = require('../config/db');
const db = () => getDB();

exports.create = (file, uploadedBy) => {
  return new Promise((resolve, reject) => {
    db().run(
      `INSERT INTO files (original_name, stored_name, mime_type, size, uploaded_by)
       VALUES (?, ?, ?, ?, ?)`,
      [
        file.originalname,
        file.filename,
        file.mimetype,
        file.size,
        uploadedBy
      ],
      function (err) {
        if (err) return reject(err);
        resolve({ id: this.lastID });
      }
    );
  });
};
