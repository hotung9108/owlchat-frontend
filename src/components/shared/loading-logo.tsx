import owlLogo from "@/assets/owl-logo/black/owl-512.png";

const LoadingLogo = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div 
                className="animate-spin" 
                style={{ filter: `var(--logo-filter, invert(0.8) sepia(0.5) saturate(1.5))` }}
            >
                <img src={owlLogo} alt="Loading Logo" className="w-16 h-16" />
            </div>
            <p className="mt-4 text-lg font-semibold">Loading...</p>
        </div>
    );
};

export default LoadingLogo;
