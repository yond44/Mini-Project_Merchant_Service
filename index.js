import express from "express";
import db from "./config/database.js"
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();
import merchantRouter from "./routes/merchantRouter.js";
import productRouter from "./routes/productRouter.js";

const app = express();


try {
    await db.authenticate();
    console.log("Database connected...");
   
} catch (error) {
    console.error(error);
};


app.use (cookieParser());
app.use (express.json());
app.use (merchantRouter);
app.use (productRouter)

app.listen(3000, () => console.log("Server running..."));

//CREATE TABEL <DON'T FORGET TO DELETE OR UNACTIVATED IT AFTER TABEL CREATED>

//TO CREATE MERCHANT TABEL

// import merchants from "./model/merchantmodel.js";

// app.use(merchants.sync())

//TO CREATE PRODUCT TABEL

// import products from "./model/productsmodel.js";

// app.use(products.sync())