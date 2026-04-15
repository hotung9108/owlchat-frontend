import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Zap } from "lucide-react";

interface ComingSoonPageProps {
    title: string;
    description?: string;
    icon?: React.ReactNode;
}

export default function ComingSoonPage({ 
    title, 
    description = "Tính năng này đang được phát triển. Vui lòng quay lại sau!",
    icon
}: ComingSoonPageProps) {
    const navigate = useNavigate();

    return (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 via-secondary/5 to-muted/5">
            <div className="flex flex-col items-center justify-center gap-6 p-6 text-center max-w-md">
                {/* Icon */}
                <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse" />
                    <div className="relative w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-4xl shadow-lg">
                        {icon || <Zap className="w-12 h-12" />}
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        {title}
                    </h1>
                    <p className="text-muted-foreground text-base leading-relaxed">
                        {description}
                    </p>
                </div>

                {/* Loading animation */}
                <div className="flex gap-2 items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0s" }} />
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.1s" }} />
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.2s" }} />
                </div>

                {/* Button */}
                <Button
                    onClick={() => navigate(-1)}
                    variant="outline"
                    className="gap-2 mt-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Quay lại
                </Button>

                {/* Decorative elements */}
                <div className="grid grid-cols-3 gap-2 mt-8 w-full">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="h-12 bg-card border border-border/50 rounded-lg animate-pulse"
                            style={{
                                animationDelay: `${i * 0.1}s`,
                                opacity: 0.5 + i * 0.1,
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
