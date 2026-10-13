export type UserRole = "ADMIN" | "USUARIO";

export const bolivianDepartments = [
  "Chuquisaca", "La Paz", "Cochabamba", "Oruro", "Potosí",
  "Tarija", "Santa Cruz", "Beni", "Pando",
] as const;

export interface User {
  id: string;
  name: string;
  carnet: string;
  role: UserRole;
  department?: string;
  city?: string;
}

export interface UserRecord extends User {
  password: string;
}

export interface LoginCredentials {
  carnet: string;
  password: string;
}
