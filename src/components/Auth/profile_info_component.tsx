import React from "react";
import {
  Building2,
  Calendar,
  CaseUpper,
  CheckCircle,
  CreditCard,
  GraduationCap,
  HomeIcon,
  Mail,
  Phone,
  UserPen,
} from "lucide-react";
import { Separator } from "@/components/ui/separator"; // Ensure correct path
import type { LoginCreatorResponse } from "@/types/response/auth/loginCreatorResponse";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import ProfileInfoUpdateForm from "./ProfileUpdate/profile_update_form";
interface ProfileInfoProps {
  account?: LoginCreatorResponse["acount"];
  data?: LoginCreatorResponse;
}

type InfoProps = {
  label: string;
  value: string | number | undefined | null;
  icon?: React.ReactNode;
  className?: string;
};

type CardProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

export default function ProfileInfoComponent({ account, data }: ProfileInfoProps) {
    const [open, setOpen] = React.useState(false);

  if (!account) {
    return (
      <div className="p-8 text-center text-slate-500">
        No account information available.
      </div>
    );
  }


  return (
    <>
      <div className="flex items-center justify-end mb-3">
        <Button variant="outline" className="cursor-pointer" onClick={() => setOpen(true)}>
          <UserPen />
          Edit Profile
        </Button>
      </div>

      <div className="flex flex-1 flex-col gap-4">
        <div className="w-full">
          <div className="grid grid-cols-1 gap-6">
            {/* Contact Details Card */}
            <Card title="Contact Details">
              <Info
                label="Name"
                value={account.name}
                icon={<CaseUpper className="w-4 h-4" />}
              />
              <Info
                label="Email"
                value={data?.email || account.email}
                icon={<Mail className="w-4 h-4" />}
              />
              <Info
                label="Phone Number"
                value={account.phone_no}
                icon={<Phone className="w-4 h-4" />}
              />
              <Info 
                label="Date of Birth"
                value={
                  data?.dob
                    ? new Date(data.dob).toLocaleDateString()
                    : "N/A"
                }
                icon={<Calendar className="w-4 h-4" />}
              />
              <Info
                label="Job Role"
                value={account.job}
                icon={<Building2 className="w-4 h-4" />}
              />
            </Card>

            {/* Address Information Card */}
            <Card title="Address Information">
              <Info
                label="Address"
                value={account.address}
                icon={<HomeIcon className="w-4 h-4" />}
              />
              <Info
                label="Education"
                value={account.education}
                icon={<GraduationCap className="w-4 h-4" />}
              />
              <Info
                label="Bio"
                value={data?.bio || account?.bio || "N/A"}
                icon={<CaseUpper className="w-4 h-4" />}
              />
            </Card>

            {/* Identification Card */}
            <Card
              title="Identification & Verification"
              className="md:col-span-2"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6">
                <Info
                  label="NRC Number"
                  value={account.nrc}
                  icon={<CreditCard className="w-4 h-4" />}
                />
                <Info
                  label="Verification Status"
                  value={account.confirm_status}
                  icon={<CheckCircle className="w-4 h-4" />}
                  className={`${account.confirm_status ? "text-green-500" : "text-red-500"}`}
                />
                <Info
                  label="Member Since"
                  value={
                    account.created_at
                      ? new Date(account.created_at).toLocaleDateString()
                      : "N/A"
                  }
                  icon={<Calendar className="w-4 h-4" />}
                />
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogTitle className="flex items-center gap-2 mb-6">
            <UserPen className="w-5 h-5 text-slate-500" />
            <p className="text-lg font-semibold">Update Profile Information</p>
          </DialogTitle>
          <ProfileInfoUpdateForm data={data} open={open} onOpenChange={setOpen}/>
          </DialogContent>
      </Dialog>
    </>
  );
}

function Card({ title, children, className = "" }: CardProps) {
  return (
    <div
      className={`bg-card border border-slate-200 dark:border-slate-800 rounded-md p-5 ${className}`}
    >
      <h3 className="text-base font-bold mb-3">{title}</h3>
      <Separator className="mb-3" />
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Info({ label, value, icon, className }: InfoProps) {
  return (
    <div className="flex items-start gap-3 text-sm py-2">
      {icon && (
        <div className="mt-1 text-slate-500 dark:text-slate-400 shrink-0">
          {icon}
        </div>
      )}

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[140px_1fr] gap-1 lg:gap-4 items-baseline">
        <span className="font-semibold text-slate-700 dark:text-slate-300 leading-tight">
          {label}:
        </span>

        <span className={`${className} wrap-break-word min-w-0`}>
          {value || (
            <span className="text-slate-400 dark:text-slate-500 italic">
              Not provided
            </span>
          )}
        </span>
      </div>
    </div>
  );
}
