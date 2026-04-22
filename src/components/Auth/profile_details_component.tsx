"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  LoginCreatorResponse,
  ProfileHistory,
} from "@/types/response/auth/loginCreatorResponse";
import { Calendar, Mail, Phone, Tag, Lock } from "lucide-react";
import ProfileInfoComponent from "./profile_info_component";
import ProfileWalletComponent from "./income_component";
import ProfileHistoryComponent from "./profile_history_component";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import PasswordForm from "./profile_security_component";
import ImageUpload from "../common/image_upload";
import { toast } from "sonner";
import { useProfileUpdateCommand } from "@/composable/Command/auth/useProfileUpdateCommand";
import { decryptAuthData } from "@/lib/helper";

export interface CreatorDetailsProps {
  info: LoginCreatorResponse;
  profile: ProfileHistory[];
  transaction?: any[];
}

export default function ProfileDetailsComponent({
  info,
  profile,
}: CreatorDetailsProps) {
  const loginCreator = decryptAuthData(localStorage.getItem("creator")!);
  if(!loginCreator?.creator?.id){
    throw new Error("Creator ID is missing");
  }
  const id = loginCreator?.creator?.id;

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  // const [isUploading, setIsUploading] = useState(false);
  const { profileUpdateMutation, isPending } = useProfileUpdateCommand();
  const handleUpdateProfile = async (file: File) => {
    if (!file || !id) return;
    try {
      console.log(file);
      const formData = new FormData();
      formData.append("profile", file);
      await profileUpdateMutation({ id, data: formData });
    } catch (error) {
      toast.error((error as string) || "Failed to update profile");
    }
  };

  return (
    <div className="w-full max-w-7xl">
      {/* Header Profile Card */}
      <div className="bg-white dark:bg-[#17171A] border border-slate-300 dark:border-[#252525] rounded-md p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="relative">
            <ImageUpload
              size="large"
              value={info?.profile}
              onChange={(file) => {
                if (file && !isPending) handleUpdateProfile(file);
              }}
            />

            {isPending && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-md">
                <p className="text-white text-sm">Uploading...</p>
              </div>
            )}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold">{info?.name}</h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-2 text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{info?.email}</span>
              </div>
              <div className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                <span className="text-sm">{info?.phone_no}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                <Tag className="w-4 h-4" />
                <span className="text-sm font-semibold">
                  {info?.role?.name || "Standard User"}
                </span>
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
          <ProfileInfoComponent account={info?.acount} />
        </TabsContent>

        <TabsContent value="wallet" className="mt-6">
          <ProfileWalletComponent data={info?.acount} />
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <ProfileHistoryComponent history={profile} />
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <div className="bg-white dark:bg-[#17171A] border border-slate-300 dark:border-[#252525] rounded-md p-6">
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
                  onClick={() => setIsPasswordModalOpen(true)}
                >
                  Update Password
                </Button>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <p className="font-medium">Password Recovery</p>
                  <p className="text-sm text-slate-500">
                    Send a reset link to {info?.email}.
                  </p>
                </div>
                <Button
                  variant="ghost"
                  className="text-blue-500 hover:text-blue-600"
                >
                  Send Reset Link
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Password Update Modal */}
      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <DialogContent className="max-w-2xl p-0 border-none bg-transparent">
          <PasswordForm
            onSuccess={() => setIsPasswordModalOpen(false)}
            onCancel={() => setIsPasswordModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
