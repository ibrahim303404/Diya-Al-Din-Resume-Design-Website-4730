import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiCheck, FiStar, FiZap, FiAward, FiPenTool, FiImage, FiLayers } = FiIcons;

const LogoPricing = () => {
  const logoPackages = [
    {
      name: 'باقة اللوجو الأساسية',
      price: '200',
      icon: FiPenTool,
      description: 'مثالية للشركات الناشئة والأعمال الصغيرة',
      features: [
        'تصميم لوجو احترافي واحد',
        '3 مفاهيم تصميم أولية',
        'مراجعة واحدة مجانية',
        'تسليم خلال 5-7 أيام',
        'ملفات PNG و JPG عالية الجودة',
        'نسخة شفافة للخلفية',
        'دعم فني أساسي'
      ],
      popular: false,
      color: 'from-blue-500 to-blue-600'
    },
    {
      name: 'باقة اللوجو المتقدمة',
      price: '350',
      icon: FiStar,
      description: 'الأكثر طلباً للأعمال المتوسطة',
      features: [
        'تصميم لوجو احترافي مميز',
        '5 مفاهيم تصميم متنوعة',
        'مراجعتان مجانيتان',
        'تسليم خلال 3-5 أيام',
        'جميع صيغ الملفات (AI, EPS, PNG, JPG)',
        'نسخة أبيض وأسود',
        'بطاقة أعمال بسيطة',
        'دليل استخدام الهوية',
        'دعم فني متقدم'
      ],
      popular: true,
      color: 'from-purple-500 to-pink-500'
    },
    {
      name: 'باقة الهوية المتكاملة',
      price: '600',
      icon: FiAward,
      description: 'للشركات الكبيرة والعلامات التجارية',
      features: [
        'تصميم لوجو حصري ومتقن',
        'مفاهيم تصميم غير محدودة',
        'مراجعات غير محدودة',
        'تسليم خلال 24-48 ساعة',
        'جميع صيغ الملفات المهنية',
        'نسخ متعددة الألوان',
        'بطاقات أعمال احترافية',
        'ورق رسمي مصمم',
        'دليل هوية بصرية شامل',
        'أيقونات مساعدة',
        'دعم فني مخصص لمدة 6 أشهر',
        'ضمان الرضا 100%'
      ],
      popular: false,
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  const logoStyles = [
    {
      name: 'لوجو النصوص',
      description: 'تصميم يعتمد على الخط والنص',
      price: 'ابتداءً من 150 درهم'
    },
    {
      name: 'لوجو الرموز',
      description: 'رموز وأيقونات معبرة',
      price: 'ابتداءً من 200 درهم'
    },
    {
      name: 'لوجو مركب',
      description: 'نص مع رمز متكامل',
      price: 'ابتداءً من 250 درهم'
    },
    {
      name: 'لوجو الختم',
      description: 'تصميم دائري كلاسيكي',
      price: 'ابتداءً من 300 درهم'
    }
  ];

  const handleScrollToLogoOrder = () => {
    const element = document.querySelector('#logo-order');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="logo-pricing" className="py-20 bg-gradient-to-br from-purple-50 to-pink-50" dir="rtl">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-4">
            <SafeIcon icon={FiPenTool} className="text-4xl text-purple-600 ml-3" />
            <h2 className="text-4xl font-bold text-gray-800">باقات تصميم اللوجو</h2>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            اختر الباقة المناسبة لتصميم لوجو احترافي يعكس هوية علامتك التجارية - جميع الأسعار بالدرهم الإماراتي
          </p>
        </motion.div>

        {/* Logo Packages */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {logoPackages.map((pkg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 ${
                pkg.popular ? 'ring-2 ring-purple-500 scale-105' : ''
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-4 right-1/2 transform translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-semibold">
                    الأكثر طلباً
                  </span>
                </div>
              )}

              <div className="p-8">
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${pkg.color} rounded-xl mb-6`}>
                  <SafeIcon icon={pkg.icon} className="text-white text-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{pkg.name}</h3>
                <p className="text-gray-600 mb-6">{pkg.description}</p>

                <div className="text-center mb-8">
                  <span className="text-4xl font-bold text-gray-800">{pkg.price}</span>
                  <span className="text-xl text-gray-600 mr-2">درهم</span>
                </div>

                <ul className="space-y-4 mb-8">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-700">
                      <SafeIcon icon={FiCheck} className="text-green-500 ml-3 flex-shrink-0" />
                      <span className="text-sm text-right">{feature}</span>
                    </li>
                  ))}
                </ul>

                <motion.button
                  onClick={handleScrollToLogoOrder}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full py-4 rounded-xl font-semibold transition-all cursor-pointer ${
                    pkg.popular
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  اختر هذه الباقة
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Logo Styles */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl p-8 mb-16"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center">
            <SafeIcon icon={FiLayers} className="ml-2 text-purple-600" />
            أنواع تصاميم اللوجو
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {logoStyles.map((style, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-all"
              >
                <h4 className="font-semibold text-gray-800 mb-2 text-right">{style.name}</h4>
                <p className="text-sm text-gray-600 mb-3 text-right">{style.description}</p>
                <div className="text-lg font-bold text-purple-600">
                  {style.price}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Logo Services Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center p-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl text-white"
        >
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-6">لماذا تختار خدمات اللوجو لدينا؟</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
                  <SafeIcon icon={FiPenTool} className="text-white text-2xl" />
                </div>
                <h4 className="font-semibold mb-2">تصميم احترافي</h4>
                <p className="text-sm text-purple-100">فريق من المصممين المحترفين لإنشاء لوجو فريد ومميز</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
                  <SafeIcon icon={FiZap} className="text-white text-2xl" />
                </div>
                <h4 className="font-semibold mb-2">تسليم سريع</h4>
                <p className="text-sm text-purple-100">نلتزم بمواعيد التسليم ونقدم خدمة سريعة وموثوقة</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
                  <SafeIcon icon={FiImage} className="text-white text-2xl" />
                </div>
                <h4 className="font-semibold mb-2">ملفات متعددة</h4>
                <p className="text-sm text-purple-100">نوفر جميع صيغ الملفات المطلوبة للاستخدامات المختلفة</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LogoPricing;