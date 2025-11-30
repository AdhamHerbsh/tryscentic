import Image from "next/image";
import FacebookIcon from "@/assets/images/icons/facebook.svg"
import InstagramIcon from "@/assets/images/icons/instagram.svg"
import WhatsappIcon from "@/assets/images/icons/whatsapp-business.svg"
import TiktokIcon from "@/assets/images/icons/tiktok.svg"


export default function Icons() {
    return (
        <div>
            <div className="max-w-6xl mx-auto px-6 text-white">

                <div className="flex justify-center gap-4">
                    <Image src={FacebookIcon} alt="Facebook" />
                    <Image src={InstagramIcon} alt="Instagram" />
                    <Image src={WhatsappIcon} alt="Whatsapp" />
                    <Image src={TiktokIcon} alt="Tiktok" />
                </div>

            </div>
        </div>
    );
}