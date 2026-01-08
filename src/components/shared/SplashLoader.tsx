"use client";

import { useState } from "react";
import Loader from "@/components/shared/Loader";

export default function SplashLoader() {
    const [show, setShow] = useState(true);

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50">
            <Loader onComplete={() => setShow(false)} />
        </div>
    );
}
