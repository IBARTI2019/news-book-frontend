export const ADMIN = "ADMIN";
export const SUPERVISOR = "SUPERVISOR";
export const AUDITOR = "AUDITOR";
export const USER = "USER";
export const ID_CRYPT = "B_N_CRYPT";
export const PERMISSIONS = "B_N_P";
export const USER_TYPES = [
  {
    type: "SUPERVISOR",
    code: 1,
    info: "Usuario que puede crear y consultar información, este usuario puede tener 1 o más libros",
  },
  {
    type: "AUDITOR",
    code: 2,
    info: "Usuario que solo puede consultar los datos, este usuario puede tener 1 o más libros asignados",
  },
  {
    type: "USER",
    code: 3,
    info: "Usuario que puede crear y consultar información, este usuario puede tener máximo 1 libro",
  },
];
