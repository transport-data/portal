import { useTheme } from "next-themes";
import { Theme, ToastContainer } from "react-toastify";

export default function NotificationContainer() {
  const { theme } = useTheme();

  return (
    <ToastContainer
      position="bottom-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      pauseOnHover
      theme={(theme as Theme) ?? "dark"}
    />
  );
}
