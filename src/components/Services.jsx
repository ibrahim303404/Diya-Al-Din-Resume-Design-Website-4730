import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiFileText, FiEdit3, FiUsers, FiTrendingUp, FiStar, FiTarget, FiPenTool, FiImage } = FiIcons;

const Services = () => {
  const services = [
    {
      icon: FiFileText,
      title: 'السيرة الذاتية الكلاسيكية',
      description: 'تصميم سيرة ذاتية أنيقة ومهنية مناسبة لجميع المجالات',
      features: ['تصميم أنيق', 'محتوى مهني', 'تنسيق احترافي']
    },
    {
      icon: FiEdit3,
      title: 'السيرة الذاتية الإبداعية',
      description: 'تصاميم مبتكرة وألوان جذابة للمجالات الإبداعية',
      features: ['تصميم مبتكر', 'ألوان جذابة', 'عناصر بصرية']
    },
    {
      icon: FiUsers,
      title: 'السيرة الذاتية التنفيذية',
      description: 'تصميم راقي ومميز للمناصب الإدارية والتنفيذية',
      features: ['تصميم راقي', 'تركيز على الإنجازات', 'أسلوب احترافي']
    },
    {
      icon: FiTrendingUp,
      title: 'السيرة الذاتية التقنية',
      description: 'مصممة خصيصاً للمهندسين والمطورين والتقنيين',
      features: ['تركيز على المهارات', 'عرض المشاريع', 'تقنيات حديثة']
    },
    {
      icon: FiPenTool,
      title: 'تصميم اللوجو الاحترافي',
      description: 'تصميم لوجو فريد يعكس هوية علامتك التجارية',
      features: ['تصميم فريد', 'ألوان متناسقة', 'ملفات متعددة الصيغ']
    },
    {
      icon: FiImage,
      title: 'تصميم الهوية البصرية',
      description: 'تصميم شامل لهوية علامتك التجارية',
      features: ['لوجو احترافي', 'ألوان العلامة', 'دليل الهوية']
    }
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4">خدماتنا المتخصصة</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            نقدم مجموعة شاملة من خدمات التصميم لتناسب جميع احتياجاتك المهنية والتجارية
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-gradient-to-br from-white to-purple-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl mb-6">
                <SafeIcon icon={service.icon} className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">{service.title}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
              <ul className="space-y-2">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-sm text-gray-700">
                    <div className="w-2 h-2 bg-purple-600 rounded-full ml-2"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;