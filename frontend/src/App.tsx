import './styles/theme.css';
import './styles/global.css';
//import { Home } from './pages/Home';
//import { CardView } from './pages/CardView';
import { Login } from './pages/Login';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <ProtectedRoute><Login /></ProtectedRoute>

  )
}

export default App
