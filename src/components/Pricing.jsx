import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiCheck, FiStar, FiZap, FiAward, FiFileText } = FiIcons;

const Pricing = () => {
  const cvPlans = [
    {
      name: 'الباقة الأساسية',
      price: '150',
      icon: FiCheck,
      description: 'مثالية للطلاب والخريجين الجدد',
      features: [
        'تصميم سيرة ذاتية واحدة',
        'تنسيق احترافي',
        'مراجعة واحدة',
        'تسليم خلال 3-5 أيام',
        'ملف PDF عالي الجودة',
        'دعم فني أساسي'
      ],
      popular: false,
      color: 'from-blue-500 to-blue-600'
    },
    {
      name: 'الباقة المتقدمة',
      price: '250',
      icon: FiStar,
      description: 'الأكثر طلباً للمحترفين',
      features: [
        'تصميم سيرة ذاتية واحدة',
        'تصميم إبداعي مميز',
        'مراجعتان مجانيتان',
        'تسليم خلال 2-3 أيام',
        'ملفات PDF و Word',
        'خطاب تعريفي مجاني',
        'استشارة مهنية',
        'دعم فني متقدم'
      ],
      popular: true,
      color: 'from-blue-500 to-indigo-500'
    },
    {
      name: 'الباقة الذهبية',
      price: '400',
      icon: FiAward,
      description: 'للمناصب التنفيذية والقيادية',
      features: [
        'تصميم سيرة ذاتية فاخرة',
        'تصميم حصري ومخصص',
        'مراجعات غير محدودة',
        'تسليم خلال 24-48 ساعة',
        'جميع صيغ الملفات',
        'خطاب تعريفي مخصص',
        'ملف LinkedIn محسن',
        'استشارة مهنية شاملة',
        'دعم فني مخصص',
        'ضمان الرضا 100%'
      ],
      popular: false,
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  const additionalServices = [
    {
      name: 'تحديث السيرة الذاتية',
      price: '75',
      description: 'تحديث وتطوير سيرتك الحالية'
    },
    {
      name: 'ترجمة إلى الإنجليزية',
      price: '100',
      description: 'ترجمة احترافية ودقيقة'
    },
    {
      name: 'تصميم خطاب تعريفي إضافي',
      price: '50',
      description: 'خطاب مخصص لكل وظيفة'
    },
    {
      name: 'تحسين ملف LinkedIn',
      price: '125',
      description: 'تحسين ملفك الشخصي على LinkedIn'
    }
  ];

  const handleScrollToOrder = () => {
    const element = document.querySelector('#order');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="pricing" className="py-20 bg-white" dir="rtl">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-4">
            <SafeIcon icon={FiFileText} className="text-4xl text-blue-600 ml-3" />
            <h2 className="text-4xl font-bold text-gray-800">باقات السيرة الذاتية</h2>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            اختر الباقة المناسبة لتصميم سيرتك الذاتية - جميع الأسعار بالدرهم الإماراتي
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {cvPlans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 ${
                plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 right-1/2 transform translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-2 rounded-full text-sm font-semibold">
                    الأكثر طلباً
                  </span>
                </div>
              )}

              <div className="p-8">
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${plan.color} rounded-xl mb-6`}>
                  <SafeIcon icon={plan.icon} className="text-white text-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>

                <div className="text-center mb-8">
                  <span className="text-4xl font-bold text-gray-800">{plan.price}</span>
                  <span className="text-xl text-gray-600 mr-2">درهم</span>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-700">
                      <SafeIcon icon={FiCheck} className="text-green-500 ml-3 flex-shrink-0" />
                      <span className="text-sm text-right">{feature}</span>
                    </li>
                  ))}
                </ul>

                <motion.button
                  onClick={handleScrollToOrder}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full py-4 rounded-xl font-semibold transition-all cursor-pointer ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg hover:shadow-xl'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  اختر هذه الباقة
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Services */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center">
            <SafeIcon icon={FiFileText} className="ml-2 text-blue-600" />
            خدمات إضافية للسيرة الذاتية
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalServices.map((service, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-all"
              >
                <h4 className="font-semibold text-gray-800 mb-2 text-right">{service.name}</h4>
                <p className="text-sm text-gray-600 mb-3 text-right">{service.description}</p>
                <div className="text-2xl font-bold text-blue-600">
                  {service.price}
                  <span className="text-sm text-gray-600 mr-1">درهم</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Guarantee Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16 p-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl"
        >
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">ضمان الجودة والرضا</h3>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-3">
                  <SafeIcon icon={FiCheck} className="text-white text-xl" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">ضمان الجودة</h4>
                <p className="text-sm text-gray-600">نضمن لك جودة عالية في جميع تصاميمنا</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-3">
                  <SafeIcon icon={FiZap} className="text-white text-xl" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">تسليم سريع</h4>
                <p className="text-sm text-gray-600">التزام تام بمواعيد التسليم المحددة</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mb-3">
                  <SafeIcon icon={FiStar} className="text-white text-xl" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">رضا العملاء</h4>
                <p className="text-sm text-gray-600">نعمل حتى تحصل على النتيجة المطلوبة</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;