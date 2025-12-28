"use client";

import { useState } from "react";
import Loader from "@/components/shared/Loader";

export default function SplashLoader() {
    const [show, setShow] = useState(true);

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-[9999]">
            <Loader onComplete={() => setShow(false)} />
        </div>
    );
}
