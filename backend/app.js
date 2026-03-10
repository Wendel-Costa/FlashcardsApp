import express from 'express';
import connectToDatabase from './config/dbConnect.js';
import routes from './routes/index.js';
import cors from 'cors';

const connection = await connectToDatabase();

connection.on('error', error => {
   console.error('Connection error', error);
});

connection.once('open', () => {
   console.log('Conexão com o banco feita com sucesso');
});

const app = express();

app.use(
   cors({
      origin: function (origin, callback) {
         const allowed = [
            /^http:\/\/localhost:\d+$/,
            /^https:\/\/.*\.app\.github\.dev$/,
            /^https:\/\/flashappcards\.vercel\.app$/,
         ];
         if (!origin || allowed.some(pattern => pattern.test(origin))) {
            callback(null, true);
         } else {
            callback(new Error('Bloqueado pelo CORS'));
         }
      },
      credentials: true,
   }),
);

app.use(express.json());
app.use(routes);

export default app;
