// Disease name translations
export const getDiseaseTranslation = (diseaseName: string, language: string): string => {
  const diseaseKey = diseaseName.toLowerCase().replace(/[^a-z0-9]/g, '_');
  
  const translations: Record<string, Record<string, string>> = {
    // Tomato diseases
    'tomato___late_blight': {
      en: 'Tomato - Late Blight',
      ur: 'ٹماٹر - لیٹ بلائٹ',
      hi: 'टमाटर - लेट ब्लाइट',
      kn: 'ಟೊಮ್ಯಾಟೊ - ಲೇಟ್ ಬ್ಲೈಟ್'
    },
    'tomato_late_blight': {
      en: 'Tomato Late Blight',
      ur: 'ٹماٹر لیٹ بلائٹ',
      hi: 'टमाटर लेट ब्लाइट',
      kn: 'ಟೊಮ್ಯಾಟೊ ಲೇಟ್ ಬ್ಲೈಟ್'
    },
    'tomato___early_blight': {
      en: 'Tomato - Early Blight',
      ur: 'ٹماٹر - ارلی بلائٹ',
      hi: 'टमाटर - अर्ली ब्लाइट',
      kn: 'ಟೊಮ್ಯಾಟೊ - ಎರ್ಲಿ ಬ್ಲೈಟ್'
    },
    'tomato___septoria_leaf_spot': {
      en: 'Tomato - Septoria Leaf Spot',
      ur: 'ٹماٹر - سیپٹوریا پتوں کا دھبا',
      hi: 'टमाटर - सेप्टोरिया पत्ती धब्बा',
      kn: 'ಟೊಮ್ಯಾಟೊ - ಸೆಪ್ಟೋರಿಯಾ ಎಲೆ ಚುಕ್ಕೆ'
    },
    'tomato___healthy': {
      en: 'Healthy Tomato Plant',
      ur: 'صحت مند ٹماٹر کا پودا',
      hi: 'स्वस्थ टमाटर का पौधा',
      kn: 'ಆರೋಗ್ಯಕರ ಟೊಮ್ಯಾಟೊ ಸಸ್ಯ'
    },
    // Potato diseases
    'potato___late_blight': {
      en: 'Potato - Late Blight',
      ur: 'آلو - لیٹ بلائٹ',
      hi: 'आलू - लेट ब्लाइट',
      kn: 'ಆಲೂಗಡ್ಡೆ - ಲೇಟ್ ಬ್ಲೈಟ್'
    },
    'potato___early_blight': {
      en: 'Potato - Early Blight',
      ur: 'آلو - ارلی بلائٹ',
      hi: 'आलू - अर्ली ब्लाइट',
      kn: 'ಆಲೂಗಡ್ಡೆ - ಎರ್ಲಿ ಬ್ಲೈಟ್'
    },
    'potato___healthy': {
      en: 'Healthy Potato Plant',
      ur: 'صحت مند آلو کا پودا',
      hi: 'स्वस्थ आलू का पौधा',
      kn: 'ಆರೋಗ್ಯಕರ ಆಲೂಗಡ್ಡೆ ಸಸ್ಯ'
    },
    // Corn diseases
    'corn___common_rust_': {
      en: 'Corn - Common Rust',
      ur: 'مکئی - عام زنگ',
      hi: 'मक्का - सामान्य रस्ट',
      kn: 'ಜೋಳ - ಸಾಮಾನ್ಯ ತುಕ್ಕು'
    },
    'corn___northern_leaf_blight': {
      en: 'Corn - Northern Leaf Blight',
      ur: 'مکئی - شمالی پتوں کی جھلسن',
      hi: 'मक्का - उत्तरी पत्ती झुलसा',
      kn: 'ಜೋಳ - ಉತ್ತರ ಎಲೆ ಬ್ಲೈಟ್'
    },
    'corn___cercospora_leaf_spot_gray_leaf_spot': {
      en: 'Corn - Gray Leaf Spot',
      ur: 'مکئی - سرمئی پتوں کا دھبا',
      hi: 'मक्का - ग्रे पत्ती धब्बा',
      kn: 'ಜೋಳ - ಬೂದು ಎಲೆ ಚುಕ್ಕೆ'
    },
    'corn___healthy': {
      en: 'Healthy Corn Plant',
      ur: 'صحت مند مکئی کا پودا',
      hi: 'स्वस्थ मक्का का पौधा',
      kn: 'ಆರೋಗ್ಯಕರ ಜೋಳ ಸಸ್ಯ'
    },
    // Grape diseases  
    'grape___black_rot': {
      en: 'Grape - Black Rot',
      ur: 'انگور - سیاہ سڑن',
      hi: 'अंगूर - काला सड़न',
      kn: 'ದ್ರಾಕ್ಷಿ - ಕಪ್ಪು ಕೊಳೆತ'
    },
    'grape___esca__black_measles_': {
      en: 'Grape - Black Measles',
      ur: 'انگور - سیاہ خسرہ',
      hi: 'अंगूर - काला खसरा',
      kn: 'ದ್ರಾಕ್ಷಿ - ಕಪ್ಪು ದಾಣು'
    },
    'grape___leaf_blight__isariopsis_leaf_spot_': {
      en: 'Grape - Leaf Blight',
      ur: 'انگور - پتوں کی جھلسن',
      hi: 'अंगूर - पत्ती झुलसा',
      kn: 'ದ್ರಾಕ್ಷಿ - ಎಲೆ ಬ್ಲೈಟ್'
    },
    'grape___healthy': {
      en: 'Healthy Grape Plant',
      ur: 'صحت مند انگور کا پودا',
      hi: 'स्वस्थ अंगूर का पौधा',
      kn: 'ಆರೋಗ್ಯಕರ ದ್ರಾಕ್ಷಿ ಸಸ್ಯ'
    },
    // Apple diseases
    'apple___apple_scab': {
      en: 'Apple - Apple Scab',
      ur: 'سیب - سیب کی خارش',
      hi: 'सेब - सेब स्कैब',
      kn: 'ಸೇಬು - ಸೇಬು ಸ್ಕ್ಯಾಬ್'
    },
    'apple___cedar_apple_rust': {
      en: 'Apple - Cedar Apple Rust',
      ur: 'سیب - سیڈر سیب زنگ',
      hi: 'सेब - सीडर सेब रस्ट',
      kn: 'ಸೇಬು - ಸೀಡರ್ ಸೇಬು ತುಕ್ಕು'
    },
    'apple___black_rot': {
      en: 'Apple - Black Rot',
      ur: 'سیب - سیاہ سڑن',
      hi: 'सेब - काला सड़न',
      kn: 'ಸೇಬು - ಕಪ್ಪು ಕೊಳೆತ'
    },
    'apple___healthy': {
      en: 'Healthy Apple Plant',
      ur: 'صحت مند سیب کا پودا',
      hi: 'स्वस्थ सेब का पौधा',
      kn: 'ಆರೋಗ್ಯಕರ ಸೇಬು ಸಸ್ಯ'
    },
    // Pepper diseases
    'pepper__bell___bacterial_spot': {
      en: 'Pepper - Bacterial Spot',
      ur: 'مرچ - بیکٹیریل دھبا',
      hi: 'मिर्च - बैक्टीरियल धब्बा',
      kn: 'ಮೆಣಸು - ಬ್ಯಾಕ್ಟೀರಿಯಲ್ ಚುಕ್ಕೆ'
    },
    'pepper__bell___healthy': {
      en: 'Healthy Pepper Plant',
      ur: 'صحت مند مرچ کا پودا',
      hi: 'स्वस्थ मिर्च का पौधा',
      kn: 'ಆರೋಗ್ಯಕರ ಮೆಣಸು ಸಸ್ಯ'
    },
    // Strawberry diseases
    'strawberry___leaf_scorch': {
      en: 'Strawberry - Leaf Scorch',
      ur: 'اسٹرابیری - پتوں کی جھلسن',
      hi: 'स्ट्रॉबेरी - पत्ती झुलसा',
      kn: 'ಸ್ಟ್ರಾಬೆರಿ - ಎಲೆ ಸುಟ್ಟು'
    },
    'strawberry_with_leaf_scorch': {
      en: 'Strawberry With Leaf Scorch',
      ur: 'اسٹرابیری پتوں کی جھلسن کے ساتھ',
      hi: 'स्ट्रॉबेरी पत्ती झुलसा के साथ',
      kn: 'ಸ್ಟ್ರಾಬೆರಿ ಎಲೆ ಸುಟ್ಟಿನೊಂದಿಗೆ'
    },
    'strawberry___healthy': {
      en: 'Healthy Strawberry Plant',
      ur: 'صحت مند اسٹرابیری کا پودا',
      hi: 'स्वस्थ स्ट्रॉबेरी का पौधा',
      kn: 'ಆರೋಗ್ಯಕರ ಸ್ಟ್ರಾಬೆರಿ ಸಸ್ಯ'
    },
    // Cherry diseases
    'cherry___powdery_mildew': {
      en: 'Cherry - Powdery Mildew',
      ur: 'چیری - پاؤڈری ملڈیو',
      hi: 'चेरी - पाउडरी मिल्ड्यू',
      kn: 'ಚೆರ್ರಿ - ಪೌಡರಿ ಮಿಲ್ಡ್ಯೂ'
    },
    'cherry___healthy': {
      en: 'Healthy Cherry Plant',
      ur: 'صحت مند چیری کا پودا',
      hi: 'स्वस्थ चेरी का पौधा',
      kn: 'ಆರೋಗ್ಯಕರ ಚೆರ್ರಿ ಸಸ್ಯ'
    },
    // Peach diseases
    'peach___bacterial_spot': {
      en: 'Peach - Bacterial Spot',
      ur: 'آڑو - بیکٹیریل دھبا',
      hi: 'आड़ू - बैक्टीरियल धब्बा',
      kn: 'ಪೀಚ್ - ಬ್ಯಾಕ್ಟೀರಿಯಲ್ ಚುಕ್ಕೆ'
    },
    'peach___healthy': {
      en: 'Healthy Peach Plant',
      ur: 'صحت مند آڑو کا پودا',
      hi: 'स्वस्थ आड़ू का पौधा',
      kn: 'ಆರೋಗ್ಯಕರ ಪೀಚ್ ಸಸ್ಯ'
    },
    // Squash diseases
    'squash___powdery_mildew': {
      en: 'Squash - Powdery Mildew',
      ur: 'کدو - پاؤڈری ملڈیو',
      hi: 'कद्दू - पाउडरी मिल्ड्यू',
      kn: 'ಸೀಮೆಬಡ್ಡೆ - ಪೌಡರಿ ಮಿಲ್ಡ್ಯೂ'
    },
    // Orange diseases
    'orange___haunglongbing__citrus_greening_': {
      en: 'Orange - Citrus Greening',
      ur: 'نارنجی - سٹرس گرینینگ',
      hi: 'संतरा - सिट्रस ग्रीनिंग',
      kn: 'ಕಿತ್ತಳೆ - ಸಿಟ್ರಸ್ ಗ್ರೀನಿಂಗ್'
    },
    // Raspberry
    'raspberry___healthy': {
      en: 'Healthy Raspberry Plant',
      ur: 'صحت مند راسبیری کا پودا',
      hi: 'स्वस्थ रासबेरी का पौधा',
      kn: 'ಆರೋಗ್ಯಕರ ರಾಸ್್ಬೆರಿ ಸಸ್ಯ'
    },
    'healthy_raspberry_plant': {
      en: 'Healthy Raspberry Plant',
      ur: 'صحت مند راسبیری کا پودا',
      hi: 'स्वस्थ रासबेरी का पौधा',
      kn: 'ಆರೋಗ್ಯಕರ ರಾಸ್್ಬೆರಿ ಸಸ್ಯ'
    },
    // Soybean
    'soybean___healthy': {
      en: 'Healthy Soybean Plant',
      ur: 'صحت مند سویابین کا پودا',
      hi: 'स्वस्थ सोयाबीन का पौधा',
      kn: 'ಆರೋಗ್ಯಕರ ಸೋಯಾಬೀನ್ ಸಸ್ಯ'
    },
    // Black Measles
    'grape_with_esca__black_measles_': {
      en: 'Grape With Esca (Black Measles)',
      ur: 'انگور ایسکا (سیاہ خسرہ) کے ساتھ',
      hi: 'अंगूर एस्का (काला खसरा) के साथ',
      kn: 'ದ್ರಾಕ್ಷಿ ಎಸ್ಕಾ (ಕಪ್ಪು ದಾಣು) ಜೊತೆ'
    }
  };

  // Try to find exact match
  if (translations[diseaseKey] && translations[diseaseKey][language]) {
    return translations[diseaseKey][language];
  }

  // Fallback to original name
  return diseaseName;
};
