import { useNavigate, useSearchParams } from "react-router-dom";
import ResetPasswordForm from "./reset-password-form";

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <ResetPasswordForm
        identifier={params.get("identifier") || ""}
        otp={params.get("otp") || ""}
        showBackButton
        onSuccess={() => navigate("/creator-portal/login")}
      />

    </div>
  );
}