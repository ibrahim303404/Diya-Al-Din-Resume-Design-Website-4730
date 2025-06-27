import axios from 'axios';

// إعدادات Formspree
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID'; // سيتم تحديثه لاحقاً

export const sendOrderEmail = async (orderData) => {
  try {
    // تحضير البيانات للإرسال
    const emailData = {
      _replyto: orderData.email,
      _subject: `طلب سيرة ذاتية جديد - ${orderData.name}`,
      customer_name: orderData.name,
      customer_email: orderData.email,
      customer_phone: orderData.phone,
      profession: orderData.profession,
      experience: orderData.experience || 'غير محدد',
      package_name: getPackageName(orderData.package),
      additional_services: formatAdditionalServices(orderData.additionalServices),
      total_price: orderData.totalPrice,
      notes: orderData.notes || 'لا توجد ملاحظات',
      order_date: new Date().toLocaleString('ar-AE'),
      order_id: `CV-${Date.now()}`,
      has_existing_cv: orderData.existingCV ? 'نعم' : 'لا',
      existing_cv_name: orderData.existingCV ? orderData.existingCV.name : 'لا يوجد',
      // إضافة رسالة منسقة
      message: formatOrderMessage(orderData)
    };

    // إرسال البريد الإلكتروني عبر Formspree
    const response = await axios.post(FORMSPREE_ENDPOINT, emailData, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    if (response.status === 200) {
      console.log('تم إرسال الطلب بنجاح عبر Formspree');
      
      // إرسال تأكيد للعميل
      await sendCustomerConfirmation(orderData);
      
      return { success: true, message: 'تم إرسال الطلب بنجاح' };
    } else {
      throw new Error('فشل في إرسال البريد الإلكتروني');
    }
  } catch (error) {
    console.error('خطأ في إرسال البريد الإلكتروني:', error);
    
    // محاولة بديلة باستخدام Web3Forms
    try {
      return await sendViaWeb3Forms(orderData);
    } catch (fallbackError) {
      console.error('فشل في الإرسال البديل:', fallbackError);
      return { success: false, message: 'حدث خطأ في إرسال الطلب' };
    }
  }
};

// خدمة بديلة - Web3Forms
const sendViaWeb3Forms = async (orderData) => {
  const WEB3FORMS_ACCESS_KEY = 'YOUR_WEB3FORMS_KEY'; // سيتم تحديثه لاحقاً
  
  const formData = new FormData();
  formData.append('access_key', WEB3FORMS_ACCESS_KEY);
  formData.append('subject', `طلب سيرة ذاتية جديد - ${orderData.name}`);
  formData.append('from_email', orderData.email);
  formData.append('message', formatOrderMessage(orderData));
  formData.append('redirect', 'https://web3forms.com/success');

  const response = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    body: formData
  });

  if (response.ok) {
    console.log('تم إرسال الطلب بنجاح عبر Web3Forms');
    await sendCustomerConfirmation(orderData);
    return { success: true, message: 'تم إرسال الطلب بنجاح' };
  } else {
    throw new Error('فشل في إرسال البريد الإلكتروني عبر Web3Forms');
  }
};

// تنسيق رسالة الطلب
const formatOrderMessage = (orderData) => {
  return `
🎯 طلب سيرة ذاتية جديد
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 معلومات العميل:
• الاسم: ${orderData.name}
• البريد الإلكتروني: ${orderData.email}
• رقم الهاتف: ${orderData.phone}
• المهنة: ${orderData.profession}
• سنوات الخبرة: ${orderData.experience || 'غير محدد'}

📦 تفاصيل الطلب:
• الباقة المختارة: ${getPackageName(orderData.package)}
• الخدمات الإضافية: ${formatAdditionalServices(orderData.additionalServices)}
• السعر الإجمالي: ${orderData.totalPrice} درهم

📄 السيرة الذاتية السابقة:
• يوجد ملف سابق: ${orderData.existingCV ? 'نعم' : 'لا'}
• اسم الملف: ${orderData.existingCV ? orderData.existingCV.name : 'لا يوجد'}

📝 ملاحظات إضافية:
${orderData.notes || 'لا توجد ملاحظات'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🕐 تاريخ الطلب: ${new Date().toLocaleString('ar-AE')}
🆔 رقم الطلب: CV-${Date.now()}

يرجى التواصل مع العميل خلال 24 ساعة.
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

// دالة لإرسال تأكيد للعميل عبر خدمة منفصلة
export const sendCustomerConfirmation = async (customerData) => {
  try {
    // استخدام خدمة منفصلة لتأكيد العميل
    const confirmationData = {
      _replyto: 'nestaman2@gmail.com',
      _subject: 'تأكيد استلام طلبك - ضياء الدين لتصميم السير الذاتية',
      customer_name: customerData.name,
      customer_email: customerData.email,
      order_id: `CV-${Date.now()}`,
      package_name: getPackageName(customerData.package),
      total_price: customerData.totalPrice,
      order_date: new Date().toLocaleString('ar-AE'),
      message: formatConfirmationMessage(customerData)
    };

    // إرسال إلى بريد العميل
    const customerResponse = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_key: 'YOUR_CUSTOMER_CONFIRMATION_KEY', // مفتاح منفصل للتأكيد
        subject: 'تأكيد استلام طلبك - ضياء الدين',
        from_email: 'nestaman2@gmail.com',
        email: customerData.email,
        message: formatConfirmationMessage(customerData)
      })
    });

    if (customerResponse.ok) {
      console.log('تم إرسال تأكيد الطلب للعميل');
      return { success: true };
    }
  } catch (error) {
    console.error('خطأ في إرسال تأكيد الطلب:', error);
    return { success: false };
  }
};

// تنسيق رسالة التأكيد للعميل
const formatConfirmationMessage = (customerData) => {
  return `
عزيزي/عزيزتي ${customerData.name}،

شكراً لك على ثقتك في خدماتنا! 🙏

تم استلام طلبك بنجاح وسنبدأ العمل عليه قريباً.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 تفاصيل طلبك:
• رقم الطلب: CV-${Date.now()}
• الباقة المختارة: ${getPackageName(customerData.package)}
• المبلغ الإجمالي: ${customerData.totalPrice} درهم
• تاريخ الطلب: ${new Date().toLocaleString('ar-AE')}

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

// خدمة بديلة إضافية باستخدام Netlify Forms (إذا كان الموقع على Netlify)
export const sendViaNetlify = async (orderData) => {
  try {
    const formData = new FormData();
    formData.append('form-name', 'cv-orders');
    formData.append('customer-name', orderData.name);
    formData.append('customer-email', orderData.email);
    formData.append('customer-phone', orderData.phone);
    formData.append('profession', orderData.profession);
    formData.append('package', getPackageName(orderData.package));
    formData.append('total-price', orderData.totalPrice);
    formData.append('message', formatOrderMessage(orderData));

    const response = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData).toString()
    });

    if (response.ok) {
      console.log('تم إرسال الطلب بنجاح عبر Netlify Forms');
      return { success: true, message: 'تم إرسال الطلب بنجاح' };
    } else {
      throw new Error('فشل في إرسال البريد الإلكتروني عبر Netlify');
    }
  } catch (error) {
    console.error('خطأ في إرسال البريد الإلكتروني عبر Netlify:', error);
    return { success: false, message: 'حدث خطأ في إرسال الطلب' };
  }
};