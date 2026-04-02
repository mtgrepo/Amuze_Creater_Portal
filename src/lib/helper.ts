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
  const jsonString = JSON.stringify(data);
  // Convert string to UTF-8 bytes
  const bytes = new TextEncoder().encode(jsonString);
  // Convert bytes to a binary string that btoa can handle
  const binaryString = String.fromCharCode(...bytes);
  return btoa(binaryString);
}

/**
 * Decrypt AuthData from localStorage string
 */
export function decryptAuthData(dataStr: string): AuthData | null {
  try {
    const binaryString = atob(dataStr);
    // Convert binary string back to bytes
    const bytes = Uint8Array.from(binaryString, (c) => c.charCodeAt(0));
    // Decode bytes back to UTF-8 string
    const jsonString = new TextDecoder().decode(bytes);
    
    const data = JSON.parse(jsonString);

    if (data.creator && !data.creator.permissions) {
      data.creator.permissions = [];
    }

    return data;
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
}