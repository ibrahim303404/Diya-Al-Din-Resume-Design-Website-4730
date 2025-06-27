import supabase from '../lib/supabase';

// رفع ملف الإلهام إلى Supabase Storage
const uploadInspirationFileToStorage = async (file, orderId) => {
  try {
    console.log('📤 بدء رفع ملف الإلهام:', file.name);
    
    // إنشاء اسم فريد للملف
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${orderId}_inspiration_${timestamp}.${fileExtension}`;
    const filePath = `logo-inspirations/${fileName}`;
    
    console.log('📁 مسار رفع ملف الإلهام:', filePath);
    
    // تحويل الملف إلى ArrayBuffer
    const fileBuffer = await file.arrayBuffer();
    
    // رفع الملف إلى Supabase Storage
    const { data, error } = await supabase.storage
      .from('logo-files')
      .upload(filePath, fileBuffer, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type
      });
    
    if (error) {
      console.error('❌ خطأ في رفع ملف الإلهام:', error);
      // إذا كان الخطأ بسبب عدم وجود bucket، ننشئه
      if (error.message.includes('not found')) {
        console.log('🔄 محاولة إنشاء bucket للوجو...');
        await createLogoStorageBucket();
        
        // إعادة محاولة الرفع
        const { data: retryData, error: retryError } = await supabase.storage
          .from('logo-files')
          .upload(filePath, fileBuffer, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type
          });
        
        if (retryError) {
          throw retryError;
        }
        
        console.log('✅ تم رفع ملف الإلهام بنجاح بعد إنشاء البucket:', retryData);
        return {
          success: true,
          filePath: retryData.path,
          fileName: fileName,
          originalName: file.name,
          fileSize: file.size,
          fileType: file.type,
          publicUrl: supabase.storage.from('logo-files').getPublicUrl(retryData.path).data.publicUrl
        };
      }
      throw error;
    }
    
    console.log('✅ تم رفع ملف الإلهام بنجاح:', data);
    
    // الحصول على رابط عام للملف
    const { data: publicUrlData } = supabase.storage
      .from('logo-files')
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
    console.error('❌ فشل في رفع ملف الإلهام:', error);
    return {
      success: false,
      error: error.message,
      filename: file.name,
      fileSize: file.size,
      fileType: file.type
    };
  }
};

// إنشاء Storage Bucket للوجو إذا لم يكن موجود
const createLogoStorageBucket = async () => {
  try {
    console.log('🔄 إنشاء Storage Bucket للوجو...');
    
    const { data, error } = await supabase.storage.createBucket('logo-files', {
      public: true,
      allowedMimeTypes: [
        'image/jpeg',
        'image/png', 
        'image/gif',
        'image/webp',
        'application/pdf'
      ],
      fileSizeLimit: 10485760 // 10MB
    });
    
    if (error && !error.message.includes('already exists')) {
      console.error('❌ خطأ في إنشاء bucket اللوجو:', error);
      throw error;
    }
    
    console.log('✅ تم إنشاء bucket اللوجو بنجاح:', data);
    return { success: true };
    
  } catch (error) {
    console.error('❌ فشل في إنشاء bucket اللوجو:', error);
    return { success: false, error: error.message };
  }
};

// تحميل ملف الإلهام من Storage
const downloadInspirationFileFromStorage = async (filePath, originalName) => {
  try {
    console.log('📥 تحميل ملف الإلهام من Storage:', filePath);
    
    const { data, error } = await supabase.storage
      .from('logo-files')
      .download(filePath);
    
    if (error) {
      console.error('❌ خطأ في تحميل ملف الإلهام:', error);
      throw error;
    }
    
    console.log('✅ تم تحميل ملف الإلهام من Storage');
    
    // تحويل البيانات إلى blob وتحميلها
    const blob = new Blob([data], { type: data.type });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = originalName || 'inspiration_file';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    return {
      success: true,
      message: 'تم تحميل ملف الإلهام بنجاح',
      source: 'storage'
    };
    
  } catch (error) {
    console.error('❌ فشل في تحميل ملف الإلهام من Storage:', error);
    throw error;
  }
};

// حفظ طلب اللوجو في قاعدة البيانات مع رفع الملفات
export const saveLogoOrderToDatabase = async (logoOrderData) => {
  try {
    console.log('🔄 بدء حفظ طلب اللوجو:', logoOrderData);
    
    const orderId = `LOGO-${Date.now()}`;
    let uploadedFilename = null;
    let uploadedFilePath = null;
    let uploadedFileSize = null;
    let uploadedFileType = null;
    let fileUploadSuccess = false;
    
    // رفع ملفات الإلهام إذا كانت موجودة
    if (logoOrderData.inspirationFiles && logoOrderData.inspirationFiles.length > 0) {
      console.log('📤 رفع ملفات الإلهام...');
      
      // رفع أول ملف (يمكن تطوير هذا لرفع ملفات متعددة)
      const firstFile = logoOrderData.inspirationFiles[0];
      const uploadResult = await uploadInspirationFileToStorage(firstFile, orderId);
      
      if (uploadResult.success) {
        uploadedFilename = uploadResult.originalName;
        uploadedFilePath = uploadResult.filePath;
        uploadedFileSize = uploadResult.fileSize;
        uploadedFileType = uploadResult.fileType;
        fileUploadSuccess = true;
        console.log('✅ تم رفع ملف الإلهام بنجاح:', uploadedFilename);
        console.log('🔗 مسار الملف:', uploadedFilePath);
      } else {
        console.warn('⚠️ فشل رفع ملف الإلهام، سيتم حفظ اسم الملف فقط');
        uploadedFilename = firstFile.name;
        uploadedFileSize = firstFile.size;
        uploadedFileType = firstFile.type;
        fileUploadSuccess = false;
      }
    }
    
    // إعداد البيانات للحفظ
    const orderRecord = {
      customer_name: logoOrderData.name,
      customer_email: logoOrderData.email,
      customer_phone: logoOrderData.phone,
      business_name: logoOrderData.businessName,
      business_type: logoOrderData.businessType,
      logo_package: logoOrderData.logoPackage,
      logo_package_name: getLogoPackageName(logoOrderData.logoPackage),
      style_preferences: logoOrderData.stylePreferences || [],
      color_preferences: logoOrderData.colorPreferences || null,
      inspiration_files: uploadedFilename,
      inspiration_file_path: uploadedFilePath,
      inspiration_file_size: uploadedFileSize,
      inspiration_file_type: uploadedFileType,
      total_price: logoOrderData.totalPrice,
      notes: logoOrderData.notes || null,
      order_status: 'جديد',
      order_id: orderId
    };
    
    console.log('📝 البيانات المحضرة لحفظ طلب اللوجو:', orderRecord);
    
    // حفظ الطلب في قاعدة البيانات
    const { data, error } = await supabase
      .from('logo_orders_2024')
      .insert([orderRecord])
      .select()
      .single();
    
    if (error) {
      console.error('❌ خطأ في حفظ طلب اللوجو:', error);
      throw new Error(`خطأ في حفظ طلب اللوجو: ${error.message}`);
    }
    
    console.log('✅ تم حفظ طلب اللوجو بنجاح:', data);
    
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
      message: 'تم حفظ طلب اللوجو بنجاح' + (fileUploadSuccess ? ' مع رفع ملف الإلهام' : uploadedFilename ? ' مع حفظ اسم الملف' : '')
    };
    
  } catch (error) {
    console.error('❌ خطأ عام في حفظ طلب اللوجو:', error);
    return {
      success: false,
      error: error.message || 'حدث خطأ غير متوقع',
      message: error.message || 'فشل في حفظ طلب اللوجو. يرجى المحاولة مرة أخرى.'
    };
  }
};

// تحميل ملف الإلهام المرفوع
export const downloadLogoInspirationFile = async (order) => {
  try {
    console.log('📥 بدء تحميل ملف الإلهام:', order);
    
    // التحقق من وجود الملف
    if (!order.inspiration_files) {
      throw new Error('لا يوجد ملف إلهام مرفق مع طلب اللوجو');
    }
    
    // محاولة تحميل الملف من Storage أولاً
    try {
      if (order.inspiration_file_path) {
        console.log('📁 تحميل ملف الإلهام من Storage:', order.inspiration_file_path);
        return await downloadInspirationFileFromStorage(order.inspiration_file_path, order.inspiration_files);
      }
    } catch (storageError) {
      console.warn('⚠️ فشل في تحميل ملف الإلهام من Storage:', storageError);
    }
    
    // إذا فشل تحميل الملف من Storage، إنشاء ملف معلومات
    console.log('📄 إنشاء ملف معلومات طلب اللوجو كبديل...');
    return await createLogoOrderInfoFile(order);
    
  } catch (error) {
    console.error('❌ خطأ في تحميل ملف الإلهام:', error);
    
    // محاولة إنشاء ملف معلومات كبديل أخير
    try {
      const fallbackResult = await createLogoOrderInfoFile(order);
      return {
        ...fallbackResult,
        fallback: true,
        originalError: error.message
      };
    } catch (fallbackError) {
      return {
        success: false,
        error: error.message,
        message: 'فشل في تحميل ملف الإلهام وإنشاء ملف المعلومات البديل'
      };
    }
  }
};

// إنشاء ملف معلومات طلب اللوجو
const createLogoOrderInfoFile = async (order) => {
  console.log('📝 إنشاء ملف معلومات طلب اللوجو');
  
  const fileContent = `
معلومات طلب اللوجو - ${order.customer_name}
═══════════════════════════════════════════

👤 معلومات العميل:
📧 البريد الإلكتروني: ${order.customer_email}
📱 الهاتف: ${order.customer_phone}

🏢 معلومات الشركة:
🏪 اسم الشركة: ${order.business_name}
📊 نوع النشاط: ${order.business_type}

📦 تفاصيل الطلب:
🆔 رقم الطلب: ${order.order_id}
📋 باقة اللوجو: ${order.logo_package_name || getLogoPackageName(order.logo_package)}
💰 السعر: ${order.total_price} درهم
📅 التاريخ: ${new Date(order.order_date || order.created_at || Date.now()).toLocaleDateString('ar-AE')}
📊 الحالة: ${order.order_status}

🎨 تفضيلات التصميم:
🌈 الألوان المفضلة: ${order.color_preferences || 'لم يحدد'}
🎯 أسلوب التصميم: ${order.style_preferences?.length > 0 ? order.style_preferences.join(', ') : 'لم يحدد'}

📁 ملف الإلهام المرفوع: ${order.inspiration_files || 'لا يوجد'}
📝 الملاحظات: ${order.notes || 'لا توجد ملاحظات'}

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
  link.download = `Logo_Order_${order.customer_name}_${order.order_id}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
  
  console.log('✅ تم تحميل ملف معلومات طلب اللوجو');
  
  return {
    success: true,
    message: 'تم تحميل ملف معلومات طلب اللوجو',
    source: 'info_file'
  };
};

// جلب جميع طلبات اللوجو
export const getAllLogoOrders = async () => {
  try {
    console.log('🔄 جلب جميع طلبات اللوجو...');
    
    const { data, error } = await supabase
      .from('logo_orders_2024')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('خطأ في جلب طلبات اللوجو:', error);
      throw error;
    }
    
    console.log('✅ تم جلب طلبات اللوجو بنجاح:', data?.length || 0);
    return {
      success: true,
      orders: data || []
    };
    
  } catch (error) {
    console.error('خطأ في جلب طلبات اللوجو:', error);
    return {
      success: false,
      error: error.message,
      orders: []
    };
  }
};

// تحديث حالة طلب اللوجو
export const updateLogoOrderStatus = async (orderId, newStatus) => {
  try {
    console.log('🔄 تحديث حالة طلب اللوجو:', orderId, 'إلى:', newStatus);
    
    const { data, error } = await supabase
      .from('logo_orders_2024')
      .update({ order_status: newStatus })
      .eq('id', orderId)
      .select()
      .single();
    
    if (error) {
      console.error('خطأ في تحديث طلب اللوجو:', error);
      throw error;
    }
    
    console.log('✅ تم تحديث طلب اللوجو بنجاح');
    return {
      success: true,
      order: data
    };
    
  } catch (error) {
    console.error('خطأ في تحديث طلب اللوجو:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// حذف طلب اللوجو
export const deleteLogoOrder = async (orderId) => {
  try {
    console.log('🔄 حذف طلب اللوجو:', orderId);
    
    const { error } = await supabase
      .from('logo_orders_2024')
      .delete()
      .eq('id', orderId);
    
    if (error) {
      console.error('خطأ في حذف طلب اللوجو:', error);
      throw error;
    }
    
    console.log('✅ تم حذف طلب اللوجو بنجاح');
    return {
      success: true
    };
    
  } catch (error) {
    console.error('خطأ في حذف طلب اللوجو:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// الاستماع لطلبات اللوجو الجديدة
export const subscribeToNewLogoOrders = (callback) => {
  console.log('🔄 بدء الاستماع لطلبات اللوجو الجديدة...');
  
  const subscription = supabase
    .channel('logo_orders_2024')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'logo_orders_2024'
    }, (payload) => {
      console.log('📨 طلب لوجو جديد:', payload.new);
      callback(payload.new);
    })
    .subscribe();
  
  return subscription;
};

// إلغاء الاشتراك من طلبات اللوجو
export const unsubscribeFromLogoOrders = (subscription) => {
  console.log('🔄 إلغاء الاشتراك من طلبات اللوجو...');
  supabase.removeChannel(subscription);
};

// دالة مساعدة لتحويل رمز الباقة إلى اسم
const getLogoPackageName = (packageCode) => {
  const packages = {
    'basic': 'باقة اللوجو الأساسية (200 درهم)',
    'advanced': 'باقة اللوجو المتقدمة (350 درهم)',
    'premium': 'باقة الهوية المتكاملة (600 درهم)'
  };
  return packages[packageCode] || 'غير محدد';
};

// دالة مساعدة لتحويل تفضيلات الأسلوب
export const getStylePreferenceName = (styleCode) => {
  const styles = {
    'modern': 'عصري ومعاصر',
    'classic': 'كلاسيكي وتقليدي',
    'minimalist': 'بسيط ومينيمال',
    'bold': 'جريء وقوي',
    'elegant': 'أنيق وراقي',
    'playful': 'مرح وإبداعي',
    'professional': 'مهني وجدي',
    'artistic': 'فني وإبداعي'
  };
  return styles[styleCode] || styleCode;
};

// اختبار الاتصال بجدول طلبات اللوجو
export const testLogoOrdersConnection = async () => {
  try {
    console.log('🔄 اختبار الاتصال بجدول طلبات اللوجو...');
    
    const { data, error } = await supabase
      .from('logo_orders_2024')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ فشل الاتصال بجدول طلبات اللوجو:', error);
      return {
        success: false,
        error: error.message
      };
    }
    
    console.log('✅ الاتصال بجدول طلبات اللوجو ناجح');
    return {
      success: true,
      message: 'الاتصال بجدول طلبات اللوجو يعمل بشكل طبيعي'
    };
    
  } catch (error) {
    console.error('❌ خطأ في اختبار الاتصال بطلبات اللوجو:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// اختبار Logo Storage
export const testLogoStorageConnection = async () => {
  try {
    console.log('🔄 اختبار Logo Storage...');
    
    const { data, error } = await supabase.storage
      .from('logo-files')
      .list('', { limit: 1 });
    
    if (error) {
      console.error('❌ فشل في الوصول إلى Logo Storage:', error);
      
      // محاولة إنشاء البucket إذا لم يكن موجود
      if (error.message.includes('not found')) {
        console.log('🔄 محاولة إنشاء Logo Storage Bucket...');
        const createResult = await createLogoStorageBucket();
        if (createResult.success) {
          return {
            success: true,
            message: 'تم إنشاء Logo Storage بنجاح'
          };
        }
      }
      
      return {
        success: false,
        error: error.message,
        message: 'Logo Storage غير متاح - سيتم حفظ أسماء الملفات فقط'
      };
    }
    
    console.log('✅ Logo Storage يعمل بشكل طبيعي');
    return {
      success: true,
      message: 'Logo Storage متاح ويعمل'
    };
    
  } catch (error) {
    console.error('❌ خطأ في اختبار Logo Storage:', error);
    return {
      success: false,
      error: error.message,
      message: 'Logo Storage غير متاح - سيتم حفظ أسماء الملفات فقط'
    };
  }
};