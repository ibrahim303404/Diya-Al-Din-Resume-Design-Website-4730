import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { 
  getAllOrders, 
  updateOrderStatus, 
  deleteOrder,
  subscribeToNewOrders,
  unsubscribeFromOrders
} from '../services/supabaseOrderService';

const { FiHome, FiLogOut, FiUsers, FiDollarSign, FiClock, FiCheck, FiX, FiEye, FiEdit, FiTrash2, FiRefreshCw } = FiIcons;

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // جلب الطلبات عند تحميل الصفحة
    loadOrders();

    // الاستماع للطلبات الجديدة في الوقت الفعلي
    const subscription = subscribeToNewOrders((newOrder) => {
      setOrders(prev => [newOrder, ...prev]);
      // إشعار صوتي أو بصري للطلب الجديد
      if (Notification.permission === 'granted') {
        new Notification('طلب جديد!', {
          body: `طلب جديد من ${newOrder.customer_name}`,
          icon: '/favicon.ico'
        });
      }
    });

    // طلب إذن الإشعارات
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      unsubscribeFromOrders(subscription);
    };
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const result = await getAllOrders();
      if (result.success) {
        setOrders(result.orders);
      } else {
        setError('فشل في جلب الطلبات');
      }
    } catch (err) {
      setError('حدث خطأ في جلب الطلبات');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const result = await updateOrderStatus(orderId, newStatus);
      if (result.success) {
        setOrders(prev => prev.map(order => 
          order.id === orderId ? { ...order, order_status: newStatus } : order
        ));
      } else {
        alert('فشل في تحديث حالة الطلب');
      }
    } catch (err) {
      alert('حدث خطأ في تحديث الطلب');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
      try {
        const result = await deleteOrder(orderId);
        if (result.success) {
          setOrders(prev => prev.filter(order => order.id !== orderId));
        } else {
          alert('فشل في حذف الطلب');
        }
      } catch (err) {
        alert('حدث خطأ في حذف الطلب');
      }
    }
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
    const packages = {
      'basic': 'أساسية',
      'advanced': 'متقدمة',
      'premium': 'ذهبية'
    };
    return packages[packageType] || packageType;
  };

  const totalRevenue = orders.reduce((sum, order) => sum + (parseFloat(order.total_price) || 0), 0);
  const completedOrders = orders.filter(order => order.order_status === 'مكتمل').length;
  const pendingOrders = orders.filter(order => order.order_status === 'جديد' || order.order_status === 'قيد التنفيذ').length;

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
            <h1 className="text-2xl font-bold text-gray-800">لوحة التحكم - ضياء الدين</h1>
            <div className="flex items-center space-x-4 space-x-reverse">
              <button
                onClick={loadOrders}
                className="flex items-center space-x-2 space-x-reverse text-gray-600 hover:text-blue-600"
              >
                <SafeIcon icon={FiRefreshCw} />
                <span>تحديث</span>
              </button>
              <a
                href="/"
                className="flex items-center space-x-2 space-x-reverse text-gray-600 hover:text-blue-600"
              >
                <SafeIcon icon={FiHome} />
                <span>الموقع الرئيسي</span>
              </a>
              <button
                onClick={() => window.location.reload()}
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
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إجمالي الطلبات</p>
                <p className="text-2xl font-bold text-gray-800">{orders.length}</p>
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
                <p className="text-2xl font-bold text-yellow-600">{pendingOrders}</p>
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
                <p className="text-2xl font-bold text-green-600">{completedOrders}</p>
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
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Orders Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">الطلبات من قاعدة البيانات</h2>
          </div>

          {orders.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              لا توجد طلبات في قاعدة البيانات
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
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">التاريخ</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.order_date).toLocaleDateString('ar-AE')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2 space-x-reverse">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <SafeIcon icon={FiEye} />
                          </button>
                          <select
                            value={order.order_status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                            className="text-xs border border-gray-300 rounded px-2 py-1"
                          >
                            <option value="جديد">جديد</option>
                            <option value="قيد التنفيذ">قيد التنفيذ</option>
                            <option value="مكتمل">مكتمل</option>
                            <option value="ملغي">ملغي</option>
                          </select>
                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <SafeIcon icon={FiTrash2} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-96 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">تفاصيل الطلب</h3>
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
                  <label className="block text-sm font-medium text-gray-700">ملف سابق</label>
                  <p className="text-gray-900">{selectedOrder.existing_cv_filename || 'لا يوجد'}</p>
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
    </div>
  );
};

export default AdminDashboard;