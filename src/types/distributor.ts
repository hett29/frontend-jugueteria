
export type DistributorApplicationStatus =
  | "PENDIENTE"
  | "APROBADA"
  | "RECHAZADA";

export interface DistributorApplication {
  id: string;
  businessName: string;
  representative: string;
  carnet: string;
  nit: string;
  phone: string;
  email: string;
  department: string;
  city: string;
  address: string;
  businessActivity: string;
  experience: string;
  cvName: string;
  cvData: string;
  status: DistributorApplicationStatus;
  createdAt: string;
}
