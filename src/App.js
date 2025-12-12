import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Search from './pages/Search';
import NewRestaurant from './pages/NewRestaurant';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/new-restaurant" element={<NewRestaurant />} />
        </Routes>
        
        <footer className="bg-dark text-white py-4 mt-5">
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                <h5>Restaurants App</h5>
                <p>Aquí encontrarás los mejores restaurantes de la ciudad.</p>
              </div>
              <div className="col-md-6 text-md-end">
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
