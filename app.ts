import express from 'express'
import cookie_parser from 'cookie-parser'
const app = express();
app.set('query parser', 'extended');
app.use(cookie_parser())
app.use(express.json())

export default app;
