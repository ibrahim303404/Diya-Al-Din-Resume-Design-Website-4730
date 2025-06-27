import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { saveOrderToDatabase, testDatabaseConnection } from '../services/supabaseOrderService';

const { FiUser, FiMail, FiPhone, FiFileText, FiDollarSign, FiSend, FiUpload, FiFile, FiLoader, FiAlertCircle, FiCheckCircle } = FiIcons;

const OrderForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    package: '',
    profession: '',
    experience: '',
    additionalServices: [],
    notes: '',
    existingCV: null
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [errorDetails, setErrorDetails] = useState('');

  const packages = [
    { value: 'basic', label: 'الباقة الأساسية - 150 درهم', price: 150 },
    { value: 'advanced', label: 'الباقة المتقدمة - 250 درهم', price: 250 },
    { value: 'premium', label: 'الباقة الذهبية - 400 درهم', price: 400 }
  ];

  const additionalServices = [
    { value: 'update', label: 'تحديث السيرة الذاتية', price: 75 },
    { value: 'translation', label: 'ترجمة إلى الإنجليزية', price: 100 },
    { value: 'cover-letter', label: 'خطاب تعريفي إضافي', price: 50 },
    { value: 'linkedin', label: 'تحسين ملف LinkedIn', price: 125 }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];

      if (allowedTypes.includes(file.type)) {
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
          alert('حجم الملف كبير جداً. الحد الأقصى 10MB');
          return;
        }
        setFormData(prev => ({
          ...prev,
          existingCV: file
        }));
      } else {
        alert('يرجى رفع ملف PDF أو Word فقط');
      }
    }
  };

  const handleServiceChange = (serviceValue) => {
    setFormData(prev => ({
      ...prev,
      additionalServices: prev.additionalServices.includes(serviceValue)
        ? prev.additionalServices.filter(s => s !== serviceValue)
        : [...prev.additionalServices, serviceValue]
    }));
  };

  const calculateTotal = () => {
    const packagePrice = packages.find(p => p.value === formData.package)?.price || 0;
    const servicesPrice = formData.additionalServices.reduce((total, service) => {
      const serviceObj = additionalServices.find(s => s.value === service);
      return total + (serviceObj?.price || 0);
    }, 0);
    return packagePrice + servicesPrice;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitStatus('');
    setErrorDetails('');

    console.log('🚀 بدء معالجة الطلب:', formData);

    try {
      setSubmitStatus('جاري حفظ الطلب في قاعدة البيانات...');

      const orderData = {
        ...formData,
        totalPrice: calculateTotal(),
        timestamp: new Date().toISOString()
      };

      console.log('📦 بيانات الطلب:', orderData);

      // حفظ الطلب في Supabase
      const result = await saveOrderToDatabase(orderData);

      console.log('📥 نتيجة حفظ الطلب:', result);

      if (result.success) {
        setSubmitStatus('✅ تم حفظ الطلب بنجاح!');
        
        // إضافة الطلب إلى الحالة المحلية
        const localOrderData = {
          ...orderData,
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
            package: '',
            profession: '',
            experience: '',
            additionalServices: [],
            notes: '',
            existingCV: null
          });
        }, 5000);
      } else {
        setSubmitStatus('❌ فشل في حفظ الطلب');
        setErrorDetails(result.message || result.error || 'خطأ غير معروف');
        
        setTimeout(() => {
          setSubmitStatus('');
          setErrorDetails('');
        }, 5000);
      }
    } catch (error) {
      console.error('💥 خطأ عام في إرسال الطلب:', error);
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
      <section id="order" className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto bg-white rounded-2xl p-8 text-center shadow-2xl"
          >
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <SafeIcon icon={FiCheckCircle} className="text-white text-2xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">تم إرسال طلبك بنجاح!</h3>
            <p className="text-gray-600 mb-6">
              شكراً لك على ثقتك بنا. تم حفظ تفاصيل طلبك وسنتواصل معك قريباً.
            </p>
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-800">
                <strong>إجمالي المبلغ:</strong> {calculateTotal()} درهم
              </p>
            </div>
            {formData.existingCV && (
              <div className="bg-green-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-green-800">
                  <strong>الملف المرفق:</strong> {formData.existingCV.name}
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="order" className="py-20 bg-gradient-to-br from-blue-50 to-purple-50" dir="rtl">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4">اطلب سيرتك الذاتية الآن</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            املأ النموذج أدناه وسيتم حفظ طلبك في قاعدة البيانات
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
              {/* المعلومات الشخصية */}
              <div className="order-1 space-y-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <SafeIcon icon={FiUser} className="mr-3 text-blue-600 text-xl" />
                  المعلومات الشخصية
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الاسم الكامل *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-right"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-right"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-right"
                    placeholder="+971 XX XXX XXXX"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المهنة/التخصص *
                  </label>
                  <input
                    type="text"
                    name="profession"
                    value={formData.profession}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-right"
                    placeholder="مثال: مهندس برمجيات"
                    dir="rtl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    سنوات الخبرة
                  </label>
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-right"
                    dir="rtl"
                  >
                    <option value="">اختر سنوات الخبرة</option>
                    <option value="fresh">خريج جديد</option>
                    <option value="1-2">1-2 سنة</option>
                    <option value="3-5">3-5 سنوات</option>
                    <option value="6-10">6-10 سنوات</option>
                    <option value="10+">أكثر من 10 سنوات</option>
                  </select>
                </div>

                {/* رفع ملف */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رفع سيرة ذاتية سابقة (اختياري)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      id="cvFile"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                    />
                    <label
                      htmlFor="cvFile"
                      className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors flex items-center justify-center gap-2"
                    >
                      <SafeIcon icon={FiUpload} className="text-gray-400" />
                      <span className="text-gray-600">
                        {formData.existingCV ? formData.existingCV.name : 'اختر ملف PDF أو Word'}
                      </span>
                    </label>
                    {formData.existingCV && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                        <SafeIcon icon={FiFile} />
                        <span>تم اختيار: {formData.existingCV.name}</span>
                        <span className="text-xs text-gray-500">
                          ({(formData.existingCV.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    الأنواع المدعومة: PDF, DOC, DOCX - أقصى حجم: 10MB
                  </p>
                </div>
              </div>

              {/* تفاصيل الطلب */}
              <div className="order-2 space-y-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <SafeIcon icon={FiFileText} className="mr-3 text-blue-600 text-xl" />
                  تفاصيل الطلب
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    اختر الباقة *
                  </label>
                  <div className="space-y-3">
                    {packages.map((pkg) => (
                      <label
                        key={pkg.value}
                        className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors"
                      >
                        <input
                          type="radio"
                          name="package"
                          value={pkg.value}
                          checked={formData.package === pkg.value}
                          onChange={handleInputChange}
                          className="text-blue-600 focus:ring-blue-500 ml-3"
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
                    خدمات إضافية
                  </label>
                  <div className="space-y-3">
                    {additionalServices.map((service) => (
                      <label
                        key={service.value}
                        className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={formData.additionalServices.includes(service.value)}
                          onChange={() => handleServiceChange(service.value)}
                          className="text-blue-600 focus:ring-blue-500 ml-3"
                        />
                        <div className="flex-1 flex justify-between items-center">
                          <span className="text-gray-700">{service.label}</span>
                          <span className="text-blue-600 font-semibold">{service.price} درهم</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ملاحظات إضافية
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-right"
                    placeholder="أي متطلبات خاصة أو ملاحظات..."
                    dir="rtl"
                  />
                </div>

                {/* ملخص السعر */}
                {formData.package && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border-r-4 border-blue-500">
                    <h4 className="font-bold text-gray-800 mb-4 flex items-center text-lg">
                      <SafeIcon icon={FiDollarSign} className="mr-2 text-blue-600" />
                      ملخص السعر
                    </h4>
                    <div className="space-y-2 text-gray-700">
                      <div className="flex justify-between items-center">
                        <span>الباقة المختارة:</span>
                        <span className="font-semibold text-blue-600">
                          {packages.find(p => p.value === formData.package)?.price || 0} درهم
                        </span>
                      </div>
                      {formData.additionalServices.length > 0 && (
                        <div className="flex justify-between items-center">
                          <span>الخدمات الإضافية:</span>
                          <span className="font-semibold text-blue-600">
                            {formData.additionalServices.reduce((total, service) => {
                              const serviceObj = additionalServices.find(s => s.value === service);
                              return total + (serviceObj?.price || 0);
                            }, 0)} درهم
                          </span>
                        </div>
                      )}
                      <hr className="my-3 border-gray-300" />
                      <div className="flex justify-between items-center text-xl">
                        <span className="font-bold text-gray-800">المجموع الكلي:</span>
                        <span className="font-bold text-green-600 text-2xl">
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
                disabled={isLoading || !formData.package || !formData.name || !formData.email || !formData.phone || !formData.profession}
                whileHover={{ scale: isLoading ? 1 : 1.05 }}
                whileTap={{ scale: isLoading ? 1 : 0.95 }}
                className={`px-16 py-4 rounded-full font-bold text-lg shadow-lg transition-all ${
                  isLoading || !formData.package || !formData.name || !formData.email || !formData.phone || !formData.profession
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-xl'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <SafeIcon icon={FiLoader} className="animate-spin" />
                    جاري الإرسال...
                  </div>
                ) : (
                  'إرسال الطلب'
                )}
              </motion.button>
              <p className="text-sm text-gray-500 mt-4">
                سيتم حفظ طلبك في قاعدة البيانات بأمان
              </p>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default OrderForm;