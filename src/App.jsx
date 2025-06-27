import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import Pricing from './components/Pricing';
import LogoPricing from './components/LogoPricing';
import OrderForm from './components/OrderForm';
import LogoOrderForm from './components/LogoOrderForm';
import Footer from './components/Footer';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import { getAllOrders } from './services/supabaseOrderService';
import { getAllLogoOrders } from './services/supabaseLogoService';

function App() {
  const [orders, setOrders] = useState([]);
  const [logoOrders, setLogoOrders] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  // جلب الطلبات من Supabase عند تحميل التطبيق
  useEffect(() => {
    loadOrdersFromSupabase();
    loadLogoOrdersFromSupabase();
  }, []);

  const loadOrdersFromSupabase = async () => {
    try {
      const result = await getAllOrders();
      if (result.success) {
        // تحويل البيانات من Supabase إلى تنسيق التطبيق
        const formattedOrders = result.orders.map(order => ({
          id: order.id,
          name: order.customer_name,
          email: order.customer_email,
          phone: order.customer_phone,
          profession: order.profession,
          experience: order.experience,
          package: order.package_type,
          additionalServices: order.additional_services || [],
          totalPrice: parseFloat(order.total_price),
          notes: order.notes,
          status: order.order_status,
          date: new Date(order.order_date).toLocaleDateString('ar-AE')
        }));
        setOrders(formattedOrders);
      }
    } catch (error) {
      console.error('خطأ في تحميل طلبات السير الذاتية:', error);
    }
  };

  const loadLogoOrdersFromSupabase = async () => {
    try {
      const result = await getAllLogoOrders();
      if (result.success) {
        // تحويل البيانات من Supabase إلى تنسيق التطبيق
        const formattedLogoOrders = result.orders.map(order => ({
          id: order.id,
          name: order.customer_name,
          email: order.customer_email,
          phone: order.customer_phone,
          businessName: order.business_name,
          businessType: order.business_type,
          logoPackage: order.logo_package,
          stylePreferences: order.style_preferences || [],
          colorPreferences: order.color_preferences,
          totalPrice: parseFloat(order.total_price),
          notes: order.notes,
          status: order.order_status,
          date: new Date(order.order_date).toLocaleDateString('ar-AE')
        }));
        setLogoOrders(formattedLogoOrders);
      }
    } catch (error) {
      console.error('خطأ في تحميل طلبات اللوجو:', error);
    }
  };

  const addOrder = (order) => {
    // هذه الدالة تستخدم للتوافق مع النظام القديم
    // الطلبات الجديدة ستتم إضافتها تلقائياً من خلال Supabase
    const newOrder = {
      ...order,
      id: Date.now(),
      status: 'جديد',
      date: new Date().toLocaleDateString('ar-AE')
    };
    setOrders(prev => [...prev, newOrder]);
  };

  const addLogoOrder = (logoOrder) => {
    // هذه الدالة تستخدم للتوافق مع النظام القديم
    // طلبات اللوجو الجديدة ستتم إضافتها تلقائياً من خلال Supabase
    const newLogoOrder = {
      ...logoOrder,
      id: Date.now(),
      status: 'جديد',
      date: new Date().toLocaleDateString('ar-AE')
    };
    setLogoOrders(prev => [...prev, newLogoOrder]);
  };

  const HomePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <Hero />
      <Services />
      <Portfolio />
      <Pricing />
      <LogoPricing />
      <OrderForm onSubmit={addOrder} />
      <LogoOrderForm onSubmit={addLogoOrder} />
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
            isAdmin ? (
              <AdminDashboard 
                cvOrders={orders}
                logoOrders={logoOrders}
              />
            ) : (
              <AdminLogin onLogin={setIsAdmin} />
            )
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;