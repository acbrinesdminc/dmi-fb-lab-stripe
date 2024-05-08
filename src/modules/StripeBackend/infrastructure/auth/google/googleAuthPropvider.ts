import {
  GoogleAuthProvider as AuthProvider,
  getAuth,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { AuthRepository } from "../../../domain/repositories/AuthRepository";
import { userMapper } from "../../firebaseStripeBackendApp/mappers/userMapper";

const authProvider = new AuthProvider();
const auth = getAuth();

const singInPopup = async () => {
  try {
    const result = await signInWithPopup(auth, authProvider);
    const credential = AuthProvider.credentialFromResult(result);

    if (credential === null) {
      return null;
    }

    const user = userMapper(result.user);

    return await user;
  } catch (error) {
    // @ts-ignore
    return Promise.reject(error.message);
  }
};

const singOut = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    return false;
  }
};

export const createAuthRepository = (): AuthRepository => ({
  singIn: singInPopup,
  singOut,
});
