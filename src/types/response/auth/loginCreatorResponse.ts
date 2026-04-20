export interface LoginCreatorResponse {
  id: number;
  uuid: string;
  name: string;
  profile: string;
  dob: Date;
  gender: string;
  email: string;
  phone_no: string;
  referral_code: string;
  role_id: number;
  created_at: Date;
  updated_at: Date;
  bio: string;
  is_active: boolean;
  role: {
    id: number;
    name: string;
    is_active: boolean;
  };
  wallets: {
    id: number;
    balance: number;
  };
  acount: {
    id: number;
    name: string;
    email: string;
    phone_no: string;
    address: string;
    payment_info_id: number;
    user_id: number;
    bio: string;
    nrc: string;
    nrc_front: string;
    nrc_back: string;
    education: string;
    job: string;
    confirm_status: number;
    created_at: Date;
    updated_at: Date;
    verified_at: Date;
    verified_by: number;
  };
  payment_info: {
    id: number;
    account_id: number;
    payment_type_id: number;
    account_no: string;
    account_holder_name: string;
    created_at: Date;
    updated_at: Date;
    payment_type: {
      id: number;
      name: string;
      is_active: boolean;
      created_at: Date;
      created_by: number;
      updated_at: Date;
      updated_by: number;
    };
  };
  profit_percents: {
    id: number;
    account_id: number;
    sub_category_id: number;
    percentage: number;
  }[];
  followercount: number;
}

export interface ProfileHistory {
  
    id: number;
    user_id: number;
    profile: string;
    created_at: Date;
 
}
