const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const morgan = require("morgan");
const dbConnection = require("./config/db");
const { createCategory } = require("./services/categoryServices");
const categoryRoute = require("./routes/categoryRoute")
// DB Connection
dbConnection();

//Express app
const app = express();

// MiddleWares
app.use(express.json());


// Mount Routes

app.use("/api/categories",categoryRoute)


if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`Mode : ${process.env.NODE_ENV}`);
}




const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`running on port : ${PORT}`));
