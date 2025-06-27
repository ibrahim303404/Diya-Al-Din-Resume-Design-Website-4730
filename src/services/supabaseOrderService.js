import supabase from '../lib/supabase';

// حفظ الطلب في قاعدة البيانات (بدون أي تعامل مع الملفات)
export const saveOrderToDatabase = async (orderData) => {
  try {
    console.log('🔄 بدء حفظ الطلب:', orderData);
    const orderId = `CV-${Date.now()}`;

    // إعداد البيانات للحفظ (بدون أي معلومات ملفات)
    const orderRecord = {
      customer_name: orderData.name,
      customer_email: orderData.email,
      customer_phone: orderData.phone,
      profession: orderData.profession,
      experience: orderData.experience || null,
      package_type: orderData.package,
      package_name: getPackageName(orderData.package),
      additional_services: orderData.additionalServices || [],
      total_price: orderData.totalPrice,
      notes: orderData.notes || null,
      // حفظ اسم الملف فقط كنص (بدون رفع)
      existing_cv_filename: orderData.existingCV ? orderData.existingCV.name : null,
      order_status: 'جديد',
      order_id: orderId
    };

    console.log('📝 البيانات المحضرة للحفظ:', orderRecord);

    // حفظ الطلب في قاعدة البيانات
    const { data, error } = await supabase
      .from('cv_orders_2024')
      .insert([orderRecord])
      .select()
      .single();

    if (error) {
      console.error('❌ خطأ في حفظ الطلب:', error);
      throw new Error(`خطأ في حفظ الطلب: ${error.message}`);
    }

    console.log('✅ تم حفظ الطلب بنجاح:', data);

    return {
      success: true,
      orderId,
      orderData: data,
      message: 'تم حفظ الطلب بنجاح'
    };

  } catch (error) {
    console.error('❌ خطأ عام في حفظ الطلب:', error);
    return {
      success: false,
      error: error.message || 'حدث خطأ غير متوقع',
      message: error.message || 'فشل في حفظ الطلب. يرجى المحاولة مرة أخرى.'
    };
  }
};

// إنشاء ملف نص بمعلومات الطلب للتحميل
export const downloadFileDirectly = async (order) => {
  try {
    console.log('📥 إنشاء ملف معلومات الطلب');

    // إنشاء محتوى الملف
    const fileContent = `
معلومات الطلب - ${order.customer_name}
═══════════════════════════════════════════

📧 البريد الإلكتروني: ${order.customer_email}
📱 الهاتف: ${order.customer_phone}
💼 المهنة: ${order.profession}
🎯 سنوات الخبرة: ${order.experience || 'غير محدد'}

🆔 رقم الطلب: ${order.order_id}
📦 الباقة: ${order.package_name}
💰 السعر: ${order.total_price} درهم
📅 التاريخ: ${new Date(order.order_date || Date.now()).toLocaleDateString('ar-AE')}

📁 الملف المرفوع: ${order.existing_cv_filename || 'لا يوجد'}

📝 الملاحظات:
${order.notes || 'لا توجد ملاحظات'}

═══════════════════════════════════════════
تم إنشاء هذا الملف تلقائياً
ضياء الدين - تصميم السير الذاتية
`;

    // تحميل الملف
    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CV_Order_${order.customer_name}_${order.order_id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    console.log('✅ تم تحميل ملف المعلومات');
    return { 
      success: true, 
      message: 'تم تحميل ملف معلومات الطلب'
    };

  } catch (error) {
    console.error('❌ خطأ في تحميل الملف:', error);
    return { 
      success: false, 
      error: error.message
    };
  }
};

// دالة مساعدة لتحويل رمز الباقة إلى اسم
const getPackageName = (packageCode) => {
  const packages = {
    'basic': 'الباقة الأساسية (150 درهم)',
    'advanced': 'الباقة المتقدمة (250 درهم)',
    'premium': 'الباقة الذهبية (400 درهم)'
  };
  return packages[packageCode] || 'غير محدد';
};

// جلب جميع الطلبات
export const getAllOrders = async () => {
  try {
    console.log('🔄 جلب جميع الطلبات...');

    const { data, error } = await supabase
      .from('cv_orders_2024')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('خطأ في جلب الطلبات:', error);
      throw error;
    }

    console.log('✅ تم جلب الطلبات بنجاح:', data?.length || 0);
    return {
      success: true,
      orders: data || []
    };
  } catch (error) {
    console.error('خطأ في جلب الطلبات:', error);
    return {
      success: false,
      error: error.message,
      orders: []
    };
  }
};

// تحديث حالة الطلب
export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    console.log('🔄 تحديث حالة الطلب:', orderId, 'إلى:', newStatus);

    const { data, error } = await supabase
      .from('cv_orders_2024')
      .update({ order_status: newStatus })
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      console.error('خطأ في تحديث الطلب:', error);
      throw error;
    }

    console.log('✅ تم تحديث الطلب بنجاح');
    return {
      success: true,
      order: data
    };
  } catch (error) {
    console.error('خطأ في تحديث الطلب:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// حذف الطلب
export const deleteOrder = async (orderId) => {
  try {
    console.log('🔄 حذف الطلب:', orderId);

    const { error } = await supabase
      .from('cv_orders_2024')
      .delete()
      .eq('id', orderId);

    if (error) {
      console.error('خطأ في حذف الطلب:', error);
      throw error;
    }

    console.log('✅ تم حذف الطلب بنجاح');
    return { success: true };
  } catch (error) {
    console.error('خطأ في حذف الطلب:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// الاستماع للطلبات الجديدة
export const subscribeToNewOrders = (callback) => {
  console.log('🔄 بدء الاستماع للطلبات الجديدة...');

  const subscription = supabase
    .channel('cv_orders_2024')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'cv_orders_2024'
    }, (payload) => {
      console.log('📨 طلب جديد:', payload.new);
      callback(payload.new);
    })
    .subscribe();

  return subscription;
};

// إلغاء الاشتراك
export const unsubscribeFromOrders = (subscription) => {
  console.log('🔄 إلغاء الاشتراك...');
  supabase.removeChannel(subscription);
};

// اختبار الاتصال
export const testDatabaseConnection = async () => {
  try {
    console.log('🔄 اختبار الاتصال...');

    const { data, error } = await supabase
      .from('cv_orders_2024')
      .select('count')
      .limit(1);

    if (error) {
      console.error('❌ فشل الاتصال:', error);
      return {
        success: false,
        error: error.message
      };
    }

    console.log('✅ الاتصال ناجح');
    return {
      success: true,
      message: 'الاتصال بقاعدة البيانات يعمل'
    };
  } catch (error) {
    console.error('❌ خطأ في الاتصال:', error);
    return {
      success: false,
      error: error.message
    };
  }
};