import { API } from "./api";
import { getLocalStorage } from "./localStorage";

export const getPermissions = (role: string = "ADMIN"): string[] => {
  const type_user = getLocalStorage(API.TYPE_USER);
  //return ['AUDITOR'];
  if (type_user)
    return [type_user]
  return [role];
};
