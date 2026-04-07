import owlLogo from "@/assets/owl-logo/black/owl-512.png";
export default function AdminContentFallback() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center ">
            <div className="text-6xl mb-4 opacity-20">
                <img
                    src={owlLogo}
                    alt="OwlChat Logo"
                    className="h-32 w-32 filter invert-[0.8] sepia-[0.5] saturate-[1.5] hue-rotate-[180deg]"
                />
            </div>
            <h2 className="text-2xl font-semibold text-slate-400">
                Welcome to Owl Manager!
            </h2>
        </div>
    )
}