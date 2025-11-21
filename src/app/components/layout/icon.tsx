import Image from 'next/image';

       export default function   Icon(){
        return(
            <section>
          {/* Icons */}
          <div className="flex space-x-8 mt-0 justify-center">
            <Image
              src="/assets/images/icons/Instagram.svg"
              alt="Instagram"
              width={35}
              height={35}
              className="opacity-80"
            />
            <Image
              src="/assets/images/icons/WhatsApp Business.svg"
              alt="WhatsApp"
              width={35}
              height={35}
              className="opacity-80"
            />
            <Image
              src="/assets/images/icons/Facebook.svg"
              alt="Facebook"
              width={35}
              height={35}
              className="opacity-80"
            />
            <Image
              src="/assets/images/icons/Tik Tok.svg"
              alt="TikTok"
              width={35}
              height={35}
              className="opacity-80"
            />
          </div>
        </section>
        )}