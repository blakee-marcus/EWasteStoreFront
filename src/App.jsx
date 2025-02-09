import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Home from './pages/Home';
import IndividualItem from './pages/IndividualItem';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <main className='flex flex-col font-sans h-screen'>
        <Header />
        <div className='flex-grow'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/product/:id' element={<IndividualItem />} />
          </Routes>
        </div>
        <Footer />
      </main>
    </Router>
  );
}

export default App;
