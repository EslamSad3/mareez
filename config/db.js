const dotenv = require('dotenv');

dotenv.config();
const mongoose = require('mongoose');

const dbConnection = () => {
  // connect to db
  mongoose
    .connect(process.env.DB_URI)
    .then((conn) => {
      console.log(`DB Connectin :${conn.connection.host}`);
    })
    .catch((err) => {
      console.log(err, 'DB Error');
      process.exit(1);
    });
};

module.exports = dbConnection;
