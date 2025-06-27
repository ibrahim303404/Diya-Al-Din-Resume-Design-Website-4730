import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiLock, FiMail, FiEye, FiEyeOff, FiCheck } = FiIcons;

const AdminLogin = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // تحميل البيانات المحفوظة عند تحميل المكون
  useEffect(() => {
    const savedCredentials = localStorage.getItem('adminCredentials');
    const savedRememberMe = localStorage.getItem('adminRememberMe');
    
    if (savedCredentials && savedRememberMe === 'true') {
      try {
        const parsedCredentials = JSON.parse(savedCredentials);
        setCredentials(parsedCredentials);
        setRememberMe(true);
        console.log('✅ تم تحميل البيانات المحفوظة');
      } catch (error) {
        console.error('❌ خطأ في تحميل البيانات المحفوظة:', error);
        // مسح البيانات التالفة
        localStorage.removeItem('adminCredentials');
        localStorage.removeItem('adminRememberMe');
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // محاكاة تأخير تسجيل الدخول للتأثير البصري
    await new Promise(resolve => setTimeout(resolve, 800));

    if (credentials.email === 'nestaman2@gmail.com' && credentials.password === '606707606') {
      // حفظ البيانات إذا تم اختيار "تذكرني"
      if (rememberMe) {
        try {
          localStorage.setItem('adminCredentials', JSON.stringify(credentials));
          localStorage.setItem('adminRememberMe', 'true');
          localStorage.setItem('adminLoginTime', new Date().toISOString());
          console.log('✅ تم حفظ بيانات تسجيل الدخول');
        } catch (error) {
          console.error('❌ خطأ في حفظ البيانات:', error);
        }
      } else {
        // مسح البيانات المحفوظة إذا لم يتم اختيار "تذكرني"
        localStorage.removeItem('adminCredentials');
        localStorage.removeItem('adminRememberMe');
        localStorage.removeItem('adminLoginTime');
      }

      onLogin(true);
      setError('');
    } else {
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }
    
    setIsLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const clearSavedCredentials = () => {
    localStorage.removeItem('adminCredentials');
    localStorage.removeItem('adminRememberMe');
    localStorage.removeItem('adminLoginTime');
    setCredentials({ email: '', password: '' });
    setRememberMe(false);
    console.log('🗑️ تم مسح البيانات المحفوظة');
  };

  // التحقق من وجود بيانات محفوظة لإظهار خيار المسح
  const hasSavedCredentials = localStorage.getItem('adminCredentials') && localStorage.getItem('adminRememberMe') === 'true';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <SafeIcon icon={FiLock} className="text-white text-2xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">لوحة التحكم</h2>
          <p className="text-gray-600 mt-2">قم بتسجيل الدخول للوصول إلى الطلبات</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              البريد الإلكتروني
            </label>
            <div className="relative">
              <SafeIcon 
                icon={FiMail} 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
              />
              <input
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="أدخل البريد الإلكتروني"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              كلمة المرور
            </label>
            <div className="relative">
              <SafeIcon 
                icon={FiLock} 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
              />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={credentials.password}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="أدخل كلمة المرور"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
              >
                <SafeIcon icon={showPassword ? FiEyeOff : FiEye} />
              </button>
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center justify-between">
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={handleRememberMeChange}
                  disabled={isLoading}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded border-2 transition-colors duration-200 ${
                  rememberMe 
                    ? 'bg-blue-600 border-blue-600' 
                    : 'bg-white border-gray-300 hover:border-blue-400'
                } ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                  {rememberMe && (
                    <SafeIcon 
                      icon={FiCheck} 
                      className="text-white text-xs absolute top-0.5 left-0.5" 
                    />
                  )}
                </div>
              </div>
              <span className={`mr-3 text-sm text-gray-700 ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                تذكر بيانات تسجيل الدخول
              </span>
            </label>

            {/* Clear Saved Data Button */}
            {hasSavedCredentials && (
              <button
                type="button"
                onClick={clearSavedCredentials}
                disabled={isLoading}
                className="text-xs text-red-600 hover:text-red-700 underline disabled:cursor-not-allowed disabled:opacity-50"
              >
                مسح البيانات المحفوظة
              </button>
            )}
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm"
            >
              {error}
            </motion.div>
          )}

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            className={`w-full py-3 rounded-lg font-semibold shadow-lg transition-all duration-200 ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-xl'
            } text-white`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                جاري تسجيل الدخول...
              </div>
            ) : (
              'تسجيل الدخول'
            )}
          </motion.button>
        </form>

        {/* Security Note */}
        {rememberMe && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
          >
            <div className="flex items-start gap-2">
              <SafeIcon icon={FiLock} className="text-yellow-600 text-sm mt-0.5" />
              <div>
                <p className="text-xs text-yellow-800 font-medium">ملاحظة أمنية</p>
                <p className="text-xs text-yellow-700 mt-1">
                  سيتم حفظ بيانات تسجيل الدخول على هذا الجهاز فقط. تأكد من أن الجهاز آمن وشخصي.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <div className="mt-6 text-center">
          <a 
            href="/" 
            className="text-blue-600 hover:text-blue-700 text-sm transition-colors"
          >
            العودة إلى الموقع الرئيسي
          </a>
        </div>

        {/* Debug Info in Development */}
        {process.env.NODE_ENV === 'development' && hasSavedCredentials && (
          <div className="mt-4 p-2 bg-gray-50 rounded text-xs text-gray-600">
            <p>🔧 وضع التطوير - البيانات محفوظة</p>
            <p>📧 البريد: {credentials.email}</p>
            <p>🕐 آخر تسجيل دخول: {localStorage.getItem('adminLoginTime') ? new Date(localStorage.getItem('adminLoginTime')).toLocaleString('ar-AE') : 'غير متاح'}</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminLogin;