import express from 'express';
import connectToDatabase from './src/config/dbConnect.js';
import routes from './src/routes/index.js';
import cors from 'cors';

const app = express();

app.set('trust proxy', 1);

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

let isConnected = false;

app.use(async (req, res, next) => {
   if (!isConnected) {
      await connectToDatabase();
      isConnected = true;
   }
   next();
});

app.use('/api', routes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
   console.log(`Servidor ouvindo na porta ${port}`);
});

export default app;
