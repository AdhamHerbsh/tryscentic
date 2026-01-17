"use client";
import { useSiteSettingsContext } from "@/providers/SiteSettingsProvider";

const Disclaimer = () => {
    const { content } = useSiteSettingsContext();
    const disclaimerText = content?.disclaimer || `Tryscentic.com is a wholly independent and separate entity from the manufacturer or brand owners of the designer fragrance. 
    All 1ml, 5ml, and 10 ml fragrance samples available on www.tryscentic.com are genuine products that have been independently rebottled and repackaged by Tryscentic.
    Tryscentic is not affiliated, connected, or associated with the designers, manufacturers, or brand owners of the fragrances. All trademarks are the property of their respective owners.`;

    return (
        <section className="py-20 px-4">
            <div className="container mx-auto">
                <div className="mb-8">
                    <h2 className="text-5xl font-bold text-secondary uppercase tracking-[0.2em] mb-2">Legal Disclaimer</h2>
                    <div className="w-24 h-1 bg-secondary/60 rounded-full"></div>
                </div>
                <div className="space-y-6 text-white/60 leading-7">
                    <p className="whitespace-pre-line text-xl">
                        {disclaimerText}
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Disclaimer;
