"use client";

import LoginForm from "@/components/ui/Forms/LoginForm";
import styles from "@/assets/styles/login.module.css";

export default function Login() {

  return (
    <>
      {/* Background Image with Overlay */}
      <div className={styles.bgImage}
        style={{
          // 1. Set the background image
          backgroundImage: `url('/assets/images/logo/logo-icon-1200x1200.png')`,
        }}
      ></div>

      <div className="h-screen bg-center text-center flex items-center justify-center">
        <div className="container mx-auto">
          <div className="p-5">
            <div className="flex items-center justify-center p-4">

              <LoginForm />

            </div>
          </div>
        </div>
      </div>

    </>
  );
}
