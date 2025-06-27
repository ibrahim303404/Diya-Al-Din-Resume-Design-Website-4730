import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiStar, FiUsers, FiAward, FiTrendingUp, FiPenTool } = FiIcons;

const Hero = () => {
  const stats = [
    { icon: FiUsers, number: '500+', label: 'عميل راضٍ' },
    { icon: FiAward, number: '3+', label: 'سنوات خبرة' },
    { icon: FiStar, number: '4.9', label: 'تقييم العملاء' },
    { icon: FiTrendingUp, number: '95%', label: 'معدل النجاح' },
  ];

  const handleScrollToSection = (sectionId) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="pt-24 pb-16 px-4">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
              اصنع
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                {' '}تصاميمك الاحترافية{' '}
              </span>
              معنا
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              مع ضياء الدين بووش للتصاميم، احصل على سيرة ذاتية متميزة ولوجو احترافي مصمم خصيصاً لك يساعدك في إبراز هويتك المهنية
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <motion.button
                onClick={() => handleScrollToSection('#order')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-semibold text-center shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              >
                اطلب تصميمك الآن
              </motion.button>
              <motion.button
                onClick={() => handleScrollToSection('#portfolio')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-purple-600 text-purple-600 px-8 py-4 rounded-full font-semibold text-center hover:bg-purple-600 hover:text-white transition-colors cursor-pointer"
              >
                شاهد أعمالنا
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                    <SafeIcon icon={FiPenTool} className="text-white text-2xl" />
                  </div>
                  <div className="mr-4">
                    <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 bg-white rounded-lg shadow-lg p-4 transform -rotate-6">
              <div className="flex items-center space-x-2 space-x-reverse">
                <SafeIcon icon={FiStar} className="text-yellow-400" />
                <span className="text-sm font-semibold">تقييم ممتاز</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-16"
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg mb-4">
                <SafeIcon icon={stat.icon} className="text-white text-xl" />
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-2">{stat.number}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;