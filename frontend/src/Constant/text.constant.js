// hooks/useExploreCateText.js
import { useLang } from "../context/LangContext";

const useTextLangChange = () => {
      const { isArabic } = useLang();

      const exploreCateTitle = isArabic ? "فئات الوصفات" : "Recipe Categories";
      const exploreCateSub = isArabic
            ? "ابحث عن الوصفات الجديدة والقديمة المفضلة لدى مستخدمي EEINA Food في أفضل فئات الوصفات."
            : "Find new and old favorites with EEINA Food users' top recipe categories.";

      const popularIngredients = isArabic ? "المكونات الشائعة" : "Popular Ingredients";
      const exploreIngSub = isArabic ? "احصل على المعلومات الغذائية والبدائل والنصائح والحقائق والوصفات الخاصة بالمكونات الشائعة." : "Get nutritional info, substitutes, tips, facts, and recipes for popular ingredient."

      const exporeCreTitle = isArabic ? "المبدعون المشهورون" : "Popular Creators";
      const exporeCreSub = isArabic ? "احصل على الإلهام من أفكار الوصفات والنصائح من صانعي الطعام المفضلين لديك على EEINA Food." : "Get inspired with recipe ideas and tips from your favorite food creators on EEINA Food."


      const exploreDiscoverTitle = isArabic ? "استكشف" : "Explore";
      const exploreSub = isArabic ? "اكتشف كل من الوصفات المفضلة الجديدة والكلاسيكية مع أفضل فئات وصفات EEINA." : "Discover both new and classic favorites with EEINA top recipe categories."



      // search page
      const mealTypeTitle = isArabic ? "نوع الوجبة" : "Meal Type";
      const cuisineTitle = isArabic ? "المطبخ" : "Cuisine";
      const dietLabelsTitle = isArabic ? "أنظمة غذائية" : "Diet Labels";
      const healthLabelsTitle = isArabic ? "الملصقات الصحية" : "Health Labels";
      const cookingTimeTitle = isArabic ? "وقت الطهي" : "Cooking Time";
      const yourSearchResults = isArabic ? ":نتائج بحثك" : "Your Search Results:";



      const viewAllBtn = isArabic ? "عرض الكل" : "View All";



      return {
            exploreCateTitle,
            exploreCateSub,
            popularIngredients,
            exploreIngSub,
            exporeCreSub,
            exporeCreTitle,
            viewAllBtn,
            exploreDiscoverTitle,
            exploreSub,
            mealTypeTitle,
            cuisineTitle,
            dietLabelsTitle,
            healthLabelsTitle,
            cookingTimeTitle,
            yourSearchResults,
      };
};

export default useTextLangChange;
