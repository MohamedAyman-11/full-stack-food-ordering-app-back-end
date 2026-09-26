import express from "express";
import cookie_parser from "cookie-parser";
import cors from "cors";
import productRouter from "./routes/product.router";
import categoriesRouter from "./routes/categories.router";
import sizesRouter from "./routes/size.router";
import extrasRouter from "./routes/extra.router";
import authRouter from "./routes/auth.router";
import userRouter from "./routes/user.router";
import adminRouter from "./routes/admin.router";
import orderRouter from "./routes/order.router";
import deliveryRouter from "./routes/delivery.router";
import stripeRouter from "./routes/stripe.router";
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

app.use((req, res, next) => {
  console.log(req.method, req.originalUrl);
  next();
});

app.set("query parser", "extended");
app.use(`${API_PREFIX}/stripe`, stripeRouter);
app.use(cookie_parser());
app.use(express.json());

app.use(`${API_PREFIX}/auth`, authRouter);
app.use(`${API_PREFIX}/admin`, adminRouter);
app.use(`${API_PREFIX}/users`, userRouter);
app.use(`${API_PREFIX}/products`, productRouter);
app.use(`${API_PREFIX}/categories`, categoriesRouter);
app.use(`${API_PREFIX}/sizes`, sizesRouter);
app.use(`${API_PREFIX}/extras`, extrasRouter);
app.use(`${API_PREFIX}/orders`, orderRouter);
app.use(`${API_PREFIX}/delivery`, deliveryRouter);

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
