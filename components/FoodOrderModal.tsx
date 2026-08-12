"use client";

import { useState, useEffect } from "react";
import { Utensils, Sparkles, CheckCircle2, X, Store, DollarSign, Send, ShoppingBag } from "lucide-react";

interface FoodConfig {
  isOpen: boolean;
  activeDay: string;
}

export default function FoodOrderModal() {
  const [config, setConfig] = useState<FoodConfig | null>(null);
  const [isOpenModal, setIsOpenModal] = useState(false);

  // Form Fields
  const [restaurantName, setRestaurantName] = useState("الآغا 🌯");
  const [customRestaurant, setCustomRestaurant] = useState("");
  const [mealName, setMealName] = useState("");
  const [price, setPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchConfig = async () => {
    try {
      const res = await fetch("/api/food/config");
      const data = await res.json();
      if (data.config) {
        setConfig(data.config);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConfig();
    const interval = setInterval(fetchConfig, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!config || !config.isOpen) {
    return null; // Form is closed by admin
  }

  const selectedRestaurantFinal =
    restaurantName === "OTHER" ? customRestaurant : restaurantName;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    if (!selectedRestaurantFinal.trim()) {
      setErrorMsg("يرجى اختيار وتحديد اسم المطعم");
      setSubmitting(false);
      return;
    }

    if (!mealName.trim()) {
      setErrorMsg("يرجى إدخال اسم الوجبة التفصيلي");
      setSubmitting(false);
      return;
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setErrorMsg("يرجى إدخال سعر صحيح للوجبة بالجنيه");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/food/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantName: selectedRestaurantFinal,
          mealName,
          price: parsedPrice,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "حدث خطأ أثناء حفظ الطلب");
      } else {
        setSuccessMsg(`تم إرسال طلبك بنجاح لـ (${data.order.restaurantName}) بقيمة ${data.order.price} جنيه 🎉`);
        setMealName("");
        setPrice("");
        setTimeout(() => {
          setSuccessMsg("");
          setIsOpenModal(false);
        }, 3000);
      }
    } catch (err) {
      setErrorMsg("تعذر الاتصال بالخادم، يرجى إعادة المحاولة");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Active Callout Card on Dashboard */}
      <div className="bg-gradient-to-r from-amber-500/20 via-gold/15 to-sand p-6 rounded-3xl border-2 border-gold shadow-xl relative overflow-hidden animate-fadeIn">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gold text-olive-dark font-black flex items-center justify-center animate-bounce shadow">
              <Utensils className="w-6 h-6" />
            </div>
            <div>
              <span className="bg-emerald-600 text-white text-[11px] font-black px-3 py-1 rounded-full shadow-sm">
                استمارة طلبات الأكل مفتوحة الآن 🍱
              </span>
              <h3 className="text-lg font-black text-olive-dark mt-1">
                طلبات وجبات ({config.activeDay})
              </h3>
              <p className="text-xs text-dark/70 font-semibold mt-0.5">
                اختر المطعم المتاح ووجبتك وسعرها ليتم تجهيز وتجميع الطلبيات.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOpenModal(true)}
            className="w-full sm:w-auto px-7 py-3.5 bg-olive hover:bg-olive-dark text-white rounded-2xl text-xs font-black shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4 text-gold" />
            <span>طلب وجبتك الآن 🍱</span>
          </button>
        </div>
      </div>

      {/* Food Order Modal */}
      {isOpenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-olive/20 space-y-6 relative">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-sand-dark pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gold/20 text-gold-dark font-black flex items-center justify-center shadow-inner">
                  <Utensils className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-olive-dark">
                    استمارة طلب الوجبات الغذائية 🍱
                  </h3>
                  <p className="text-xs font-bold text-olive">
                    {config.activeDay}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpenModal(false)}
                className="p-2 text-dark/40 hover:text-dark rounded-full hover:bg-sand transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Restaurant Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-black text-olive flex items-center gap-1.5">
                  <Store className="w-4 h-4 text-gold" />
                  <span>اختر المطعم:</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRestaurantName("الآغا 🌯")}
                    className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer font-black text-xs ${
                      restaurantName === "الآغا 🌯"
                        ? "bg-olive text-white border-olive shadow-md ring-2 ring-gold/40"
                        : "bg-sand/30 hover:bg-sand text-dark border-olive/15"
                    }`}
                  >
                    الآغا 🌯
                  </button>

                  <button
                    type="button"
                    onClick={() => setRestaurantName("كشري التحرير 🍚")}
                    className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer font-black text-xs ${
                      restaurantName === "كشري التحرير 🍚"
                        ? "bg-olive text-white border-olive shadow-md ring-2 ring-gold/40"
                        : "bg-sand/30 hover:bg-sand text-dark border-olive/15"
                    }`}
                  >
                    كشري التحرير 🍚
                  </button>
                </div>

                {/* Menu Links */}
                <div className="flex flex-wrap gap-2 pt-1">
                  <a
                    href="https://www.alaghaegypt.co/ar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-olive underline hover:text-gold-dark transition-colors"
                  >
                    📋 شوف منيو الآغا
                  </a>
                  <span className="text-dark/30">|</span>
                  <a
                    href="https://www.menuegypt.com/ar/%D9%83%D8%B4%D8%B1%D9%89-%D8%A7%D9%84%D8%AA%D8%AD%D8%B1%D9%8A%D8%B1/%D8%A7%D9%84%D8%AF%D9%82%D9%89"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-olive underline hover:text-gold-dark transition-colors"
                  >
                    📋 شوف منيو كشري التحرير
                  </a>
                </div>

                {/* Optional Custom Restaurant Button */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setRestaurantName("OTHER")}
                    className={`text-xs font-bold underline text-olive hover:text-olive-dark ${
                      restaurantName === "OTHER" ? "font-black text-gold-dark" : ""
                    }`}
                  >
                    أو ادخل اسم مطعم آخر ➕
                  </button>
                </div>

                {restaurantName === "OTHER" && (
                  <input
                    type="text"
                    required
                    value={customRestaurant}
                    onChange={(e) => setCustomRestaurant(e.target.value)}
                    placeholder="اكتب اسم المطعم المطلوب..."
                    className="w-full p-3 bg-sand/30 border border-olive/20 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-gold mt-2"
                  />
                )}
              </div>

              {/* Meal Name Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-olive">
                  اسم الوجبة المطلوبة والتفاصيل:
                </label>
                <input
                  type="text"
                  required
                  value={mealName}
                  onChange={(e) => setMealName(e.target.value)}
                  placeholder="مثال: ساندوتش شاورما فراخ سوري + بطاطس"
                  className="w-full p-3.5 bg-sand/30 border border-olive/20 rounded-2xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>

              {/* Meal Price Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-olive flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-gold" />
                  <span>سعر الوجبة بالجنيه المصري (EGP):</span>
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  step="0.5"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="مثال: 120"
                  className="w-full p-3.5 bg-sand/30 border border-olive/20 rounded-2xl text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-700 text-xs font-bold rounded-xl border border-red-200">
                  ⚠️ {errorMsg}
                </div>
              )}

              {successMsg && (
                <div className="p-3.5 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Buttons */}
              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpenModal(false)}
                  className="px-5 py-3 bg-gray-200 text-dark rounded-2xl text-xs font-bold hover:bg-gray-300 transition-all cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-7 py-3 bg-olive hover:bg-olive-dark text-white rounded-2xl text-xs font-black shadow-lg hover:shadow-xl transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  <Send className="w-4 h-4 text-gold" />
                  <span>{submitting ? "جاري تسجيل الطلب..." : "تأكيد وإرسال الطلب 🍱"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
