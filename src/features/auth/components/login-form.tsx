import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import owlLogo512 from "@/assets/owl-logo/black/owl-512.png";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../../hooks/use-auth";
import { CheckCircle2Icon, AlertCircleIcon } from "lucide-react";
import { CustomAlert } from "@/components/shared/alert/custom-alert";
import { useUserProfileContext } from "@/providers/user-profile-provider";
import { useWebSocket } from "@/providers/websocket-provider";

export interface LoginFormProps extends React.ComponentProps<"div"> {
    navigateUrl?: string;
    title?: string;
    description?: string;
}

export function LoginForm({
    className,
    navigateUrl = "/conversations",
    title = "Welcome back",
    description = "Login to your OwlChat account",
    ...props
}: LoginFormProps) {
    const navigate = useNavigate();
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertType, setAlertType] = useState<"success" | "error" | null>(
        null,
    );
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { login } = useAuth();
    const { remount: remountProfile } = useUserProfileContext();
    const { remount: remountSocket } = useWebSocket();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await login({ username, password });
            setAlertMessage("Login successful! Redirecting...");
            setAlertType("success");
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
                
                // Force providers to remount to pick up the new token
                remountProfile();
                remountSocket();

                // Redirect based on role from response
                if (response.role === "ADMIN") {
                    navigate("/admin");
                } else if (response.role === "USER" || response.role === "BUSINESS") {
                    navigate("/conversations");
                } else {
                    navigate(navigateUrl);
                }
            }, 2000);
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.message ||
                "Invalid email or password. Please try again.";
            setAlertMessage(errorMessage);
            setAlertType("error");
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
                setIsLoading(false);
            }, 2000);
        }
    };
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <div className="bg-muted relative hidden md:flex items-center justify-center">
                        <div style={{ filter: `var(--logo-filter, invert(0.8) sepia(0.5) saturate(1.5))` }}>
                            <img
                                src={owlLogo512}
                                alt="OwlChat Logo"
                                className="h-32 w-32"
                            />
                        </div>
                    </div>
                    <form className="p-6 md:p-8">
                        <FieldGroup>
                            <div className="flex flex-col items-center gap-2 text-center">
                                <h1 className="text-2xl font-bold">
                                    {title}
                                </h1>
                                <p className="text-muted-foreground text-balance">
                                    {description}
                                </p>
                            </div>
                            <Field>
                                <FieldLabel htmlFor="email">
                                    Username
                                </FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                />
                            </Field>
                            <Field>
                                <div className="flex items-center">
                                    <FieldLabel htmlFor="password">
                                        Password
                                    </FieldLabel>
                                    <a
                                        href="#"
                                        className="ml-auto text-sm underline-offset-2 hover:underline"
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                            </Field>
                            <Field>
                                <Button 
                                    type="submit" 
                                    onClick={handleLogin}
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Logging in..." : "Login"}
                                </Button>
                            </Field>
                            <FieldDescription className="text-center">
                                Don&apos;t have an account?{" "}
                                <Link
                                    to="/register"
                                    className="text-blue-500 hover:underline"
                                >
                                    Sign up
                                </Link>
                            </FieldDescription>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
            <FieldDescription className="px-6 text-center">
                By clicking continue, you agree to our{" "}
                <a href="#">Terms of Service</a> and{" "}
                <a href="#">Privacy Policy</a>.
            </FieldDescription>
            {alertMessage && (
                <CustomAlert
                    variant={
                        alertType === "success" ? "default" : "destructive"
                    }
                    icon={
                        alertType === "success"
                            ? CheckCircle2Icon
                            : AlertCircleIcon
                    }
                    title={alertType === "success" ? "Success" : "Error"}
                    description={alertMessage}
                    show={showAlert}
                />
            )}
        </div>
    );
}
