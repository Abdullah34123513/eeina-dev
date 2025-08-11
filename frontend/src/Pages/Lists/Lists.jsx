import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import handleGetApi from "../../API/Handler/getApi.handler";
import { motion } from "framer-motion";
import { Plus, Printer, Send, ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";
import { apiClient } from "../../Constant/api.constant";
import { useLang } from "../../context/LangContext";

const Lists = () => {
      const { id } = useParams();
      const { isArabic } = useLang();
      const langKey = isArabic ? "ar" : "en";

      const [listItems, setListItems] = useState([]);
      const [checkedItems, setCheckedItems] = useState({});
      const [listTitle, setListTitle] = useState("");

      // Labels for static text
      const labels = {
            selectList: {
                  en: "Please select a list to view items.",
                  ar: "يرجى اختيار قائمة لعرض العناصر."
            },
            featureComingSoon: {
                  en: "This feature is coming soon!",
                  ar: "هذه الميزة قادمة قريباً!"
            },
            addItems: {
                  en: "Add items",
                  ar: "إضافة عناصر"
            },
            checkout: {
                  en: "Checkout",
                  ar: "الدفع"
            },
            item_singular: { en: "item", ar: "عنصر" },
            item_plural: { en: "items", ar: "عناصر" },
      };

      const fetchListData = async () => {
            const res = await handleGetApi(`list/${id}`);
            setListItems(res?.data?.list || []);
            setListTitle(res?.data?.name || labels.selectList[langKey]);
      };

      useEffect(() => {
            if (id) fetchListData();
      }, [id]);

      const handleCheckboxChange = (index) => {
            setCheckedItems((prev) => ({
                  ...prev,
                  [index]: !prev[index],
            }));
      };

      const itemVariants = {
            unchecked: { opacity: 1, scale: 1 },
            checked: { opacity: 0.6, scale: 0.98, transition: { duration: 0.3 } },
      };

      if (!id || listItems.length === 0) {
            return (
                  <p className="text-center text-2xl" dir={isArabic ? "rtl" : "ltr"}>
                        {labels.selectList[langKey]}
                  </p>
            );
      }

      const handleComingSoon = () => {
            toast.success(labels.featureComingSoon[langKey]);
      };

      const handleListPrint = async () => {
            try {
                  const response = await apiClient.post(
                        `list/pdf`,
                        { list: listItems, lang: langKey },
                        { responseType: 'blob' }
                  );

                  const contentDisposition = response.headers['content-disposition'];
                  const filename = contentDisposition
                        ? contentDisposition.split('filename=')[1].replace(/"/g, '')
                        : 'list.pdf';

                  const blob = new Blob([response.data], { type: 'application/pdf' });
                  const url = window.URL.createObjectURL(blob);

                  const link = document.createElement('a');
                  link.href = url;
                  link.setAttribute('download', filename);
                  document.body.appendChild(link);
                  link.click();

                  document.body.removeChild(link);
                  window.URL.revokeObjectURL(url);
            } catch (error) {
                  console.error("Error printing list:", error);
            }
      };

      const totalItemsCount = listItems.length;
      const itemLabel =
            totalItemsCount === 1
                  ? labels.item_singular[langKey]
                  : labels.item_plural[langKey];

      return (
            <div className="w-full lg:min-w-[1024px] mx-auto p-4 bg-white" dir={isArabic ? "rtl" : "ltr"}>
                  <div className="flex items-center justify-between mb-6">
                        <div>
                              <h1 className="text-xl font-semibold">{listTitle}</h1>
                              <p className="text-sm text-gray-500">
                                    {totalItemsCount} {itemLabel}
                              </p>
                        </div>
                        <div className="flex items-center gap-4">
                              <Printer
                                    onClick={handleListPrint}
                                    className="cursor-pointer text-gray-600 hover:text-gray-900"
                                    size={20}
                              />
                              <Send
                                    onClick={handleComingSoon}
                                    className="cursor-pointer text-gray-600 hover:text-gray-900"
                                    size={20}
                              />
                        </div>
                  </div>

                  <div className="h-[400px] overflow-y-auto mb-4">
                        <ul className="space-y-3">
                              {listItems.map((item, index) => {
                                    const isChecked = !!checkedItems[index];
                                    return (
                                          <motion.li
                                                key={index}
                                                className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-50"
                                                animate={isChecked ? "checked" : "unchecked"}
                                                variants={itemVariants}
                                                dir={isArabic ? "rtl" : "ltr"}
                                          >
                                                <input
                                                      type="checkbox"
                                                      checked={isChecked}
                                                      onChange={() => handleCheckboxChange(index)}
                                                      className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                                                />
                                                {item?.image?.url && (
                                                      <div className="w-8 h-8 rounded-md overflow-hidden">
                                                            <img
                                                                  className="w-full h-full object-cover"
                                                                  src={item.image.url}
                                                                  alt={item?.name?.[langKey] || labels.fallbackName[langKey]}
                                                            />
                                                      </div>
                                                )}
                                                <motion.p
                                                      className={`flex-1 ${isChecked ? 'text-gray-400' : 'text-gray-800'}`}
                                                      style={{ textDecoration: isChecked ? "line-through" : "none" }}
                                                      animate={{ scale: isChecked ? 0.98 : 1 }}
                                                      transition={{ duration: 0.3 }}
                                                      dir={isArabic ? "rtl" : "ltr"}
                                                >
                                                      {item?.name?.[langKey]
                                                            ? item.name[langKey].charAt(0).toUpperCase() + item.name[langKey].slice(1)
                                                            : labels.fallbackName[langKey]}
                                                </motion.p>
                                          </motion.li>
                                    );
                              })}
                        </ul>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                        <button
                              className="flex items-center gap-2 text-primary border border-primary px-4 py-2 rounded-lg hover:bg-primary/5 transition-colors"
                              onClick={handleComingSoon}
                              dir={isArabic ? "rtl" : "ltr"}
                        >
                              <Plus size={18} />
                              <span className="text-sm">{labels.addItems[langKey]}</span>
                        </button>
                        <button
                              className="flex items-center gap-2 bg-btnSecondary text-white px-4 py-2 rounded-lg hover:bg-btnSecondary/90 transition-colors"
                              onClick={handleComingSoon}
                              dir={isArabic ? "rtl" : "ltr"}
                        >
                              <ShoppingCart size={18} />
                              <span className="text-sm">{labels.checkout[langKey]}</span>
                        </button>
                  </div>
            </div>
      );
};

export default Lists;