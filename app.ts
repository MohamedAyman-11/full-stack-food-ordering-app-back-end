import express from "express";
import cookie_parser from "cookie-parser";
import cors from "cors";
import productRouter from "./routes/productRoutes";
import categoriesRouter from "./routes/categoriesRoutes";
const app = express();
const API_PREFIX = process.env.API_PREFIX;
app.use(
  cors({
    origin: `${process.env.ORIGIN}`,
    credentials: true,
  }),
);

app.set("query parser", "extended");
app.use(cookie_parser());
app.use(express.json());
app.use(`${API_PREFIX}/products`, productRouter);
app.use(`${API_PREFIX}/categories`, categoriesRouter);
export default app;
