import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import Pricing from './components/Pricing';
import OrderForm from './components/OrderForm';
import Footer from './components/Footer';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [orders, setOrders] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const addOrder = (order) => {
    const newOrder = {
      ...order,
      id: Date.now(),
      status: 'جديد',
      date: new Date().toLocaleDateString('ar-AE')
    };
    setOrders(prev => [...prev, newOrder]);
  };

  const HomePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <Hero />
      <Services />
      <Portfolio />
      <Pricing />
      <OrderForm onSubmit={addOrder} />
      <Footer />
    </div>
  );

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route 
          path="/admin" 
          element={
            isAdmin ? 
            <AdminDashboard orders={orders} setOrders={setOrders} /> : 
            <AdminLogin onLogin={setIsAdmin} />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;