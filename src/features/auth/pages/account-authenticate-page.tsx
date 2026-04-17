import { useState, useRef, useEffect, useCallback } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, XCircle, Loader2, RefreshCw, ShieldCheck } from "lucide-react"
import { authService } from "@/services/account-service"

const CODE_LENGTH = 6
const RESEND_COOLDOWN = 60 // seconds

export default function PinCodePage() {
  const location = useLocation()
  const navigate = useNavigate()

  // Passed from the register form via navigate("/authenticate", { state: { accountId, email } })
  const { accountId, email } = (location.state ?? {}) as { accountId?: string; email?: string }

  const [digits, setDigits]         = useState<string[]>(Array(CODE_LENGTH).fill(""))
  const [loading, setLoading]       = useState(false)
  const [success, setSuccess]       = useState(false)
  const [error, setError]           = useState("")
  const [resending, setResending]   = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const [cooldown, setCooldown]     = useState(0)

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Focus first input on mount
  useEffect(() => { inputRefs.current[0]?.focus() }, [])

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setTimeout(() => setCooldown(c => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [cooldown])

  const focusNext = (index: number) => inputRefs.current[Math.min(index + 1, CODE_LENGTH - 1)]?.focus()
  const focusPrev = (index: number) => inputRefs.current[Math.max(index - 1, 0)]?.focus()

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      const pasted = value.slice(0, CODE_LENGTH)
      const next = [...digits]
      pasted.split("").forEach((ch, i) => { if (index + i < CODE_LENGTH) next[index + i] = ch })
      setDigits(next)
      inputRefs.current[Math.min(index + pasted.length, CODE_LENGTH - 1)]?.focus()
      setError("")
      return
    }
    const next = [...digits]
    next[index] = value
    setDigits(next)
    setError("")
    if (value) focusNext(index)
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace") {
      if (digits[index]) {
        const next = [...digits]; next[index] = ""; setDigits(next)
      } else {
        focusPrev(index)
      }
    } else if (e.key === "ArrowLeft")  { e.preventDefault(); focusPrev(index) }
      else if (e.key === "ArrowRight") { e.preventDefault(); focusNext(index) }
  }

  const handleVerify = useCallback(async () => {
    const code = digits.join("")
    if (code.length < CODE_LENGTH) { setError("Please enter all 6 digits."); return }
    if (!accountId) { setError("Account ID is missing. Please register again."); return }

    setLoading(true)
    setError("")
    try {
      await authService.authenticate(accountId, { code })
      setSuccess(true)
      // Redirect to login after a short delay so the user sees the success state
      setTimeout(() => navigate("/login"), 2000)
    } catch (err: any) {
      const message =
        err?.response?.data?.message ??
        err?.message ??
        "Verification failed. Please try again."
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [digits, accountId, navigate])

  // Auto submit when all filled
  useEffect(() => {
    if (digits.every(d => d !== "") && !success && !loading) handleVerify()
  }, [digits])

  const handleResend = async () => {
    if (cooldown > 0 || resending || !accountId) return
    setResending(true)
    setResendSuccess(false)
    setError("")
    setDigits(Array(CODE_LENGTH).fill(""))
    inputRefs.current[0]?.focus()
    try {
      await authService.renewCode(accountId)
      setResendSuccess(true)
      setCooldown(RESEND_COOLDOWN)
      setTimeout(() => setResendSuccess(false), 4000)
    } catch (err: any) {
      const message =
        err?.response?.data?.message ??
        err?.message ??
        "Failed to resend code. Please try again."
      setError(message)
    } finally {
      setResending(false)
    }
  }

  const isComplete = digits.every(d => d !== "")

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 transition-colors duration-500 ${
            success ? "bg-green-500" : "bg-primary"
          }`}>
            <ShieldCheck size={26} className="text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            {success ? "Verified!" : "Check your email"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
            {success
              ? "Your account has been successfully verified."
              : email
              ? `We sent a 6-digit code to ${email}. Enter it below to verify your account.`
              : "We sent a 6-digit code to your email. Enter it below to verify your account."
            }
          </p>
            <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">Check your email spam folders.</p>
        </div>

        {/* Success alert */}
        {success && (
          <Alert className="mb-5 border-green-500/40 bg-green-500/10">
            <CheckCircle2 size={15} className="text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-700 dark:text-green-300 text-sm">
              Account verified! Redirecting you to login...
            </AlertDescription>
          </Alert>
        )}

        {/* Resend success alert */}
        {resendSuccess && !success && (
          <Alert className="mb-5 border-blue-500/40 bg-blue-500/10">
            <CheckCircle2 size={15} className="text-blue-600 dark:text-blue-400" />
            <AlertDescription className="text-blue-700 dark:text-blue-300 text-sm">
              A new code has been sent to your email.
            </AlertDescription>
          </Alert>
        )}

        {/* Error alert */}
        {error && (
          <Alert className="mb-5 border-destructive/40 bg-destructive/10">
            <XCircle size={15} className="text-destructive" />
            <AlertDescription className="text-destructive text-sm">{error}</AlertDescription>
          </Alert>
        )}

        {/* Card */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">

          {/* PIN inputs */}
          <div className="flex items-center justify-center gap-2.5">
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={el => { inputRefs.current[i] = el }}
                type="text"
                inputMode="text"
                maxLength={6}
                value={digit}
                onChange={e => handleChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                onFocus={e => e.target.select()}
                disabled={loading || success}
                className={`
                  w-11 h-14 text-center text-xl font-bold rounded-xl border-2 bg-background
                  text-foreground outline-none transition-all duration-150
                  focus:border-primary focus:ring-2 focus:ring-primary/20
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${error ? "border-destructive/60 bg-destructive/5" : digit ? "border-primary/60 bg-primary/5" : "border-border"}
                  ${success ? "border-green-500/60 bg-green-500/5" : ""}
                `}
              />
            ))}
          </div>

          {/* Loading indicator */}
          {loading && (
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Loader2 size={13} className="animate-spin" />
              Verifying code...
            </div>
          )}

          {/* Verify button */}
          {!success && (
            <Button
              className="w-full"
              onClick={handleVerify}
              disabled={loading || !isComplete}
            >
              {loading
                ? <><Loader2 size={15} className="animate-spin" /> Verifying...</>
                : "Verify Code"
              }
            </Button>
          )}

          {/* Resend */}
          {!success && (
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1.5">Didn't receive the code?</p>
              <button
                onClick={handleResend}
                disabled={cooldown > 0 || resending || success}
                className={`inline-flex items-center gap-1.5 text-xs font-medium transition-colors ${
                  cooldown > 0 || resending
                    ? "text-muted-foreground cursor-not-allowed"
                    : "text-primary hover:underline cursor-pointer"
                }`}
              >
                {resending
                  ? <><Loader2 size={12} className="animate-spin" /> Sending...</>
                  : cooldown > 0
                  ? <><RefreshCw size={12} /> Resend in {cooldown}s</>
                  : <><RefreshCw size={12} /> Resend code</>
                }
              </button>
            </div>
          )}

        </div>

        {/* Back link */}
        {!success && (
          <p className="text-center text-xs text-muted-foreground mt-5">
            Wrong account?{" "}
            <button
              className="text-primary hover:underline font-medium"
              onClick={() => navigate("/register")}
            >
              Go back
            </button>
          </p>
        )}
      </div>
    </div>
  )
}
