import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiMail, FiPhone, FiMapPin, FiInstagram, FiTwitter, FiLinkedin, FiPenTool } = FiIcons;

const Footer = () => {
  const handleScrollToSection = (sectionId) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-purple-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2 space-x-reverse">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <SafeIcon icon={FiPenTool} className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold">ضياء الدين بووش للتصاميم</h3>
                <p className="text-purple-300 text-sm">تصميم السير الذاتية واللوجوهات</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">
              نحن متخصصون في تصميم السير الذاتية الاحترافية واللوجوهات المميزة التي تساعدك في إبراز هويتك المهنية. خبرة أكثر من 3 سنوات في هذا المجال.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="text-lg font-semibold mb-6">روابط سريعة</h4>
            <ul className="space-y-3">
              {[
                { name: 'الرئيسية', section: '#home' },
                { name: 'الخدمات', section: '#services' },
                { name: 'معرض الأعمال', section: '#portfolio' },
                { name: 'الأسعار', section: '#pricing' },
                { name: 'اطلب الآن', section: '#order' }
              ].map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleScrollToSection(link.section)}
                    className="text-gray-300 hover:text-purple-400 transition-colors cursor-pointer text-right w-full"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold mb-6">خدماتنا</h4>
            <ul className="space-y-3">
              {[
                'السيرة الكلاسيكية',
                'السيرة الإبداعية',
                'السيرة التنفيذية',
                'السيرة التقنية',
                'تصميم اللوجو',
                'الهوية البصرية'
              ].map((service, index) => (
                <li key={index} className="text-gray-300">
                  {service}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="text-lg font-semibold mb-6">تواصل معنا</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 space-x-reverse">
                <SafeIcon icon={FiMail} className="text-purple-400" />
                <span className="text-gray-300">nestaman2@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse">
                <SafeIcon icon={FiPhone} className="text-purple-400" />
                <span className="text-gray-300">+971 XX XXX XXXX</span>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse">
                <SafeIcon icon={FiMapPin} className="text-purple-400" />
                <span className="text-gray-300">الإمارات العربية المتحدة</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="mt-6">
              <h5 className="font-semibold mb-3">تابعنا</h5>
              <div className="flex space-x-4 space-x-reverse">
                {[FiInstagram, FiTwitter, FiLinkedin].map((Icon, index) => (
                  <motion.a
                    key={index}
                    href="#"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center hover:bg-purple-700 transition-colors"
                  >
                    <SafeIcon icon={Icon} className="text-white" />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="border-t border-gray-700 mt-12 pt-8 text-center"
        >
          <p className="text-gray-400">
            © 2024 ضياء الدين بووش للتصاميم. جميع الحقوق محفوظة.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;