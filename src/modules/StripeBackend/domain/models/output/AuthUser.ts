export type AuthUser = {
  uid: string;
  email: string;
  emailVerified: boolean;
  name: string;
  isAnonymous: boolean;
  photoURL: string;
  token: string;
  bearerToken: string;
  expirationTime: string;
  reload: () => Promise<void>;
};
