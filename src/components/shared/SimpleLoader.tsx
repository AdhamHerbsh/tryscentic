"use client";
import styles from "./simple-loader.module.css";

export default function SimpleLoader() {

    return (
        <div className="w-full h-screen flex items-center justify-center bg-accent">
            <div className={styles.container}>
                {/* Spinner */}
                <div className={`${styles.spinner} border-primary`}></div>
                {/* Loading text */}
                <p className={`${styles.text} text-primary`}>
                    Loading...
                </p>
            </div>
        </div>
    );
}
