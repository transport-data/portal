import { toast, ToastContent, ToastOptions } from "react-toastify";

export default function notify(
  text: ToastContent,
  severity: "success" | "error" = "success"
) {
  /*
   * Using this wrapper so that default options
   * can be set
   *
   */
  const options = {};

  switch (severity) {
    case "success":
      toast(text, options);
      break;
    case "error":
      toast.error(text, options);
      break;
  }
}
