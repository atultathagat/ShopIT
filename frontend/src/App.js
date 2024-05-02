import Footer from './components/layout/Footer.jsx';
import Header from './components/layout/Header.jsx';
import './App.css';
import {BrowserRouter, Routes} from 'react-router-dom';
import {Toaster} from 'react-hot-toast';
import UserRoutes from './components/routes/userRoutes.jsx';
import AdminRoutes from './components/routes/adminRoutes.jsx';

function App() {
  const userRoutes = UserRoutes();
  const adminRoutes = AdminRoutes();
  return (
    <BrowserRouter>
      <div className="App">
        <Toaster position='top-center'/>
        <Header />
        <div className="container">
          <Routes>
            {userRoutes}
            {adminRoutes}
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
