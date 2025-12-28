import ForgotPasswordForm from "@/components/ui/Forms/ForgotPasswordForm";
import styles from "@/assets/styles/login.module.css";

export default function ForgotPasswordPage() {
    return (
        <>
            {/* Background Image with Overlay */}
            <div className={styles.bgImage}
                style={{
                    backgroundImage: `url('/assets/videos/Vid003.mp4')`,
                }}
            ></div>

            <video src="/assets/videos/Vid003.mp4" className="absolute top-0 left-0 w-full h-full object-cover opacity-30" autoPlay loop muted></video>

            <div className="h-screen bg-center text-center flex items-center justify-center">
                <div className="container mx-auto">
                    <div className="p-5">
                        <div className="flex items-center justify-center p-4">
                            <ForgotPasswordForm />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
