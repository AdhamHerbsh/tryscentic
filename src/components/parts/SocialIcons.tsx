import Image from "next/image";
import Link from "next/link";
import FacebookIcon from "@/assets/images/icons/facebook.png"
import InstagramIcon from "@/assets/images/icons/instagram.png"
import WhatsappIcon from "@/assets/images/icons/whatsapp-business.png"
import TiktokIcon from "@/assets/images/icons/tiktok.png"


export default function SocialIcons() {
    return (
        <div>
            <div className="max-w-6xl mx-auto px-6 text-white">

                <div className="flex justify-center items-center gap-4">
                    <Link href="https://www.facebook.com/tryscentic/" target="_blank">
                        <Image
                            src={FacebookIcon}
                            alt="Facebook"
                            width={32}
                            height={32}
                            className="footer-icons"
                        />
                    </Link>
                    <Link href="https://www.instagram.com/tryscentic/" target="_blank">
                        <Image
                            src={InstagramIcon}
                            alt="Instagram"
                            width={32}
                            height={32}
                            className="footer-icons"
                        />
                    </Link>
                    <Link href="https://wa.me/+201090767839" target="_blank">
                        <Image
                            src={WhatsappIcon}
                            alt="Whatsapp"
                            width={32}
                            height={32}
                            className="footer-icons"
                        />
                    </Link>
                    <Link href="https://www.tiktok.com/@tryscentic" target="_blank">
                        <Image
                            src={TiktokIcon}
                            alt="Tiktok"
                            width={32}
                            height={32}
                            className="footer-icons"
                        />
                    </Link>
                </div>

            </div>
        </div>
    );
}