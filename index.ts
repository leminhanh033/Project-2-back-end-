import express,{Request,Response} from 'express';
import router from './routes/index.route';
import cors from 'cors'
import cookieParser from 'cookie-parser';

import {connectDB} from './configs/database.config'

connectDB();

const app = express();
const port = 4000;

app.use(express.json());
app.use(cors({
  "origin": `${process.env.URL}`,
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204,
  "credentials":true,
}))
app.use(cookieParser())

app.use('/', router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});