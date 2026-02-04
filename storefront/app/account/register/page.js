import RegisterForm from "@/components/account/register-form";

export const metadata = {
  title: "ثبت نام - فروشگاه نکست لایسنس",
  description:
    "ایجاد حساب کاربری جهت خرید آنی گیفت کارت گوگل پلی، اپل و پرداخت‌های ارزی.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8 relative">
      <RegisterForm />
    </div>
  );
}
