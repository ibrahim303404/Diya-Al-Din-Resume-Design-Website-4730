import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiEye, FiDownload, FiX, FiFileText, FiPenTool } = FiIcons;

const Portfolio = () => {
  const [selectedPreview, setSelectedPreview] = useState(null);
  const [activeCategory, setActiveCategory] = useState('الكل');

  // أعمال السير الذاتية
  const cvPortfolioItems = [
    {
      id: 1,
      title: 'سيرة ذاتية - مهندس برمجيات',
      category: 'تقنية',
      type: 'cv',
      image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=500&fit=crop',
      previewImage: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&h=800&fit=crop',
      description: 'تصميم عصري مع تركيز على المهارات التقنية والمشاريع'
    },
    {
      id: 2,
      title: 'سيرة ذاتية - مصمم جرافيك',
      category: 'إبداعية',
      type: 'cv',
      image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=500&fit=crop',
      previewImage: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=800&fit=crop',
      description: 'تصميم إبداعي يعكس شخصية المصمم ومهاراته الفنية'
    },
    {
      id: 3,
      title: 'سيرة ذاتية - مدير تنفيذي',
      category: 'تنفيذية',
      type: 'cv',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop',
      previewImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop',
      description: 'تصميم راقي ومهني يليق بالمناصب التنفيذية'
    },
    {
      id: 4,
      title: 'سيرة ذاتية - طبيب',
      category: 'طبية',
      type: 'cv',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=500&fit=crop',
      previewImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&h=800&fit=crop',
      description: 'تصميم كلاسيكي أنيق مناسب للمهن الطبية'
    },
    {
      id: 5,
      title: 'سيرة ذاتية - خريج جديد',
      category: 'طلابية',
      type: 'cv',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=500&fit=crop',
      previewImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=800&fit=crop',
      description: 'تصميم بسيط وجذاب للخريجين الجدد'
    },
    {
      id: 6,
      title: 'سيرة ذاتية - مسوق رقمي',
      category: 'تسويق',
      type: 'cv',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=500&fit=crop',
      previewImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=800&fit=crop',
      description: 'تصميم حديث يعكس الإبداع في التسويق الرقمي'
    }
  ];

  // أعمال تصميم اللوجو
  const logoPortfolioItems = [
    {
      id: 7,
      title: 'لوجو شركة تقنية',
      category: 'تقنية',
      type: 'logo',
      image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=400&fit=crop',
      previewImage: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=600&fit=crop',
      description: 'لوجو عصري وبسيط يعكس الابتكار التقني'
    },
    {
      id: 8,
      title: 'لوجو مطعم فاخر',
      category: 'مطاعم',
      type: 'logo',
      image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=400&fit=crop',
      previewImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&h=600&fit=crop',
      description: 'لوجو أنيق يعبر عن الطعام الفاخر والجودة العالية'
    },
    {
      id: 9,
      title: 'لوجو عيادة طبية',
      category: 'طبية',
      type: 'logo',
      image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=400&h=400&fit=crop',
      previewImage: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=600&h=600&fit=crop',
      description: 'لوجو طبي محترف يبعث على الثقة والأمان'
    },
    {
      id: 10,
      title: 'لوجو متجر ملابس',
      category: 'تجارة',
      type: 'logo',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop',
      previewImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=600&fit=crop',
      description: 'لوجو عصري وجذاب لمتجر ملابس شبابي'
    },
    {
      id: 11,
      title: 'لوجو شركة استشارات',
      category: 'أعمال',
      type: 'logo',
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop',
      previewImage: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=600&fit=crop',
      description: 'لوجو مهني وموثوق لشركة استشارات إدارية'
    },
    {
      id: 12,
      title: 'لوجو تطبيق موبايل',
      category: 'تطبيقات',
      type: 'logo',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=400&fit=crop',
      previewImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=600&fit=crop',
      description: 'أيقونة تطبيق جذابة ومميزة'
    }
  ];

  const allPortfolioItems = [...cvPortfolioItems, ...logoPortfolioItems];

  const categories = [
    'الكل', 
    'السير الذاتية', 
    'اللوجوهات',
    'تقنية', 
    'إبداعية', 
    'تنفيذية', 
    'طبية', 
    'طلابية', 
    'تسويق',
    'مطاعم',
    'تجارة',
    'أعمال',
    'تطبيقات'
  ];

  const getFilteredItems = () => {
    if (activeCategory === 'الكل') return allPortfolioItems;
    if (activeCategory === 'السير الذاتية') return cvPortfolioItems;
    if (activeCategory === 'اللوجوهات') return logoPortfolioItems;
    return allPortfolioItems.filter(item => item.category === activeCategory);
  };

  const filteredItems = getFilteredItems();

  const handlePreview = (item) => {
    setSelectedPreview(item);
  };

  const closePreview = () => {
    setSelectedPreview(null);
  };

  const handleOrderClick = (itemType) => {
    const orderSection = itemType === 'logo' ? '#logo-order' : '#order';
    const element = document.querySelector(orderSection);
    if (element) {
      closePreview();
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  };

  return (
    <section id="portfolio" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4">معرض أعمالنا</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            تصفح مجموعة من أفضل تصاميم السير الذاتية واللوجوهات التي قمنا بإنجازها لعملائنا
          </p>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-3 rounded-full font-medium transition-all ${
                  activeCategory === category
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative group">
                <img
                  src={item.image}
                  alt={item.title}
                  className={`w-full ${item.type === 'logo' ? 'h-64' : 'h-64'} object-cover`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handlePreview(item)}
                        className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-white/30 transition-colors"
                        title={`معاينة ${item.type === 'logo' ? 'اللوجو' : 'السيرة الذاتية'}`}
                      >
                        <SafeIcon icon={FiEye} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-white/30 transition-colors"
                        title="تحميل النموذج"
                      >
                        <SafeIcon icon={FiDownload} />
                      </motion.button>
                    </div>
                  </div>
                </div>
                {/* نوع التصميم */}
                <div className="absolute top-4 right-4">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium text-white ${
                    item.type === 'logo' 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                      : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                  }`}>
                    <SafeIcon icon={item.type === 'logo' ? FiPenTool : FiFileText} />
                    {item.type === 'logo' ? 'لوجو' : 'سيرة ذاتية'}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                    item.type === 'logo'
                      ? 'text-purple-600 bg-purple-100'
                      : 'text-blue-600 bg-blue-100'
                  }`}>
                    {item.category}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {selectedPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={closePreview}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className={`flex items-center justify-between p-6 border-b border-gray-200 ${
                selectedPreview.type === 'logo'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600'
              } text-white`}>
                <div>
                  <h3 className="text-xl font-bold">{selectedPreview.title}</h3>
                  <p className="text-blue-100">{selectedPreview.description}</p>
                </div>
                <button
                  onClick={closePreview}
                  className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <SafeIcon icon={FiX} className="text-xl" />
                </button>
              </div>

              {/* Preview Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="flex justify-center">
                  <div className="relative max-w-2xl">
                    <img
                      src={selectedPreview.previewImage}
                      alt={selectedPreview.title}
                      className="w-full h-auto rounded-lg shadow-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
                  </div>
                </div>

                {/* Details */}
                <div className="mt-6 grid md:grid-cols-2 gap-6 bg-gray-50 rounded-lg p-6">
                  <div>
                    <h4 className="font-bold text-gray-800 mb-3">مميزات هذا التصميم:</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center">
                        <div className={`w-2 h-2 rounded-full ml-2 ${
                          selectedPreview.type === 'logo' ? 'bg-purple-600' : 'bg-blue-600'
                        }`}></div>
                        تصميم احترافي ومميز
                      </li>
                      <li className="flex items-center">
                        <div className={`w-2 h-2 rounded-full ml-2 ${
                          selectedPreview.type === 'logo' ? 'bg-purple-600' : 'bg-blue-600'
                        }`}></div>
                        {selectedPreview.type === 'logo' ? 'ألوان متناسقة وجذابة' : 'تنسيق منظم وسهل القراءة'}
                      </li>
                      <li className="flex items-center">
                        <div className={`w-2 h-2 rounded-full ml-2 ${
                          selectedPreview.type === 'logo' ? 'bg-purple-600' : 'bg-blue-600'
                        }`}></div>
                        {selectedPreview.type === 'logo' ? 'ملفات عالية الجودة' : 'ألوان متناسقة وجذابة'}
                      </li>
                      <li className="flex items-center">
                        <div className={`w-2 h-2 rounded-full ml-2 ${
                          selectedPreview.type === 'logo' ? 'bg-purple-600' : 'bg-blue-600'
                        }`}></div>
                        {selectedPreview.type === 'logo' ? 'قابل للاستخدام في جميع الوسائل' : 'مناسب للطباعة والعرض الرقمي'}
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-3">يشمل التصميم:</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      {selectedPreview.type === 'logo' ? (
                        <>
                          <li className="flex items-center">
                            <div className="w-2 h-2 bg-purple-600 rounded-full ml-2"></div>
                            ملف اللوجو بصيغة AI
                          </li>
                          <li className="flex items-center">
                            <div className="w-2 h-2 bg-purple-600 rounded-full ml-2"></div>
                            ملفات PNG عالية الجودة
                          </li>
                          <li className="flex items-center">
                            <div className="w-2 h-2 bg-purple-600 rounded-full ml-2"></div>
                            نسخة أبيض وأسود
                          </li>
                          <li className="flex items-center">
                            <div className="w-2 h-2 bg-purple-600 rounded-full ml-2"></div>
                            دليل استخدام الهوية
                          </li>
                        </>
                      ) : (
                        <>
                          <li className="flex items-center">
                            <div className="w-2 h-2 bg-blue-600 rounded-full ml-2"></div>
                            المعلومات الشخصية
                          </li>
                          <li className="flex items-center">
                            <div className="w-2 h-2 bg-blue-600 rounded-full ml-2"></div>
                            الخبرات المهنية
                          </li>
                          <li className="flex items-center">
                            <div className="w-2 h-2 bg-blue-600 rounded-full ml-2"></div>
                            المهارات والكفاءات
                          </li>
                          <li className="flex items-center">
                            <div className="w-2 h-2 bg-blue-600 rounded-full ml-2"></div>
                            التعليم والشهادات
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex gap-4 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleOrderClick(selectedPreview.type)}
                    className={`px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow text-white ${
                      selectedPreview.type === 'logo'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600'
                    }`}
                  >
                    {selectedPreview.type === 'logo' ? 'اطلب لوجو مماثل' : 'اطلب سيرة ذاتية مماثلة'}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`border-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                      selectedPreview.type === 'logo'
                        ? 'border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white'
                        : 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
                    }`}
                  >
                    تحميل نموذج
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Portfolio;