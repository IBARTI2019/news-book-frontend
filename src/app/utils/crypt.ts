import * as CryptoJS from "crypto-js";
import { environment } from "../../environments/environment";

export const encryptUsingAES256 = (data: string) => {
  let encrypted = CryptoJS.AES.encrypt(data, environment.cryptPass);
  return encrypted.toString();
};

export const decryptUsingAES256 = (encrypt: string) => {
  const decrypted = CryptoJS.AES.decrypt(encrypt, environment.cryptPass).toString(CryptoJS.enc.Utf8);
  return decrypted;
};
