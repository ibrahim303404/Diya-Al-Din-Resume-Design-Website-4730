import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiMenu, FiX, FiPenTool, FiMail, FiPhone } = FiIcons;

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { name: 'الرئيسية', href: '#home' },
    { name: 'الخدمات', href: '#services' },
    { name: 'معرض الأعمال', href: '#portfolio' },
    { name: 'الأسعار', href: '#pricing' },
    { name: 'اطلب الآن', href: '#order' },
  ];

  const handleNavClick = (href) => {
    setIsMenuOpen(false);
    // Smooth scroll to section
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 w-full bg-white/95 backdrop-blur-md shadow-lg z-50"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2 space-x-reverse"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiPenTool} className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">ضياء الدين بووش للتصاميم</h1>
              <p className="text-sm text-purple-600">تصميم السير الذاتية واللوجوهات</p>
            </div>
          </motion.div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-8 space-x-reverse">
            {menuItems.map((item, index) => (
              <motion.button
                key={index}
                onClick={() => handleNavClick(item.href)}
                whileHover={{ scale: 1.05 }}
                className="text-gray-700 hover:text-purple-600 font-medium transition-colors cursor-pointer"
              >
                {item.name}
              </motion.button>
            ))}
          </nav>

          {/* Contact Info */}
          <div className="hidden lg:flex items-center space-x-4 space-x-reverse">
            <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
              <SafeIcon icon={FiMail} />
              <span>nestaman2@gmail.com</span>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
              <SafeIcon icon={FiPhone} />
              <span>+971 XX XXX XXXX</span>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700"
          >
            <SafeIcon icon={isMenuOpen ? FiX : FiMenu} className="text-2xl" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden mt-4 py-4 border-t"
          >
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavClick(item.href)}
                className="block py-2 text-gray-700 hover:text-purple-600 font-medium w-full text-right"
              >
                {item.name}
              </button>
            ))}
          </motion.nav>
        )}
      </div>
    </motion.header>
  );
};

export default Header;