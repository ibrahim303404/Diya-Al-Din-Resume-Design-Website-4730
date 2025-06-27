import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { saveLogoOrderToDatabase } from '../services/supabaseLogoService';

const { 
  FiUser, FiMail, FiPhone, FiBriefcase, FiDollarSign, FiSend, FiUpload, 
  FiFile, FiLoader, FiAlertCircle, FiCheckCircle, FiPenTool, FiPalette 
} = FiIcons;

const LogoOrderForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    businessType: '',
    logoPackage: '',
    stylePreferences: [],
    colorPreferences: '',
    notes: '',
    inspirationFiles: null
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [errorDetails, setErrorDetails] = useState('');

  const logoPackages = [
    { value: 'basic', label: 'باقة اللوجو الأساسية - 200 درهم', price: 200 },
    { value: 'advanced', label: 'باقة اللوجو المتقدمة - 350 درهم', price: 350 },
    { value: 'premium', label: 'باقة الهوية المتكاملة - 600 درهم', price: 600 }
  ];

  const businessTypes = [
    'تقنية ومعلومات',
    'طبية وصحية',
    'تعليمية',
    'مطاعم وضيافة',
    'تجارة وبيع التجزئة',
    'خدمات مالية',
    'عقارات',
    'رياضة ولياقة',
    'جمال وتجميل',
    'استشارات',
    'أخرى'
  ];

  const stylePreferences = [
    { value: 'modern', label: 'عصري ومعاصر' },
    { value: 'classic', label: 'كلاسيكي وتقليدي' },
    { value: 'minimalist', label: 'بسيط ومينيمال' },
    { value: 'bold', label: 'جريء وقوي' },
    { value: 'elegant', label: 'أنيق وراقي' },
    { value: 'playful', label: 'مرح وإبداعي' },
    { value: 'professional', label: 'مهني وجدي' },
    { value: 'artistic', label: 'فني وإبداعي' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
      const maxSize = 5 * 1024 * 1024; // 5MB per file
      
      const validFiles = Array.from(files).filter(file => {
        if (!allowedTypes.includes(file.type)) {
          alert(`نوع الملف ${file.name} غير مدعوم. يرجى رفع صور أو ملفات PDF فقط`);
          return false;
        }
        if (file.size > maxSize) {
          alert(`حجم الملف ${file.name} كبير جداً. الحد الأقصى 5MB`);
          return false;
        }
        return true;
      });

      if (validFiles.length > 0) {
        setFormData(prev => ({
          ...prev,
          inspirationFiles: validFiles
        }));
      }
    }
  };

  const handleStyleChange = (styleValue) => {
    setFormData(prev => ({
      ...prev,
      stylePreferences: prev.stylePreferences.includes(styleValue)
        ? prev.stylePreferences.filter(s => s !== styleValue)
        : [...prev.stylePreferences, styleValue]
    }));
  };

  const calculateTotal = () => {
    const packagePrice = logoPackages.find(p => p.value === formData.logoPackage)?.price || 0;
    return packagePrice;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitStatus('');
    setErrorDetails('');

    console.log('🚀 بدء معالجة طلب اللوجو:', formData);

    try {
      setSubmitStatus('جاري حفظ طلب اللوجو في قاعدة البيانات...');

      const logoOrderData = {
        ...formData,
        totalPrice: calculateTotal(),
        timestamp: new Date().toISOString()
      };

      console.log('📦 بيانات طلب اللوجو:', logoOrderData);

      // حفظ الطلب في Supabase
      const result = await saveLogoOrderToDatabase(logoOrderData);
      console.log('📥 نتيجة حفظ طلب اللوجو:', result);

      if (result.success) {
        setSubmitStatus('✅ تم حفظ طلب اللوجو بنجاح!');
        
        // إضافة الطلب إلى الحالة المحلية
        const localOrderData = {
          ...logoOrderData,
          id: result.orderId,
          status: 'جديد',
          date: new Date().toLocaleDateString('ar-AE')
        };

        if (onSubmit) {
          onSubmit(localOrderData);
        }

        setIsSubmitted(true);

        // إعادة تعيين النموذج
        setTimeout(() => {
          setIsSubmitted(false);
          setSubmitStatus('');
          setErrorDetails('');
          setFormData({
            name: '',
            email: '',
            phone: '',
            businessName: '',
            businessType: '',
            logoPackage: '',
            stylePreferences: [],
            colorPreferences: '',
            notes: '',
            inspirationFiles: null
          });
        }, 5000);
      } else {
        setSubmitStatus('❌ فشل في حفظ طلب اللوجو');
        setErrorDetails(result.message || result.error || 'خطأ غير معروف');
        setTimeout(() => {
          setSubmitStatus('');
          setErrorDetails('');
        }, 5000);
      }
    } catch (error) {
      console.error('💥 خطأ عام في إرسال طلب اللوجو:', error);
      setSubmitStatus('❌ حدث خطأ غير متوقع');
      setErrorDetails(`تفاصيل الخطأ: ${error.message}`);
      setTimeout(() => {
        setSubmitStatus('');
        setErrorDetails('');
      }, 5000);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <section id="logo-order" className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto bg-white rounded-2xl p-8 text-center shadow-2xl"
          >
            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <SafeIcon icon={FiCheckCircle} className="text-white text-2xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">تم إرسال طلب اللوجو بنجاح!</h3>
            <p className="text-gray-600 mb-6">
              شكراً لك على ثقتك بنا. تم حفظ تفاصيل طلب اللوجو وسنتواصل معك قريباً لبدء التصميم.
            </p>
            <div className="bg-purple-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-purple-800">
                <strong>إجمالي المبلغ:</strong> {calculateTotal()} درهم
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-800">
                <strong>اسم الشركة:</strong> {formData.businessName}
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="logo-order" className="py-20 bg-gradient-to-br from-purple-50 to-pink-50" dir="rtl">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-4">
            <SafeIcon icon={FiPenTool} className="text-4xl text-purple-600 ml-3" />
            <h2 className="text-4xl font-bold text-gray-800">اطلب تصميم لوجو احترافي</h2>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            املأ النموذج أدناه وسيتم حفظ طلب اللوجو في قاعدة البيانات وسنبدأ العمل على تصميمك
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-2xl p-8"
          >
            <div className="grid md:grid-cols-2 gap-12">
              {/* معلومات العميل والشركة */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <SafeIcon icon={FiUser} className="mr-3 text-purple-600 text-xl" />
                  معلومات العميل والشركة
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسمك الكامل *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors text-right"
                    placeholder="أدخل اسمك الكامل"
                    dir="rtl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    البريد الإلكتروني *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors text-right"
                    placeholder="example@email.com"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رقم الهاتف *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors text-right"
                    placeholder="+971 XX XXX XXXX"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسم الشركة أو المشروع *
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors text-right"
                    placeholder="اسم شركتك أو مشروعك"
                    dir="rtl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نوع النشاط التجاري *
                  </label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors text-right"
                    dir="rtl"
                  >
                    <option value="">اختر نوع النشاط</option>
                    {businessTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* رفع ملفات الإلهام */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ملفات إلهام أو مراجع (اختياري)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      id="inspirationFiles"
                      onChange={handleFileChange}
                      accept="image/*,application/pdf"
                      multiple
                      className="hidden"
                    />
                    <label
                      htmlFor="inspirationFiles"
                      className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-500 transition-colors flex items-center justify-center gap-2"
                    >
                      <SafeIcon icon={FiUpload} className="text-gray-400" />
                      <span className="text-gray-600">
                        {formData.inspirationFiles ? 
                          `تم اختيار ${formData.inspirationFiles.length} ملف` : 
                          'اختر صور أو ملفات للإلهام'
                        }
                      </span>
                    </label>
                    {formData.inspirationFiles && formData.inspirationFiles.length > 0 && (
                      <div className="mt-2 text-sm text-purple-600">
                        <SafeIcon icon={FiFile} className="inline ml-1" />
                        <span>تم اختيار {formData.inspirationFiles.length} ملف</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    الأنواع المدعومة: JPG, PNG, GIF, PDF - أقصى حجم: 5MB لكل ملف
                  </p>
                </div>
              </div>

              {/* تفاصيل التصميم والباقة */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <SafeIcon icon={FiPenTool} className="mr-3 text-purple-600 text-xl" />
                  تفاصيل التصميم
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    اختر باقة اللوجو *
                  </label>
                  <div className="space-y-3">
                    {logoPackages.map((pkg) => (
                      <label
                        key={pkg.value}
                        className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-purple-300 cursor-pointer transition-colors"
                      >
                        <input
                          type="radio"
                          name="logoPackage"
                          value={pkg.value}
                          checked={formData.logoPackage === pkg.value}
                          onChange={handleInputChange}
                          className="text-purple-600 focus:ring-purple-500 ml-3"
                        />
                        <div className="flex-1">
                          <span className="text-gray-700 font-medium">{pkg.label}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    أسلوب التصميم المفضل (يمكن اختيار أكثر من واحد)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {stylePreferences.map((style) => (
                      <label
                        key={style.value}
                        className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-purple-300 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={formData.stylePreferences.includes(style.value)}
                          onChange={() => handleStyleChange(style.value)}
                          className="text-purple-600 focus:ring-purple-500 ml-2"
                        />
                        <span className="text-sm text-gray-700">{style.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <SafeIcon icon={FiPalette} className="inline ml-1" />
                    تفضيلات الألوان
                  </label>
                  <input
                    type="text"
                    name="colorPreferences"
                    value={formData.colorPreferences}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors text-right"
                    placeholder="مثال: أزرق وأبيض، ألوان دافئة، أو اتركه فارغاً للحصول على اقتراحات"
                    dir="rtl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ملاحظات وتفاصيل إضافية
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors text-right"
                    placeholder="أي متطلبات خاصة، رسالة الشركة، الجمهور المستهدف، أو أي معلومات أخرى تساعدنا في التصميم..."
                    dir="rtl"
                  />
                </div>

                {/* ملخص السعر */}
                {formData.logoPackage && (
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border-r-4 border-purple-500">
                    <h4 className="font-bold text-gray-800 mb-4 flex items-center text-lg">
                      <SafeIcon icon={FiDollarSign} className="mr-2 text-purple-600" />
                      ملخص السعر
                    </h4>
                    <div className="space-y-2 text-gray-700">
                      <div className="flex justify-between items-center">
                        <span>الباقة المختارة:</span>
                        <span className="font-semibold text-purple-600">
                          {logoPackages.find(p => p.value === formData.logoPackage)?.price || 0} درهم
                        </span>
                      </div>
                      <hr className="my-3 border-gray-300" />
                      <div className="flex justify-between items-center text-xl">
                        <span className="font-bold text-gray-800">المجموع الكلي:</span>
                        <span className="font-bold text-purple-600 text-2xl">
                          {calculateTotal()} درهم
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* حالة الإرسال */}
            {(submitStatus || errorDetails) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-6 p-4 rounded-lg ${
                  submitStatus.includes('✅')
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : submitStatus.includes('❌')
                    ? 'bg-red-50 text-red-800 border border-red-200'
                    : 'bg-blue-50 text-blue-800 border border-blue-200'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {isLoading && <SafeIcon icon={FiLoader} className="animate-spin" />}
                    {submitStatus.includes('✅') && <SafeIcon icon={FiCheckCircle} />}
                    {submitStatus.includes('❌') && <SafeIcon icon={FiAlertCircle} />}
                    <span className="font-medium">{submitStatus}</span>
                  </div>
                  {errorDetails && (
                    <div className="text-sm bg-red-100 p-3 rounded border-l-4 border-red-500">
                      <strong>تفاصيل الخطأ:</strong>
                      <br />
                      {errorDetails}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            <div className="mt-12 text-center">
              <motion.button
                type="submit"
                disabled={isLoading || !formData.logoPackage || !formData.name || !formData.email || !formData.phone || !formData.businessName || !formData.businessType}
                whileHover={{ scale: isLoading ? 1 : 1.05 }}
                whileTap={{ scale: isLoading ? 1 : 0.95 }}
                className={`px-16 py-4 rounded-full font-bold text-lg shadow-lg transition-all ${
                  isLoading || !formData.logoPackage || !formData.name || !formData.email || !formData.phone || !formData.businessName || !formData.businessType
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-xl'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <SafeIcon icon={FiLoader} className="animate-spin" />
                    جاري إرسال الطلب...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <SafeIcon icon={FiPenTool} />
                    إرسال طلب اللوجو
                  </div>
                )}
              </motion.button>
              <p className="text-sm text-gray-500 mt-4">
                سيتم حفظ طلب اللوجو في قاعدة البيانات وسنتواصل معك خلال 24 ساعة
              </p>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default LogoOrderForm;