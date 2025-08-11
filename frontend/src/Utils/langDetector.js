// src/utils/detectLanguage.js
export default function detectLanguage(text) {
      if (!text) return "unknown";
      const arabic = /[\u0600-\u06FF]/;
      const english = /[A-Za-z]/;
      const hasAr = arabic.test(text);
      const hasEn = english.test(text);
      if (hasAr && !hasEn) return "ar";
      if (hasEn && !hasAr) return "en";
      return "unknown";
}
