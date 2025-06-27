import supabase from '../lib/supabase';

// حفظ الطلب في قاعدة البيانات
export const saveOrderToDatabase = async (orderData) => {
  try {
    console.log('🔄 بدء حفظ الطلب:', orderData);
    
    const orderId = `CV-${Date.now()}`;
    
    // إعداد البيانات للحفظ
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
      existing_cv_filename: orderData.existingCV ? orderData.existingCV.name : null,
      order_status: 'جديد',
      order_id: orderId
    };

    console.log('📝 البيانات المحضرة للحفظ:', orderRecord);

    // التحقق من الاتصال بـ Supabase أولاً
    const { data: testConnection, error: connectionError } = await supabase
      .from('cv_orders_2024')
      .select('count')
      .limit(1);

    if (connectionError) {
      console.error('❌ خطأ في الاتصال بـ Supabase:', connectionError);
      throw new Error(`خطأ في الاتصال بقاعدة البيانات: ${connectionError.message}`);
    }

    console.log('✅ تم التحقق من الاتصال بـ Supabase');

    // حفظ الطلب
    const { data, error } = await supabase
      .from('cv_orders_2024')
      .insert([orderRecord])
      .select()
      .single();

    if (error) {
      console.error('❌ خطأ في حفظ الطلب:', error);
      
      // معالجة أخطاء محددة
      if (error.code === '23505') {
        throw new Error('رقم الطلب مكرر. يرجى المحاولة مرة أخرى.');
      } else if (error.code === '23502') {
        throw new Error('بيانات مطلوبة مفقودة. يرجى التأكد من ملء جميع الحقول المطلوبة.');
      } else if (error.message.includes('permission')) {
        throw new Error('خطأ في الصلاحيات. يرجى المحاولة مرة أخرى.');
      } else {
        throw new Error(`خطأ في حفظ الطلب: ${error.message}`);
      }
    }

    console.log('✅ تم حفظ الطلب بنجاح:', data);

    // حفظ إشعار البريد الإلكتروني
    try {
      await saveEmailNotification({
        order_id: orderId,
        recipient_email: 'nestaman2@gmail.com',
        email_type: 'admin_notification',
        subject: `طلب سيرة ذاتية جديد - ${orderData.name}`,
        content: formatAdminNotification(data)
      });

      await saveEmailNotification({
        order_id: orderId,
        recipient_email: orderData.email,
        email_type: 'customer_confirmation',
        subject: 'تأكيد استلام طلبك - ضياء الدين لتصميم السير الذاتية',
        content: formatCustomerConfirmation(data)
      });

      console.log('✅ تم حفظ الإشعارات بنجاح');
    } catch (notificationError) {
      console.warn('⚠️ فشل في حفظ الإشعارات:', notificationError);
      // لا نوقف العملية إذا فشلت الإشعارات
    }

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

// حفظ إشعار البريد الإلكتروني
const saveEmailNotification = async (notificationData) => {
  try {
    const { data, error } = await supabase
      .from('email_notifications_2024')
      .insert([notificationData])
      .select()
      .single();

    if (error) {
      console.error('خطأ في حفظ الإشعار:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('خطأ في حفظ الإشعار:', error);
    throw error;
  }
};

// تنسيق إشعار الإدارة
const formatAdminNotification = (orderData) => {
  return `
🎯 طلب سيرة ذاتية جديد
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 معلومات العميل:
• الاسم: ${orderData.customer_name}
• البريد الإلكتروني: ${orderData.customer_email}
• رقم الهاتف: ${orderData.customer_phone}
• المهنة: ${orderData.profession}
• سنوات الخبرة: ${orderData.experience || 'غير محدد'}

📦 تفاصيل الطلب:
• الباقة المختارة: ${orderData.package_name}
• الخدمات الإضافية: ${formatAdditionalServices(orderData.additional_services)}
• السعر الإجمالي: ${orderData.total_price} درهم

📄 السيرة الذاتية السابقة:
• يوجد ملف سابق: ${orderData.existing_cv_filename ? 'نعم' : 'لا'}
• اسم الملف: ${orderData.existing_cv_filename || 'لا يوجد'}

📝 ملاحظات إضافية:
${orderData.notes || 'لا توجد ملاحظات'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🕐 تاريخ الطلب: ${new Date(orderData.order_date).toLocaleString('ar-AE')}
🆔 رقم الطلب: ${orderData.order_id}

يرجى التواصل مع العميل خلال 24 ساعة.
  `;
};

// تنسيق تأكيد العميل
const formatCustomerConfirmation = (orderData) => {
  return `
عزيزي/عزيزتي ${orderData.customer_name}،

شكراً لك على ثقتك في خدماتنا! 🙏
تم استلام طلبك بنجاح وحفظه في نظامنا.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 تفاصيل طلبك:
• رقم الطلب: ${orderData.order_id}
• الباقة المختارة: ${orderData.package_name}
• المبلغ الإجمالي: ${orderData.total_price} درهم
• تاريخ الطلب: ${new Date(orderData.order_date).toLocaleString('ar-AE')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏰ الخطوات التالية:
1. سنراجع تفاصيل طلبك خلال 24 ساعة
2. سنتواصل معك لتأكيد التفاصيل
3. سنبدأ العمل على سيرتك الذاتية
4. سنرسل لك النسخة الأولى للمراجعة

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📞 للتواصل:
• البريد الإلكتروني: nestaman2@gmail.com
• الهاتف: +971 XX XXX XXXX

شكراً لثقتك بنا! ✨

ضياء الدين
تصميم السير الذاتية الاحترافية
  `;
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

// دالة مساعدة لتنسيق الخدمات الإضافية
const formatAdditionalServices = (services) => {
  if (!services || services.length === 0) {
    return 'لا توجد خدمات إضافية';
  }

  const serviceNames = {
    'update': 'تحديث السيرة الذاتية (75 درهم)',
    'translation': 'ترجمة إلى الإنجليزية (100 درهم)',
    'cover-letter': 'خطاب تعريفي إضافي (50 درهم)',
    'linkedin': 'تحسين ملف LinkedIn (125 درهم)'
  };

  return services.map(service => serviceNames[service] || service).join(', ');
};

// جلب جميع الطلبات للوحة التحكم
export const getAllOrders = async () => {
  try {
    console.log('🔄 جلب جميع الطلبات...');
    
    const { data, error } = await supabase
      .from('cv_orders_2024')
      .select('*')
      .order('order_date', { ascending: false });

    if (error) {
      console.error('خطأ في جلب الطلبات:', error);
      throw error;
    }

    console.log('✅ تم جلب الطلبات بنجاح:', data?.length || 0, 'طلب');
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
      .update({ 
        order_status: newStatus,
        updated_at: new Date().toISOString()
      })
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
    return {
      success: true
    };

  } catch (error) {
    console.error('خطأ في حذف الطلب:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// الاستماع للطلبات الجديدة في الوقت الفعلي
export const subscribeToNewOrders = (callback) => {
  console.log('🔄 بدء الاستماع للطلبات الجديدة...');
  
  const subscription = supabase
    .channel('cv_orders_2024')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'cv_orders_2024'
    }, (payload) => {
      console.log('📨 طلب جديد وارد:', payload.new);
      callback(payload.new);
    })
    .subscribe();

  console.log('✅ تم بدء الاستماع للطلبات الجديدة');
  return subscription;
};

// إلغاء الاشتراك
export const unsubscribeFromOrders = (subscription) => {
  console.log('🔄 إلغاء الاشتراك في الطلبات...');
  supabase.removeChannel(subscription);
  console.log('✅ تم إلغاء الاشتراك');
};

// اختبار الاتصال بقاعدة البيانات
export const testDatabaseConnection = async () => {
  try {
    console.log('🔄 اختبار الاتصال بقاعدة البيانات...');
    
    const { data, error } = await supabase
      .from('cv_orders_2024')
      .select('count')
      .limit(1);

    if (error) {
      console.error('❌ فشل اختبار الاتصال:', error);
      return {
        success: false,
        error: error.message
      };
    }

    console.log('✅ نجح اختبار الاتصال');
    return {
      success: true,
      message: 'الاتصال بقاعدة البيانات يعمل بشكل صحيح'
    };

  } catch (error) {
    console.error('❌ خطأ في اختبار الاتصال:', error);
    return {
      success: false,
      error: error.message
    };
  }
};