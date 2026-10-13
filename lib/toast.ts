import toast from "react-hot-toast";

type ToastType = "error" | "success";

export function toastOnce(type: ToastType, message: string) {
  return toast[type](message, { id: `${type}:${message}` });
}
