// helper.ts

export interface Role {
  id: number;
  name: string;
}

export interface CreatorDetails {
  id: number;
  uuid: string;
  name: string;
  email: string;
  avatar?: string;
  phone_no?: string;
  session: string;
  role_id: number;
  role: Role;
  permissions: string[]; // added to match API / Redux slice
}

export interface Token {
  access: string;
  refresh?: string;
}

export interface AuthData {
  isAuthenticated: boolean;
  creator: CreatorDetails | null;
  token: Token | null;
}

/**
 * Encrypt AuthData to string for localStorage
 */
export function encryptAuthData(data: AuthData): string {
  return btoa(JSON.stringify(data));
}

/**
 * Decrypt AuthData from localStorage string
 */
export function decryptAuthData(dataStr: string): AuthData | null {
  try {
    const data = JSON.parse(atob(dataStr));

    // Ensure permissions exists
    if (data.creator && !data.creator.permissions) {
      data.creator.permissions = [];
    }

    return data;
  } catch (error) {
    return null;
  }
}