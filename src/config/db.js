const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

let db;

exports.connectDB = () => {
  return new Promise((resolve, reject) => {
    const dbPath = path.join(__dirname, '../../database/testlab.db');
    const schemaPath = path.join(__dirname, '../../database/schema.sql');

    db = new sqlite3.Database(dbPath, (err) => {
      if (err) return reject(err);

      const schema = fs.readFileSync(schemaPath, 'utf8');
      db.exec(schema, (err) => {
        if (err) return reject(err);
        console.log('✅ DB connected & schema ready');
        resolve(db);
      });
    });
  });
};

exports.getDB = () => db;
