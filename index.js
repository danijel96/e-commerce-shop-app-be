const express = require("express");
const colors = require("colors");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const productRoute = require("./routes/product");
const cors = require("cors");

const connectDB = require("./config/db");

connectDB();

app.use(cors());
app.use(express.json());
app.use("/api/products", productRoute);


//app.get('/api', () => {
//    console.log('test ');
//})
app.listen(process.env.PORT || 5000, () => {
    console.log("Backend server is running on port!", process.env.PORT);
});
