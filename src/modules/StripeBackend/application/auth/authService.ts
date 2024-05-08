import { AuthRepository } from "../../domain/repositories/AuthRepository";

export const singIn = (repository: AuthRepository) => repository.singIn();
export const singOut = (repository: AuthRepository) => repository.singOut();
