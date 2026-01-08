import Image from "next/image";
import FacebookIcon from "@/assets/images/icons/facebook.svg"
import InstagramIcon from "@/assets/images/icons/instagram.svg"
import WhatsappIcon from "@/assets/images/icons/whatsapp-business.svg"
import TiktokIcon from "@/assets/images/icons/tiktok.svg"
import Link from "next/link";


export default function Icons() {
    return (
        <div>
            <div className="max-w-6xl mx-auto px-6 text-white">

                <div className="flex justify-center gap-4">
                    <Image className="footer-icons" src={FacebookIcon} alt="Facebook" />
                    <Link href="https://www.instagram.com/tryscentic/" target="_blank">
                        <Image className="footer-icons" src={InstagramIcon} alt="Instagram" />
                    </Link>
                    <Link href="https://wa.me/+201090767839" target="_blank">
                        <Image className="footer-icons" src={WhatsappIcon} alt="Whatsapp" />
                    </Link>
                    <Link href="https://www.tiktok.com/@tryscentic" target="_blank">
                        <Image className="footer-icons" src={TiktokIcon} alt="Tiktok" />
                    </Link>
                </div>

            </div>
        </div>
    );
}