import { AlertCircleIcon } from "lucide-react"
import { CustomAlert } from "../custom-alert"
export function AlertDestructive() {
  return (
    <CustomAlert
          variant="destructive"
          icon={AlertCircleIcon}
          title="Payment failed"
          description="Your payment could not be processed. Please check your payment method and try again." show={false}    />
  )
}