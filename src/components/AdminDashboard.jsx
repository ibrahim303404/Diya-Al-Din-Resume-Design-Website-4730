import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { 
  getAllOrders, 
  updateOrderStatus, 
  deleteOrder, 
  subscribeToNewOrders, 
  unsubscribeFromOrders, 
  downloadFileDirectly, 
  testStorageConnection 
} from '../services/supabaseOrderService';
import { 
  getAllLogoOrders, 
  updateLogoOrderStatus, 
  deleteLogoOrder, 
  subscribeToNewLogoOrders, 
  unsubscribeFromLogoOrders,
  downloadLogoInspirationFile,
  testLogoStorageConnection
} from '../services/supabaseLogoService';

const { 
  FiHome, FiLogOut, FiUsers, FiDollarSign, FiClock, FiCheck, FiX, FiEye, 
  FiEdit, FiTrash2, FiRefreshCw, FiDownload, FiFile, FiAlertCircle, 
  FiCheckCircle, FiUpload, FiCloud, FiFileText, FiPenTool, FiImage, FiUser 
} = FiIcons;

const AdminDashboard = () => {
  const [cvOrders, setCvOrders] = useState([]);
  const [logoOrders, setLogoOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedLogoOrder, setSelectedLogoOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [storageStatus, setStorageStatus] = useState('unknown');
  const [logoStorageStatus, setLogoStorageStatus] = useState('unknown');
  const [activeTab, setActiveTab] = useState('cv'); // 'cv' or 'logo'

  useEffect(() => {
    // جلب الطلبات عند تحميل الصفحة
    loadOrders();
    loadLogoOrders();
    
    // اختبار Storage
    checkStorageStatus();
    checkLogoStorageStatus();
    
    // الاستماع للطلبات الجديدة في الوقت الفعلي
    const cvSubscription = subscribeToNewOrders((newOrder) => {
      setCvOrders(prev => [newOrder, ...prev]);
      // إشعار صوتي أو بصري للطلب الجديد
      if (Notification.permission === 'granted') {
        new Notification('طلب سيرة ذاتية جديد!', {
          body: `طلب جديد من ${newOrder.customer_name}`,
          icon: '/favicon.ico'
        });
      }
    });

    const logoSubscription = subscribeToNewLogoOrders((newOrder) => {
      setLogoOrders(prev => [newOrder, ...prev]);
      // إشعار صوتي أو بصري للطلب الجديد
      if (Notification.permission === 'granted') {
        new Notification('طلب لوجو جديد!', {
          body: `طلب لوجو جديد من ${newOrder.customer_name}`,
          icon: '/favicon.ico'
        });
      }
    });
    
    // طلب إذن الإشعارات
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
    
    return () => {
      unsubscribeFromOrders(cvSubscription);
      unsubscribeFromLogoOrders(logoSubscription);
    };
  }, []);

  const checkStorageStatus = async () => {
    try {
      const result = await testStorageConnection();
      setStorageStatus(result.success ? 'working' : 'error');
      if (!result.success) {
        console.warn('CV Storage غير متاح:', result.error);
      }
    } catch (error) {
      setStorageStatus('error');
      console.error('خطأ في اختبار CV Storage:', error);
    }
  };

  const checkLogoStorageStatus = async () => {
    try {
      const result = await testLogoStorageConnection();
      setLogoStorageStatus(result.success ? 'working' : 'error');
      if (!result.success) {
        console.warn('Logo Storage غير متاح:', result.error);
      }
    } catch (error) {
      setLogoStorageStatus('error');
      console.error('خطأ في اختبار Logo Storage:', error);
    }
  };

  const loadOrders = async () => {
    try {
      setLoading(true);
      const result = await getAllOrders();
      if (result.success) {
        setCvOrders(result.orders);
      } else {
        setError('فشل في جلب طلبات السير الذاتية');
      }
    } catch (err) {
      setError('حدث خطأ في جلب طلبات السير الذاتية');
    }
  };

  const loadLogoOrders = async () => {
    try {
      const result = await getAllLogoOrders();
      if (result.success) {
        setLogoOrders(result.orders);
      } else {
        setError('فشل في جلب طلبات اللوجو');
      }
    } catch (err) {
      setError('حدث خطأ في جلب طلبات اللوجو');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCvOrderStatus = async (orderId, newStatus) => {
    try {
      const result = await updateOrderStatus(orderId, newStatus);
      if (result.success) {
        setCvOrders(prev => prev.map(order => 
          order.id === orderId ? { ...order, order_status: newStatus } : order
        ));
      } else {
        alert('فشل في تحديث حالة الطلب');
      }
    } catch (err) {
      alert('حدث خطأ في تحديث الطلب');
    }
  };

  const handleUpdateLogoOrderStatus = async (orderId, newStatus) => {
    try {
      const result = await updateLogoOrderStatus(orderId, newStatus);
      if (result.success) {
        setLogoOrders(prev => prev.map(order => 
          order.id === orderId ? { ...order, order_status: newStatus } : order
        ));
      } else {
        alert('فشل في تحديث حالة طلب اللوجو');
      }
    } catch (err) {
      alert('حدث خطأ في تحديث طلب اللوجو');
    }
  };

  const handleDeleteCvOrder = async (orderId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
      try {
        const result = await deleteOrder(orderId);
        if (result.success) {
          setCvOrders(prev => prev.filter(order => order.id !== orderId));
        } else {
          alert('فشل في حذف الطلب');
        }
      } catch (err) {
        alert('حدث خطأ في حذف الطلب');
      }
    }
  };

  const handleDeleteLogoOrder = async (orderId) => {
    if (window.confirm('هل أنت متأكد من حذف طلب اللوجو؟')) {
      try {
        const result = await deleteLogoOrder(orderId);
        if (result.success) {
          setLogoOrders(prev => prev.filter(order => order.id !== orderId));
        } else {
          alert('فشل في حذف طلب اللوجو');
        }
      } catch (err) {
        alert('حدث خطأ في حذف طلب اللوجو');
      }
    }
  };

  // تحميل الملف المرفوع (للسير الذاتية)
  const handleDownloadFile = async (order) => {
    try {
      if (!order.existing_cv_filename) {
        alert('لا يوجد ملف مرفق مع هذا الطلب');
        return;
      }
      
      console.log('🔄 بدء تحميل الملف:', order.existing_cv_filename);
      const result = await downloadFileDirectly(order);
      
      if (result.success) {
        console.log('✅ تم تحميل الملف بنجاح');
        if (result.fallback) {
          alert('تم تحميل ملف معلومات الطلب (الملف الأصلي غير متاح)');
        }
      } else {
        alert(`حدث خطأ في تحميل الملف: ${result.error}`);
      }
    } catch (error) {
      console.error('خطأ في تحميل الملف:', error);
      alert('حدث خطأ في تحميل الملف');
    }
  };

  // تحميل ملف الإلهام (للوجو)
  const handleDownloadLogoFile = async (order) => {
    try {
      if (!order.inspiration_files) {
        alert('لا يوجد ملف إلهام مرفق مع طلب اللوجو');
        return;
      }
      
      console.log('🔄 بدء تحميل ملف الإلهام:', order.inspiration_files);
      const result = await downloadLogoInspirationFile(order);
      
      if (result.success) {
        console.log('✅ تم تحميل ملف الإلهام بنجاح');
        if (result.fallback) {
          alert('تم تحميل ملف معلومات طلب اللوجو (الملف الأصلي غير متاح)');
        }
      } else {
        alert(`حدث خطأ في تحميل ملف الإلهام: ${result.error}`);
      }
    } catch (error) {
      console.error('خطأ في تحميل ملف الإلهام:', error);
      alert('حدث خطأ في تحميل ملف الإلهام');
    }
  };

  // معاينة معلومات الملف للسير الذاتية
  const getFileInfo = (order) => {
    if (!order.existing_cv_filename) {
      return {
        hasFile: false,
        filename: 'لا يوجد',
        fileType: '',
        fileIcon: FiAlertCircle,
        iconColor: 'text-gray-400',
        uploadStatus: 'none'
      };
    }
    
    const filename = order.existing_cv_filename || 'ملف غير معروف';
    const extension = filename.split('.').pop()?.toLowerCase();
    let fileIcon = FiFile;
    let iconColor = 'text-blue-500';
    let fileType = 'مستند';
    
    switch (extension) {
      case 'pdf':
        fileIcon = FiFile;
        iconColor = 'text-red-500';
        fileType = 'PDF';
        break;
      case 'doc':
      case 'docx':
        fileIcon = FiFile;
        iconColor = 'text-blue-600';
        fileType = 'Word';
        break;
      default:
        fileIcon = FiFile;
        iconColor = 'text-gray-500';
        fileType = 'مستند';
    }
    
    return {
      hasFile: true,
      filename,
      fileType,
      fileIcon,
      iconColor,
      uploadStatus: 'uploaded',
      statusColor: 'text-green-600',
      statusText: 'متاح'
    };
  };

  // معاينة معلومات ملف الإلهام للوجو
  const getLogoFileInfo = (order) => {
    if (!order.inspiration_files) {
      return {
        hasFile: false,
        filename: 'لا يوجد',
        fileType: '',
        fileIcon: FiAlertCircle,
        iconColor: 'text-gray-400',
        uploadStatus: 'none'
      };
    }
    
    const filename = order.inspiration_files || 'ملف إلهام غير معروف';
    const extension = filename.split('.').pop()?.toLowerCase();
    let fileIcon = FiImage;
    let iconColor = 'text-purple-500';
    let fileType = 'صورة';
    
    switch (extension) {
      case 'pdf':
        fileIcon = FiFile;
        iconColor = 'text-red-500';
        fileType = 'PDF';
        break;
      case 'jpg':
      case 'jpeg':
        fileIcon = FiImage;
        iconColor = 'text-green-500';
        fileType = 'JPG';
        break;
      case 'png':
        fileIcon = FiImage;
        iconColor = 'text-blue-500';
        fileType = 'PNG';
        break;
      case 'gif':
        fileIcon = FiImage;
        iconColor = 'text-orange-500';
        fileType = 'GIF';
        break;
      default:
        fileIcon = FiImage;
        iconColor = 'text-purple-500';
        fileType = 'صورة';
    }
    
    return {
      hasFile: true,
      filename,
      fileType,
      fileIcon,
      iconColor,
      uploadStatus: 'uploaded',
      statusColor: 'text-green-600',
      statusText: 'متاح'
    };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'جديد': return 'bg-blue-100 text-blue-800';
      case 'قيد التنفيذ': return 'bg-yellow-100 text-yellow-800';
      case 'مكتمل': return 'bg-green-100 text-green-800';
      case 'ملغي': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPackageDisplayName = (packageType) => {
    const cvPackages = {
      'basic': 'أساسية',
      'advanced': 'متقدمة', 
      'premium': 'ذهبية'
    };
    const logoPackages = {
      'basic': 'أساسية',
      'advanced': 'متقدمة',
      'premium': 'متكاملة'
    };
    return cvPackages[packageType] || logoPackages[packageType] || packageType;
  };

  // دالة تسجيل الخروج مع مسح البيانات المحفوظة
  const handleLogout = () => {
    const confirmLogout = window.confirm('هل تريد تسجيل الخروج؟');
    if (confirmLogout) {
      // السؤال عن حذف البيانات المحفوظة
      const clearSavedData = window.confirm('هل تريد حذف بيانات تسجيل الدخول المحفوظة؟');
      if (clearSavedData) {
        localStorage.removeItem('adminCredentials');
        localStorage.removeItem('adminRememberMe');
        localStorage.removeItem('adminLoginTime');
        console.log('🗑️ تم مسح البيانات المحفوظة عند تسجيل الخروج');
      }
      window.location.reload();
    }
  };

  // معلومات المستخدم المسجل دخوله
  const getLoggedInUserInfo = () => {
    const savedCredentials = localStorage.getItem('adminCredentials');
    const loginTime = localStorage.getItem('adminLoginTime');
    
    if (savedCredentials) {
      try {
        const credentials = JSON.parse(savedCredentials);
        return {
          email: credentials.email,
          loginTime: loginTime ? new Date(loginTime).toLocaleString('ar-AE') : 'غير متاح'
        };
      } catch (error) {
        return null;
      }
    }
    return null;
  };

  const userInfo = getLoggedInUserInfo();

  // حساب الإحصائيات
  const totalCvRevenue = cvOrders.reduce((sum, order) => sum + (parseFloat(order.total_price) || 0), 0);
  const totalLogoRevenue = logoOrders.reduce((sum, order) => sum + (parseFloat(order.total_price) || 0), 0);
  const totalRevenue = totalCvRevenue + totalLogoRevenue;
  
  const completedCvOrders = cvOrders.filter(order => order.order_status === 'مكتمل').length;
  const completedLogoOrders = logoOrders.filter(order => order.order_status === 'مكتمل').length;
  const totalCompleted = completedCvOrders + completedLogoOrders;
  
  const pendingCvOrders = cvOrders.filter(order => order.order_status === 'جديد' || order.order_status === 'قيد التنفيذ').length;
  const pendingLogoOrders = logoOrders.filter(order => order.order_status === 'جديد' || order.order_status === 'قيد التنفيذ').length;
  const totalPending = pendingCvOrders + pendingLogoOrders;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <SafeIcon icon={FiRefreshCw} className="text-4xl text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">جاري تحميل الطلبات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">لوحة التحكم - ضياء الدين بووش</h1>
              {userInfo && (
                <div className="flex items-center gap-2 mt-1">
                  <SafeIcon icon={FiUser} className="text-sm text-gray-500" />
                  <span className="text-sm text-gray-600">{userInfo.email}</span>
                  <span className="text-xs text-gray-400">• آخر دخول: {userInfo.loginTime}</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              {/* Storage Status Indicators */}
              <div className="flex items-center space-x-4 space-x-reverse">
                {/* CV Storage */}
                <div className="flex items-center space-x-2 space-x-reverse">
                  <SafeIcon 
                    icon={storageStatus === 'working' ? FiCloud : FiAlertCircle} 
                    className={`text-sm ${storageStatus === 'working' ? 'text-green-600' : 'text-red-600'}`}
                  />
                  <span className={`text-xs ${storageStatus === 'working' ? 'text-green-600' : 'text-red-600'}`}>
                    CV Storage
                  </span>
                </div>
                
                {/* Logo Storage */}
                <div className="flex items-center space-x-2 space-x-reverse">
                  <SafeIcon 
                    icon={logoStorageStatus === 'working' ? FiCloud : FiAlertCircle} 
                    className={`text-sm ${logoStorageStatus === 'working' ? 'text-green-600' : 'text-red-600'}`}
                  />
                  <span className={`text-xs ${logoStorageStatus === 'working' ? 'text-green-600' : 'text-red-600'}`}>
                    Logo Storage
                  </span>
                </div>
              </div>
              
              <button
                onClick={() => {
                  loadOrders();
                  loadLogoOrders();
                  checkStorageStatus();
                  checkLogoStorageStatus();
                }}
                className="flex items-center space-x-2 space-x-reverse text-gray-600 hover:text-blue-600"
              >
                <SafeIcon icon={FiRefreshCw} />
                <span>تحديث</span>
              </button>
              <a href="/" className="flex items-center space-x-2 space-x-reverse text-gray-600 hover:text-blue-600">
                <SafeIcon icon={FiHome} />
                <span>الموقع الرئيسي</span>
              </a>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 space-x-reverse text-gray-600 hover:text-red-600"
              >
                <SafeIcon icon={FiLogOut} />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <div className="grid md:grid-cols-5 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إجمالي الطلبات</p>
                <p className="text-2xl font-bold text-gray-800">{cvOrders.length + logoOrders.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <SafeIcon icon={FiUsers} className="text-blue-600 text-xl" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">الطلبات المعلقة</p>
                <p className="text-2xl font-bold text-yellow-600">{totalPending}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <SafeIcon icon={FiClock} className="text-yellow-600 text-xl" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">الطلبات المكتملة</p>
                <p className="text-2xl font-bold text-green-600">{totalCompleted}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <SafeIcon icon={FiCheck} className="text-green-600 text-xl" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إجمالي الإيرادات</p>
                <p className="text-2xl font-bold text-purple-600">{totalRevenue.toFixed(2)} درهم</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <SafeIcon icon={FiDollarSign} className="text-purple-600 text-xl" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">طلبات اللوجو</p>
                <p className="text-2xl font-bold text-indigo-600">{logoOrders.length}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <SafeIcon icon={FiPenTool} className="text-indigo-600 text-xl" />
              </div>
            </div>
          </motion.div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-4 space-x-reverse">
            <button
              onClick={() => setActiveTab('cv')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 space-x-reverse ${
                activeTab === 'cv' 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <SafeIcon icon={FiFileText} />
              <span>طلبات السير الذاتية ({cvOrders.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('logo')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 space-x-reverse ${
                activeTab === 'logo' 
                  ? 'bg-purple-600 text-white shadow-lg' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <SafeIcon icon={FiPenTool} />
              <span>طلبات اللوجو ({logoOrders.length})</span>
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">
              {activeTab === 'cv' ? 'طلبات السير الذاتية' : 'طلبات اللوجو'}
            </h2>
          </div>

          {/* CV Orders Table */}
          {activeTab === 'cv' && (
            <>
              {cvOrders.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  لا توجد طلبات سير ذاتية في قاعدة البيانات
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">العميل</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المهنة</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الباقة</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">السعر</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الملف المرفق</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">التاريخ</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {cvOrders.map((order) => {
                        const fileInfo = getFileInfo(order);
                        return (
                          <tr key={order.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{order.customer_name}</div>
                                <div className="text-sm text-gray-500">{order.customer_email}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {order.profession}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {getPackageDisplayName(order.package_type)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {order.total_price} درهم
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.order_status)}`}>
                                {order.order_status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {fileInfo.hasFile ? (
                                <div className="flex items-center space-x-2 space-x-reverse">
                                  <SafeIcon icon={fileInfo.fileIcon} className={`${fileInfo.iconColor} text-lg`} />
                                  <div className="flex flex-col">
                                    <span className="text-xs text-gray-700 font-medium">{fileInfo.fileType}</span>
                                    <span className={`text-xs ${fileInfo.statusColor}`}>{fileInfo.statusText}</span>
                                    <button
                                      onClick={() => handleDownloadFile(order)}
                                      className="text-xs text-blue-600 hover:text-blue-800 underline text-right"
                                      title={`تحميل ${fileInfo.filename}`}
                                    >
                                      تحميل
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center space-x-2 space-x-reverse text-gray-400">
                                  <SafeIcon icon={FiAlertCircle} />
                                  <span className="text-xs">لا يوجد</span>
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(order.order_date || order.created_at).toLocaleDateString('ar-AE')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2 space-x-reverse">
                                <button
                                  onClick={() => setSelectedOrder(order)}
                                  className="text-blue-600 hover:text-blue-900"
                                  title="عرض التفاصيل"
                                >
                                  <SafeIcon icon={FiEye} />
                                </button>
                                {fileInfo.hasFile && (
                                  <button
                                    onClick={() => handleDownloadFile(order)}
                                    className="text-green-600 hover:text-green-900"
                                    title="تحميل الملف المرفق"
                                  >
                                    <SafeIcon icon={FiDownload} />
                                  </button>
                                )}
                                <select
                                  value={order.order_status}
                                  onChange={(e) => handleUpdateCvOrderStatus(order.id, e.target.value)}
                                  className="text-xs border border-gray-300 rounded px-2 py-1"
                                >
                                  <option value="جديد">جديد</option>
                                  <option value="قيد التنفيذ">قيد التنفيذ</option>
                                  <option value="مكتمل">مكتمل</option>
                                  <option value="ملغي">ملغي</option>
                                </select>
                                <button
                                  onClick={() => handleDeleteCvOrder(order.id)}
                                  className="text-red-600 hover:text-red-900"
                                  title="حذف الطلب"
                                >
                                  <SafeIcon icon={FiTrash2} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* Logo Orders Table */}
          {activeTab === 'logo' && (
            <>
              {logoOrders.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  لا توجد طلبات لوجو في قاعدة البيانات
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">العميل</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">اسم الشركة</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">نوع النشاط</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الباقة</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">السعر</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">ملف الإلهام</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">التاريخ</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {logoOrders.map((order) => {
                        const logoFileInfo = getLogoFileInfo(order);
                        return (
                          <tr key={order.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{order.customer_name}</div>
                                <div className="text-sm text-gray-500">{order.customer_email}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {order.business_name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {order.business_type}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {getPackageDisplayName(order.logo_package)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {order.total_price} درهم
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.order_status)}`}>
                                {order.order_status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {logoFileInfo.hasFile ? (
                                <div className="flex items-center space-x-2 space-x-reverse">
                                  <SafeIcon icon={logoFileInfo.fileIcon} className={`${logoFileInfo.iconColor} text-lg`} />
                                  <div className="flex flex-col">
                                    <span className="text-xs text-gray-700 font-medium">{logoFileInfo.fileType}</span>
                                    <span className={`text-xs ${logoFileInfo.statusColor}`}>{logoFileInfo.statusText}</span>
                                    <button
                                      onClick={() => handleDownloadLogoFile(order)}
                                      className="text-xs text-purple-600 hover:text-purple-800 underline text-right"
                                      title={`تحميل ${logoFileInfo.filename}`}
                                    >
                                      تحميل
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center space-x-2 space-x-reverse text-gray-400">
                                  <SafeIcon icon={FiAlertCircle} />
                                  <span className="text-xs">لا يوجد</span>
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(order.order_date || order.created_at).toLocaleDateString('ar-AE')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2 space-x-reverse">
                                <button
                                  onClick={() => setSelectedLogoOrder(order)}
                                  className="text-purple-600 hover:text-purple-900"
                                  title="عرض التفاصيل"
                                >
                                  <SafeIcon icon={FiEye} />
                                </button>
                                {logoFileInfo.hasFile && (
                                  <button
                                    onClick={() => handleDownloadLogoFile(order)}
                                    className="text-green-600 hover:text-green-900"
                                    title="تحميل ملف الإلهام"
                                  >
                                    <SafeIcon icon={FiDownload} />
                                  </button>
                                )}
                                <select
                                  value={order.order_status}
                                  onChange={(e) => handleUpdateLogoOrderStatus(order.id, e.target.value)}
                                  className="text-xs border border-gray-300 rounded px-2 py-1"
                                >
                                  <option value="جديد">جديد</option>
                                  <option value="قيد التنفيذ">قيد التنفيذ</option>
                                  <option value="مكتمل">مكتمل</option>
                                  <option value="ملغي">ملغي</option>
                                </select>
                                <button
                                  onClick={() => handleDeleteLogoOrder(order.id)}
                                  className="text-red-600 hover:text-red-900"
                                  title="حذف طلب اللوجو"
                                >
                                  <SafeIcon icon={FiTrash2} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>

      {/* CV Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-96 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">تفاصيل طلب السيرة الذاتية</h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <SafeIcon icon={FiX} className="text-xl" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">الاسم</label>
                  <p className="text-gray-900">{selectedOrder.customer_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">البريد الإلكتروني</label>
                  <p className="text-gray-900">{selectedOrder.customer_email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">الهاتف</label>
                  <p className="text-gray-900">{selectedOrder.customer_phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">المهنة</label>
                  <p className="text-gray-900">{selectedOrder.profession}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">سنوات الخبرة</label>
                  <p className="text-gray-900">{selectedOrder.experience || 'غير محدد'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">الباقة</label>
                  <p className="text-gray-900">{selectedOrder.package_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">رقم الطلب</label>
                  <p className="text-gray-900">{selectedOrder.order_id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">الملف المرفق</label>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    {selectedOrder.existing_cv_filename ? (
                      <>
                        <SafeIcon icon={FiFile} className="text-blue-500" />
                        <div className="flex flex-col">
                          <span className="text-gray-900 text-sm">{selectedOrder.existing_cv_filename}</span>
                          <span className="text-xs text-green-600">متاح</span>
                        </div>
                        <button
                          onClick={() => handleDownloadFile(selectedOrder)}
                          className="text-blue-600 hover:text-blue-800 underline text-sm"
                        >
                          تحميل
                        </button>
                      </>
                    ) : (
                      <span className="text-gray-500">لا يوجد</span>
                    )}
                  </div>
                </div>
              </div>
              {selectedOrder.additional_services && selectedOrder.additional_services.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الخدمات الإضافية</label>
                  <ul className="list-disc list-inside text-gray-900">
                    {selectedOrder.additional_services.map((service, index) => (
                      <li key={index}>{service}</li>
                    ))}
                  </ul>
                </div>
              )}
              {selectedOrder.notes && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">ملاحظات</label>
                  <p className="text-gray-900">{selectedOrder.notes}</p>
                </div>
              )}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-800">إجمالي السعر:</span>
                  <span className="text-xl font-bold text-blue-600">{selectedOrder.total_price} درهم</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Logo Order Details Modal */}
      {selectedLogoOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-96 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">تفاصيل طلب اللوجو</h3>
              <button
                onClick={() => setSelectedLogoOrder(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <SafeIcon icon={FiX} className="text-xl" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">الاسم</label>
                  <p className="text-gray-900">{selectedLogoOrder.customer_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">البريد الإلكتروني</label>
                  <p className="text-gray-900">{selectedLogoOrder.customer_email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">الهاتف</label>
                  <p className="text-gray-900">{selectedLogoOrder.customer_phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">اسم الشركة</label>
                  <p className="text-gray-900">{selectedLogoOrder.business_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">نوع النشاط</label>
                  <p className="text-gray-900">{selectedLogoOrder.business_type}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">الباقة</label>
                  <p className="text-gray-900">{selectedLogoOrder.logo_package_name || getPackageDisplayName(selectedLogoOrder.logo_package)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">تفضيلات الألوان</label>
                  <p className="text-gray-900">{selectedLogoOrder.color_preferences || 'لم يحدد'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">ملف الإلهام</label>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    {selectedLogoOrder.inspiration_files ? (
                      <>
                        <SafeIcon icon={FiImage} className="text-purple-500" />
                        <div className="flex flex-col">
                          <span className="text-gray-900 text-sm">{selectedLogoOrder.inspiration_files}</span>
                          <span className="text-xs text-green-600">متاح</span>
                        </div>
                        <button
                          onClick={() => handleDownloadLogoFile(selectedLogoOrder)}
                          className="text-purple-600 hover:text-purple-800 underline text-sm"
                        >
                          تحميل
                        </button>
                      </>
                    ) : (
                      <span className="text-gray-500">لا يوجد</span>
                    )}
                  </div>
                </div>
              </div>
              {selectedLogoOrder.style_preferences && selectedLogoOrder.style_preferences.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">تفضيلات الأسلوب</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedLogoOrder.style_preferences.map((style, index) => (
                      <span key={index} className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">
                        {style}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {selectedLogoOrder.notes && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">ملاحظات</label>
                  <p className="text-gray-900">{selectedLogoOrder.notes}</p>
                </div>
              )}
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-800">إجمالي السعر:</span>
                  <span className="text-xl font-bold text-purple-600">{selectedLogoOrder.total_price} درهم</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;