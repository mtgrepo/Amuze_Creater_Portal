import React from "react";
import { 
  Wallet, 
  CreditCard, 
  User, 
  Banknote,
  Percent,
  Fingerprint
} from "lucide-react";
import type { LoginCreatorResponse } from "@/types/response/auth/loginCreatorResponse";

interface ProfileWalletProps {
  data?: Partial<LoginCreatorResponse>;
}

export default function ProfileWalletComponent({ data }: ProfileWalletProps) {
  if (!data) return <div className="p-8 text-center text-slate-500">No financial data available.</div>;

  return (
    <div className=" space-y-12 w-full">
      {/* FINANCIAL OVERVIEW */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <div className="h-1 w-1 bg-blue-600 rounded-full" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">Financial Summary</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-card shadow-sm">
          
          {/* Balance Tile */}
          <div className="p-8 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 text-slate-500 mb-4">
              <Wallet className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase">Net Balance</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-light tracking-tight text-slate-900 dark:text-white">
                {data.wallets?.balance?.toLocaleString() || "0.00"}
              </span>
              <span className="text-sm font-medium text-slate-400">MMK</span>
            </div>
          </div>

          {/* Account Info Tile */}
          <div className="p-8 md:col-span-2 bg-slate-50/50 dark:bg-slate-900/20">
            <div className="flex items-center gap-2 text-slate-500 mb-4">
              <Banknote className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase">Payout Destination</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-12">
              <DataPoint 
                label="Provider" 
                value={data.payment_info?.payment_type?.name} 
                icon={<CreditCard className="w-3.5 h-3.5" />} 
              />
              <DataPoint 
                label="Account Holder" 
                value={data.payment_info?.account_holder_name} 
                icon={<User className="w-3.5 h-3.5" />} 
              />
              <DataPoint 
                label="Account Number" 
                value={data.payment_info?.account_no} 
                icon={<Fingerprint className="w-3.5 h-3.5" />} 
              />
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-6">
          <div className="h-1 w-1 bg-emerald-500 rounded-full" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">Revenue Structure</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.profit_percents && data.profit_percents.length > 0 ? (
            data.profit_percents.map((item) => (
              <div 
                key={item.id} 
                className="group p-6 bg-card border border-slate-200 dark:border-slate-800 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                    <Percent className="w-4 h-4 text-slate-600 dark:text-slate-400 group-hover:text-blue-600" />
                  </div>
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">
                    {item.percentage}%
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Category ID</p>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">#{item.sub_category_id}</p>
                </div>
                {/* Visual indicator bar */}
                <div className="mt-4 w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-slate-300 dark:bg-slate-600 group-hover:bg-blue-500 transition-all" 
                    style={{ width: `${item.percentage}%` }} 
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center border border-dashed border-slate-300 dark:border-slate-700 rounded-xl">
              <p className="text-slate-500 text-sm">No revenue sharing configurations found.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function DataPoint({ label, value, icon }: { label: string; value?: string | number; icon: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
        {icon}
        {label}
      </div>
      <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
        {value || "—"}
      </p>
    </div>
  );
}