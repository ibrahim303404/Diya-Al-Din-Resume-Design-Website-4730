import supabase from '../lib/supabase';

// رفع الملف إلى Supabase Storage
const uploadFileToStorage = async (file, orderId) => {
  try {
    console.log('📤 بدء رفع الملف:', file.name);

    // إنشاء اسم فريد للملف
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${orderId}_${timestamp}.${fileExtension}`;
    const filePath = `cv-uploads/${fileName}`;

    console.log('📁 مسار الرفع:', filePath);

    // تحويل الملف إلى ArrayBuffer
    const fileBuffer = await file.arrayBuffer();
    
    // رفع الملف إلى Supabase Storage
    const { data, error } = await supabase.storage
      .from('cv-files')
      .upload(filePath, fileBuffer, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type
      });

    if (error) {
      console.error('❌ خطأ في رفع الملف:', error);
      
      // إذا كان الخطأ بسبب عدم وجود bucket، ننشئه
      if (error.message.includes('not found')) {
        console.log('🔄 محاولة إنشاء bucket...');
        await createStorageBucket();
        
        // إعادة محاولة الرفع
        const { data: retryData, error: retryError } = await supabase.storage
          .from('cv-files')
          .upload(filePath, fileBuffer, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type
          });
          
        if (retryError) {
          throw retryError;
        }
        
        console.log('✅ تم رفع الملف بنجاح بعد إنشاء البucket:', retryData);
        return {
          success: true,
          filePath: retryData.path,
          fileName: fileName,
          originalName: file.name,
          fileSize: file.size,
          fileType: file.type,
          publicUrl: supabase.storage.from('cv-files').getPublicUrl(retryData.path).data.publicUrl
        };
      }
      
      throw error;
    }

    console.log('✅ تم رفع الملف بنجاح:', data);
    
    // الحصول على رابط عام للملف
    const { data: publicUrlData } = supabase.storage
      .from('cv-files')
      .getPublicUrl(data.path);

    return {
      success: true,
      filePath: data.path,
      fileName: fileName,
      originalName: file.name,
      fileSize: file.size,
      fileType: file.type,
      publicUrl: publicUrlData.publicUrl
    };

  } catch (error) {
    console.error('❌ فشل في رفع الملف:', error);
    return {
      success: false,
      error: error.message,
      filename: file.name,
      fileSize: file.size,
      fileType: file.type
    };
  }
};

// إنشاء Storage Bucket إذا لم يكن موجود
const createStorageBucket = async () => {
  try {
    console.log('🔄 إنشاء Storage Bucket...');
    
    const { data, error } = await supabase.storage.createBucket('cv-files', {
      public: true,
      allowedMimeTypes: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ],
      fileSizeLimit: 10485760 // 10MB
    });

    if (error && !error.message.includes('already exists')) {
      console.error('❌ خطأ في إنشاء البucket:', error);
      throw error;
    }

    console.log('✅ تم إنشاء البucket بنجاح:', data);
    return { success: true };
  } catch (error) {
    console.error('❌ فشل في إنشاء البucket:', error);
    return { success: false, error: error.message };
  }
};

// تحميل الملف من Storage
const downloadFileFromStorage = async (filePath, originalName) => {
  try {
    console.log('📥 تحميل الملف من Storage:', filePath);

    const { data, error } = await supabase.storage
      .from('cv-files')
      .download(filePath);

    if (error) {
      console.error('❌ خطأ في تحميل الملف:', error);
      throw error;
    }

    console.log('✅ تم تحميل الملف من Storage');

    // تحويل البيانات إلى blob وتحميلها
    const blob = new Blob([data], { type: data.type });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = originalName || 'downloaded_file';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return {
      success: true,
      message: 'تم تحميل الملف بنجاح',
      source: 'storage'
    };

  } catch (error) {
    console.error('❌ فشل في تحميل الملف من Storage:', error);
    throw error;
  }
};

// حفظ الطلب مع رفع الملف
export const saveOrderToDatabase = async (orderData) => {
  try {
    console.log('🔄 بدء حفظ الطلب:', orderData);
    const orderId = `CV-${Date.now()}`;

    let uploadedFilename = null;
    let uploadedFilePath = null;
    let fileUploadSuccess = false;
    
    // رفع الملف إذا كان موجود
    if (orderData.existingCV) {
      console.log('📤 رفع الملف المرفق...');
      const uploadResult = await uploadFileToStorage(orderData.existingCV, orderId);
      
      if (uploadResult.success) {
        uploadedFilename = uploadResult.originalName;
        uploadedFilePath = uploadResult.filePath;
        fileUploadSuccess = true;
        console.log('✅ تم رفع الملف بنجاح:', uploadedFilename);
        console.log('🔗 مسار الملف:', uploadedFilePath);
      } else {
        console.warn('⚠️ فشل رفع الملف، سيتم حفظ اسم الملف فقط');
        uploadedFilename = orderData.existingCV.name;
        fileUploadSuccess = false;
      }
    }

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
      existing_cv_filename: uploadedFilename,
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

    // إضافة معلومات الملف المرفوع للبيانات المرجعة
    const responseData = {
      ...data,
      file_path: uploadedFilePath,
      file_upload_success: fileUploadSuccess
    };

    return {
      success: true,
      orderId,
      orderData: responseData,
      fileUploaded: fileUploadSuccess,
      filePath: uploadedFilePath,
      message: 'تم حفظ الطلب بنجاح' + (fileUploadSuccess ? ' مع رفع الملف' : uploadedFilename ? ' مع حفظ اسم الملف' : '')
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

// تحميل الملف المرفوع
export const downloadFileDirectly = async (order) => {
  try {
    console.log('📥 بدء تحميل الملف:', order);

    // التحقق من وجود الملف
    if (!order.existing_cv_filename) {
      throw new Error('لا يوجد ملف مرفق مع هذا الطلب');
    }

    // محاولة تحميل الملف من Storage أولاً
    try {
      // البحث عن الملف في Storage
      const { data: files, error: listError } = await supabase.storage
        .from('cv-files')
        .list('cv-uploads', {
          limit: 100,
          search: order.order_id
        });

      if (!listError && files && files.length > 0) {
        // العثور على الملف المطابق
        const matchingFile = files.find(file => 
          file.name.includes(order.order_id) || 
          file.name.includes(order.existing_cv_filename.split('.')[0])
        );

        if (matchingFile) {
          const filePath = `cv-uploads/${matchingFile.name}`;
          console.log('📁 تم العثور على الملف في Storage:', filePath);
          
          return await downloadFileFromStorage(filePath, order.existing_cv_filename);
        }
      }
    } catch (storageError) {
      console.warn('⚠️ فشل في تحميل الملف من Storage:', storageError);
    }

    // إذا فشل تحميل الملف من Storage، إنشاء ملف معلومات
    console.log('📄 إنشاء ملف معلومات الطلب كبديل...');
    return await createOrderInfoFile(order);

  } catch (error) {
    console.error('❌ خطأ في تحميل الملف:', error);
    
    // محاولة إنشاء ملف معلومات كبديل أخير
    try {
      const fallbackResult = await createOrderInfoFile(order);
      return {
        ...fallbackResult,
        fallback: true,
        originalError: error.message
      };
    } catch (fallbackError) {
      return {
        success: false,
        error: error.message,
        message: 'فشل في تحميل الملف وإنشاء ملف المعلومات البديل'
      };
    }
  }
};

// إنشاء ملف معلومات الطلب
const createOrderInfoFile = async (order) => {
  console.log('📝 إنشاء ملف معلومات الطلب');

  const fileContent = `
معلومات الطلب - ${order.customer_name}
═══════════════════════════════════════════

👤 معلومات العميل:
📧 البريد الإلكتروني: ${order.customer_email}
📱 الهاتف: ${order.customer_phone}
💼 المهنة: ${order.profession}
🎯 سنوات الخبرة: ${order.experience || 'غير محدد'}

📦 تفاصيل الطلب:
🆔 رقم الطلب: ${order.order_id}
📋 الباقة: ${order.package_name}
💰 السعر: ${order.total_price} درهم
📅 التاريخ: ${new Date(order.order_date || order.created_at || Date.now()).toLocaleDateString('ar-AE')}
📊 الحالة: ${order.order_status}

📁 الملف المرفوع: ${order.existing_cv_filename || 'لا يوجد'}

📝 الملاحظات:
${order.notes || 'لا توجد ملاحظات'}

🔧 خدمات إضافية:
${order.additional_services?.length > 0 ? 
  order.additional_services.map(service => `• ${getServiceName(service)}`).join('\n') : 
  'لا توجد خدمات إضافية'
}

═══════════════════════════════════════════
تم إنشاء هذا الملف تلقائياً
ضياء الدين للتصاميم
البريد الإلكتروني: nestaman2@gmail.com
الهاتف: +971 XX XXX XXXX
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
    message: 'تم تحميل ملف معلومات الطلب',
    source: 'info_file'
  };
};

// دالة مساعدة لأسماء الخدمات
const getServiceName = (serviceCode) => {
  const services = {
    'update': 'تحديث السيرة الذاتية',
    'translation': 'ترجمة إلى الإنجليزية', 
    'cover-letter': 'خطاب تعريفي إضافي',
    'linkedin': 'تحسين ملف LinkedIn',
    'logo-design': 'تصميم لوجو احترافي'
  };
  return services[serviceCode] || serviceCode;
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

// الحصول على رابط عام للملف
export const getPublicFileUrl = (filePath) => {
  try {
    const { data } = supabase.storage
      .from('cv-files')
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  } catch (error) {
    console.error('خطأ في الحصول على رابط الملف:', error);
    return null;
  }
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

    // حذف الطلب من قاعدة البيانات
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

// اختبار Storage
export const testStorageConnection = async () => {
  try {
    console.log('🔄 اختبار Storage...');

    const { data, error } = await supabase.storage
      .from('cv-files')
      .list('', { limit: 1 });

    if (error) {
      console.error('❌ فشل في الوصول إلى Storage:', error);
      
      // محاولة إنشاء البucket إذا لم يكن موجود
      if (error.message.includes('not found')) {
        console.log('🔄 محاولة إنشاء Storage Bucket...');
        const createResult = await createStorageBucket();
        if (createResult.success) {
          return {
            success: true,
            message: 'تم إنشاء Storage بنجاح'
          };
        }
      }
      
      return {
        success: false,
        error: error.message,
        message: 'Storage غير متاح - سيتم حفظ أسماء الملفات فقط'
      };
    }

    console.log('✅ Storage يعمل بشكل طبيعي');
    return {
      success: true,
      message: 'Storage متاح ويعمل'
    };
  } catch (error) {
    console.error('❌ خطأ في اختبار Storage:', error);
    return {
      success: false,
      error: error.message,
      message: 'Storage غير متاح - سيتم حفظ أسماء الملفات فقط'
    };
  }
};