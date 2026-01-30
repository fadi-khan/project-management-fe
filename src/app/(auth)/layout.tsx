import { ToastProvider } from "@/components/toasts/ToastProvider";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ToastProvider />
      {children}
    </>
  );
}
