import { AuthUser } from "../models/output/AuthUser";

export interface AuthRepository {
  singIn: () => Promise<AuthUser | null>;
  singOut: () => Promise<Boolean>;
}
