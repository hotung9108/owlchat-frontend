import { AlertTriangleIcon } from "lucide-react"
import { CustomAlert } from "./custom-alert"
export function AlertColors() {
  return (
    <CustomAlert
          icon={AlertTriangleIcon}
          title="Your subscription will expire in 3 days."
          description="Renew now to avoid service interruption or upgrade to a paid plan to continue using the service."
          className="border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50" show={false}    />
  )
}