import express from "express";
import cookie_parser from "cookie-parser";
import cors from "cors";
import productRouter from "./routes/productRouter";
import categoriesRouter from "./routes/categoriesRouter";
import sizesRouter from "./routes/sizeRouter";
import extrasRouter from "./routes/extraRouter";
import authRouter from "./routes/authRouter";
import userRouter from "./routes/userRouter";
import adminRouter from "./routes/adminRouter";
import { globalErrorHandler } from "./controllers/globalErrorHandler";
import { AppError } from "./utils/appError";
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
app.use((req, res, next) => {
  console.log(req.method, req.originalUrl);
  next();
});
app.use(`${API_PREFIX}/auth`, authRouter);
app.use(`${API_PREFIX}/admin`, adminRouter);
app.use(`${API_PREFIX}/users`, userRouter);
app.use(`${API_PREFIX}/products`, productRouter);
app.use(`${API_PREFIX}/categories`, categoriesRouter);
app.use(`${API_PREFIX}/sizes`, sizesRouter);
app.use(`${API_PREFIX}/extras`, extrasRouter);
app.use((req, res, next) => {
  next(
    new AppError({
      message: `Can't find ${req.originalUrl}`,
      statusCode: 404,
      code: undefined,
    }),
  );
});
app.use(globalErrorHandler);
export default app;
