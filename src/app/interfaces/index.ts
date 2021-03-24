export interface User {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password?:string;
  status?: boolean;
}

export interface SigninData {
  username: string;
	code?: string;
}

export interface APIMessage {
  text: string;
  status?: number;
  type?: string;
}

export interface VerifyCodeResponse {
	logIn: boolean;
	token: string;
}