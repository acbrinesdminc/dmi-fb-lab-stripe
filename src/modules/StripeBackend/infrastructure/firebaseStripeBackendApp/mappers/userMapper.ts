import { User as FirebaseUser } from "firebase/auth";
import { AuthUser } from "../../../domain/models/output/AuthUser";

export const userMapper = async (user: FirebaseUser): Promise<AuthUser> => {
  const tokenData = await user.getIdTokenResult();

  return {
    uid: user.uid,
    name: user.displayName || "",
    email: user.email || "",
    emailVerified: user.emailVerified,
    isAnonymous: user.isAnonymous,
    photoURL: user.photoURL || "",
    token: tokenData.token,
    bearerToken: `Bearer ${tokenData.token}`,
    expirationTime: tokenData.expirationTime,
    reload: user.reload,
  };
};
