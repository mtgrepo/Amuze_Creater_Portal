"use client";

import { useState, useMemo, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  LoginCreatorResponse,
  ProfileHistory,
} from "@/types/response/auth/loginCreatorResponse";
import {  Mail, Phone, Tag, Lock, Calendar } from "lucide-react";
import ProfileInfoComponent from "./profile_info_component";
import ProfileWalletComponent from "./income_component";
import ProfileHistoryComponent from "./profile_history_component";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import PasswordForm from "./profile_security_component";
import ImageUpload from "../common/image_upload";
import { toast } from "sonner";
import { useProfileUpdateCommand } from "@/composable/Command/auth/useProfileUpdateCommand";
import { decryptAuthData } from "@/lib/helper";
import { useSendOtpCommand } from "@/composable/Command/auth/useSendOTPCommand";
import { Input } from "../ui/input";
import ResetPasswordForm from "../reset-password-form";
import { useNavigate } from "react-router-dom";

export interface CreatorDetailsProps {
  info: LoginCreatorResponse;
  profile: ProfileHistory[];
  transaction?: any[];
}

export default function ProfileDetailsComponent({
  info,
  profile,
}: CreatorDetailsProps) {
  const { profileUpdateMutation, isPending } = useProfileUpdateCommand();
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [count, setCount] = useState(60);
  const canResend = count === 0;
  const navigate = useNavigate();

  const creatorId = useMemo(() => {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem("creator");
      if (data) {
        const decrypted = decryptAuthData(data);
        return decrypted?.creator?.id;
      }
    }
    return null;
  }, []);

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);

  const [profileImage, setProfileImage] = useState<File | string | null>(
    info?.profile || null,
  );

  const [prevInfoProfile, setPrevInfoProfile] = useState(info?.profile);
  if (info?.profile !== prevInfoProfile) {
    setProfileImage(info.profile);
    setPrevInfoProfile(info.profile);
  }

  const handleUpdateProfile = async (file: File) => {
    if (!file || !creatorId) {
      toast.error("Creator ID not found. Please log in again.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("profile", file);
      await profileUpdateMutation({ id: creatorId, data: formData });
    } catch (error) {
      toast.error((error as string) || "Failed to update profile");
    }
  };

  const { sendOtpMutation } = useSendOtpCommand();

  const handleSendOTP = async (isResend = false) => {
    if (!info.phone_no) {
      toast.error("Phone number not found");
      return;
    }
    try {
      setIsSendingOtp(true);
      await sendOtpMutation({
        phoneOrEmail: info.phone_no,
        isRegister: false,
        otp_type: "phone",
      });
      toast.success(isResend ? "OTP resent successfully" : "OTP sent successfully");
      setOtp("");
      setOtpSent(true);
      setCount(60);
    } finally {
      setIsSendingOtp(false);
    }
  }

  const handleVerifyOTP = () => {
    if (!otp) {
      toast.error("Please enter OTP");
      return;
    }
    setIsResetPasswordModalOpen(true);
  }

  useEffect(() => {
    if (!otpSent) return;
    if (count <= 0) return;

    const timer = setTimeout(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [count, otpSent]);

  //  useEffect(() => {
  //   if (count === 0) {
  //     return;
  //   }

  //   const timer = setTimeout(() => {
  //     setCount((prev) => prev - 1);
  //   }, 1000);

  //   return () => clearTimeout(timer);
  // }, [count]);


  return (
    <div className="">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header Profile Card */}
        <div className="bg-card border border-slate-300 dark:border-[#252525] rounded-md p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative">
              <ImageUpload
                size="large"
                value={profileImage}
                onChange={(file) => {
                  if (isPending) return;

                  if (file) {
                    setProfileImage(file);
                    handleUpdateProfile(file);
                  } else {
                    setProfileImage(null);
                  }
                }}
              />

              {isPending && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-md">
                  <p className="text-white text-sm font-medium animate-pulse">
                    Uploading...
                  </p>
                </div>
              )}
            </div>
            <div className="flex-1  text-center md:text-left">
              <div className="flex flex-row gap-3 my-3">
                <h1 className="text-3xl font-bold">{info?.name}</h1>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                    <Tag className="w-4 h-4" />
                    <span className="text-sm font-semibold">
                      {info?.role?.name || "Standard User"}
                    </span>
                  </div>
                  {/* <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-semibold">
                      Joined{" "}
                      {info?.acount?.created_at
                        ? new Date(info.acount.created_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )
                        : "N/A"}
                    </span>
                  </div> */}
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4  text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{info?.email}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">{info?.phone_no}</span>
                </div>
              </div>

              <div className="mt-8 relative">
                <div className="absolute -top-3 left-4 px-2 bg-white dark:bg-[#1a1a1a] text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Biography
                </div>
                <div className="p-5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 italic text-slate-600 dark:text-slate-300 leading-relaxed">
                  {info?.bio || "This user hasn't written a bio yet..."}
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-semibold">
                    Joined{" "}
                    {info?.acount?.created_at
                      ? new Date(info.acount.created_at).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Tabs defaultValue="info">
          <TabsList className="w-full grid grid-cols-4" variant={"line"}>
            <TabsTrigger value="info">General Info</TabsTrigger>
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="mt-6">
            <ProfileInfoComponent account={info?.acount} data={info} />
          </TabsContent>

          <TabsContent value="wallet" className="mt-6">
            <ProfileWalletComponent data={info?.acount} />
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <ProfileHistoryComponent history={profile} />
          </TabsContent>

          <TabsContent value="security" className="mt-6">
            <div className="bg-card border border-slate-300 dark:border-[#252525] rounded-md p-6">
              <div className="flex items-center gap-2 mb-6">
                <Lock className="w-5 h-5 text-slate-500" />
                <h3 className="text-lg font-semibold">Account Security</h3>
              </div>

              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-[#252525] pb-6">
                  <div>
                    <p className="font-medium">Change Password</p>
                    <p className="text-sm text-slate-500">
                      Update your account password regularly.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() => setIsPasswordModalOpen(true)}
                  >
                    Update Password
                  </Button>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">Password Recovery</p>
                    <p className="text-sm text-slate-500">
                      {`${otpSent ? "OTP code has been sent to" : "Send an OTP code to"} ${info?.phone_no}.`}
                    </p>
                  </div>
                  <div>
                    {!otpSent ? (
                      <Button
                        variant="ghost"
                        className="cursor-pointer text-primary"
                        onClick={() => handleSendOTP(false)}
                        disabled={isSendingOtp}
                      >
                        {isSendingOtp ? "Sending..." : "Send code"}
                      </Button>
                    ) : (
                      <div className="space-y-3">
                        <Input
                          placeholder="Enter OTP"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                        />
                        <div className="flex gap-2">
                          <Button onClick={handleVerifyOTP}>
                            Verify OTP
                          </Button>
                          <Button
                            type="button"
                            variant="link"
                            onClick={() => handleSendOTP(true)}
                            disabled={!canResend}
                          >
                            {canResend ? "Resend" : `Resend in ${count}s`}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Password Update Modal */}
        <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
          <DialogContent >
            <DialogHeader className="border-b dark:border-[#252525] pb-4">
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <Lock className="w-6 h-6 text-blue-500" />
                Security Update
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-500 mt-1">
                Set a strong password to protect your account.
              </DialogDescription>
            </DialogHeader>
            <PasswordForm
              onSuccess={() => setIsPasswordModalOpen(false)}
              onCancel={() => setIsPasswordModalOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {/* reset password modal */}
        <Dialog open={isResetPasswordModalOpen} onOpenChange={setIsResetPasswordModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Reset Password</DialogTitle>
              <DialogDescription>
                Set a new password for your account.
              </DialogDescription>
            </DialogHeader>
            <ResetPasswordForm
              identifier={info.phone_no}
              otp={otp}
              onSuccess={(type) => {
                if (type === "success") {
                  setIsResetPasswordModalOpen(false)
                  navigate("/")
                }

                if (type === "otp_error") {
                  setIsResetPasswordModalOpen(false);
                  setIsResetPasswordModalOpen(true);
                }

              }
              }
            />
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}
