"use client";
import Image from "next/image";
import Link from "next/link";
import { useSiteSettingsContext } from "@/providers/SiteSettingsProvider";
import FacebookIcon from "@/assets/images/icons/facebook.png"
import InstagramIcon from "@/assets/images/icons/instagram.png"
import WhatsappIcon from "@/assets/images/icons/whatsapp-business.png"
import TiktokIcon from "@/assets/images/icons/tiktok.png"

// Fallback icon map if images are used or if we switch to Lucide
const IconMap: any = {
    facebook: FacebookIcon,
    instagram: InstagramIcon,
    whatsapp: WhatsappIcon,
    tiktok: TiktokIcon
};

export default function SocialIcons() {
    const { socials } = useSiteSettingsContext();
    const links = socials?.links || [];

    // Fallback if no links in DB
    if (links.length === 0) {
        return (
            <div>
                <div className="max-w-6xl mx-auto px-6 text-white">
                    <div className="flex justify-center items-center gap-4">
                        <Link href="https://www.facebook.com/tryscentic/" target="_blank">
                            <Image src={FacebookIcon} alt="Facebook" width={32} height={32} className="footer-icons" />
                        </Link>
                        <Link href="https://www.instagram.com/tryscentic/" target="_blank">
                            <Image src={InstagramIcon} alt="Instagram" width={32} height={32} className="footer-icons" />
                        </Link>
                        {/* More defaults */}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="max-w-6xl mx-auto px-6 text-white">
                <div className="flex justify-center items-center gap-4">
                    {links.map((link, idx) => {
                        const iconKey = link.platform.toLowerCase();
                        const iconSrc = IconMap[iconKey];

                        return (
                            <Link key={idx} href={link.url} target="_blank">
                                {iconSrc ? (
                                    <Image
                                        src={iconSrc}
                                        alt={link.platform}
                                        width={32}
                                        height={32}
                                        className="footer-icons"
                                    />
                                ) : (
                                    <span className="p-2 bg-gray-800 rounded-full hover:bg-gray-700">{link.platform[0]}</span>
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
