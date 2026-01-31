import LoginForm from "@/components/account/login-form";

export const metadata = {
  title: "ورود به حساب کاربری | فروشگاه گیفت کارت",
  description:
    "وارد حساب کاربری خود شوید تا به تاریخچه سفارشات و کدهای خریداری شده دسترسی پیدا کنید.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <LoginForm />
    </div>
  );
}
