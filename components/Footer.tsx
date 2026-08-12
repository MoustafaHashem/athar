import Image from "next/image";
import { Footprints, MapPin, Calendar } from "lucide-react";

export default function Footer() {
  return (
    <footer className="olive-gradient text-sand border-t-4 border-gold py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        {/* Logos & Footprints Divider */}
        <div className="flex justify-center items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-gold overflow-hidden bg-white p-0.5 shadow">
            <Image
              src="/images/branding/clan-logo.png"
              alt="لوجو عشيرة الجوالة"
              width={40}
              height={40}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex items-center gap-2 text-gold/60">
            <Footprints className="w-4 h-4 transform -rotate-12" />
            <span className="w-10 h-0.5 bg-gold/40"></span>
            <Footprints className="w-4 h-4 transform rotate-12" />
          </div>
          <div className="w-10 h-10 rounded-full border border-gold overflow-hidden bg-white p-0.5 shadow">
            <Image
              src="/images/branding/logo.jpg"
              alt="لوجو أثر"
              width={40}
              height={40}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>

        <h3 className="text-lg font-black text-white">
          برنامج إعداد القادة — "أثر"
        </h3>
        <p className="text-gold font-bold text-sm">
          "القيادة لا تُولد، ولكن تُبنَى ليبقى أثرها"
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-sand/80 font-semibold pt-2">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-gold" />
            <span>13-15 أغسطس 2026</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-gold" />
            <span>نادي الكشافة البحرية بالقاهرة (حارس)</span>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 text-[11px] text-sand/60 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>حقوق الطبع محفوظة © عشيرة جوالة كلية الهندسة — جامعة عين شمس</span>
          <span className="text-gold font-black text-xs tracking-wider px-2 py-0.5 rounded border border-gold/30 bg-white/5" dir="ltr">MH</span>
        </div>
      </div>
    </footer>
  );
}
