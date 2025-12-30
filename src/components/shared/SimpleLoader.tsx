"use client";

export default function SimpleLoader() {
    return (
        <div className="w-full h-screen flex items-center justify-center bg-accent">
            <div className="simple-loader-container">
                {/* Spinner */}
                <div className="simple-loader-spinner border-primary"></div>
                {/* Loading text */}
                <p className="simple-loader-text text-primary">
                    Loading...
                </p>
            </div>
        </div>
    );
}
