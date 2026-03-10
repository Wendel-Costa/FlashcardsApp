import app from './backend/app.js';

if (process.env.NODE_ENV !== 'production') {
   const port = process.env.PORT || 3000;
   app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
   });
}

export default app;
