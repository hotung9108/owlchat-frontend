import { LoginForm } from "../components/login-form"

export default function AdminLoginPage() {
  return (
    <div className="bg-gradient-to-br from-indigo-900 via-primary to-background bg-opacity-80 flex min-h-screen flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <LoginForm
          navigateUrl="/admin"
          title="Admin Login"
          description="Login to access the OwlChat Admin Dashboard"
        />
      </div>
    </div>
  )
}
