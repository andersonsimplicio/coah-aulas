import express from 'express';
import routes from './routes';
import cors from 'cors';

const app = express();
app.use(express.json());
// http://localhost:3333/coaches
// http://localhost:3333/contacts
app.use(cors());
app.use(express.json());
app.use(routes);

// app.use(routes);

app.listen(3333);


