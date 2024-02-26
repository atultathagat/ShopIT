import Footer from './components/layout/Footer.jsx';
import Header from './components/layout/Header.jsx';
import './App.css';
import Home from './components/Home.jsx';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {Toaster} from 'react-hot-toast';
import ProductDetails from './components/product/ProductDetails.jsx';
import Login from './components/auth/Login.jsx';
import Register from './components/auth/Register.jsx';
import UpdateProfile from './components/user/UpdateProfile.jsx';
import Profile from './components/user/Profile.jsx';
function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Toaster position='top-center'/>
        <Header />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/product/:id" element={<ProductDetails/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/me/profile" element={<Profile/>}/>
            <Route path="/me/update_profile" element={<UpdateProfile/>}/>
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
