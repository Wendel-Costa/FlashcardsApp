import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { Home } from '../pages/Home';
import { Login } from '../pages/Login';
import { CardView } from '../pages/CardView';
// import { Register } from '../pages/Register';
// import { CreateCard } from '../pages/CreateCard';
// import { CreateDeck } from '../pages/CreateDeck';
// import { DeckDetail } from '../pages/DeckDetail';
// import { Guest } from '../pages/Guest';
// import { GuestCardCreate } from '../pages/GuestCardCreate';
// import { GuestDeckCreate } from '../pages/GuestDeckCreate';

export const router = createBrowserRouter([
   // Rotas públicas
   { path: '/login', element: <Login /> },

   //   { path: '/register', element: <Register /> },
   //   { path: '/guest', element: <Guest /> },
   //   { path: '/guest/card', element: <GuestCardCreate /> },
   //   { path: '/guest/deck', element: <GuestDeckCreate /> },



   // Rotas protegidas
   { path: '/', element: <ProtectedRoute><Home /></ProtectedRoute> },
   { path: '/review', element: <ProtectedRoute><CardView /></ProtectedRoute> },
   { path: '/review/:tag', element: <ProtectedRoute><CardView /></ProtectedRoute> },

   //   { path: '/deck/:tag', element: <ProtectedRoute><DeckDetail /></ProtectedRoute> },
   //   { path: '/create-card', element: <ProtectedRoute><CreateCard /></ProtectedRoute> },
   //   { path: '/create-deck', element: <ProtectedRoute><CreateDeck /></ProtectedRoute> },
]);