import React from "react";
import owlLogo from "@/assets/owl-logo/black/owl-512.png";

interface ErrorLogoProps {
    errorMessage?: string; 
}

const ErrorLogo: React.FC<ErrorLogoProps> = ({ errorMessage }) => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div style={{ filter: `var(--logo-filter, invert(0.8) sepia(0.5) saturate(1.5))` }}>
                <img src={owlLogo} alt="Error Logo" className="w-16 h-16" />
            </div>
            <p className="mt-4 text-lg font-semibold text-red-600">
                {errorMessage || "Something went wrong..."}
            </p>
        </div>
    );
};

export default ErrorLogo;