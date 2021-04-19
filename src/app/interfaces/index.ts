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
  user: string;
  password: string;
	codigocelular?: string;
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

export interface Warehouse {
  id_warehouse: string; 
  descripcion: string;
  status: string;
}
