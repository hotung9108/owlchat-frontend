import { CheckCircle2Icon } from "lucide-react"
import { CustomAlert } from "./custom-alert"
export function AlertBasic() {
  return (
    <CustomAlert
          icon={CheckCircle2Icon}
          title="Account updated successfully"
          description="Your profile information has been saved. Changes will be reflected immediately." show={false}    />
  )
}