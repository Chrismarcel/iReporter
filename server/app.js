import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import router from './routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  }),
);

// Set Router instance
app.use(cors());
app.use('/api/v1', router);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to iReporter' });
});

app.all('*', (req, res) => {
  res
    .status(404)
    .json({ message: 'Wrong endpoint. Such endpoint does not exist' });
});

app.listen(PORT);

export default app;
