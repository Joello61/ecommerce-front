import { useToasts, useUIStore } from "@/store"
import { ToastContainer } from "./ui/Toast"

export function ToastManager() {
  const toasts = useToasts()
  const { removeToast } = useUIStore()
  
  return <ToastContainer toasts={toasts} removeToast={removeToast} />
}