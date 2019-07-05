import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import debug from 'debug';
import morgan from 'morgan';
import expressValidator from 'express-validator';
import v1Router from './v1/routes';

// Middleware
const app = express();
const debugIt = debug('app');
const port = process.env.PORT || 3000;
app.use(cors());
app.options('*', cors());
app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());


// Routes handler
app.all('/', (req, res) => {
  res.redirect('/api/v1');
});
app.use('/api/v1', v1Router);

app.listen(port, () => {
  debugIt(`App started at port ${port}`);
});

export default app;
