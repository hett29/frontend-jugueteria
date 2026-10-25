
import type {
  DistributorApplication,
  DistributorApplicationStatus,
} from "../types/distributor";

const STORAGE_KEY = "app_distributor_applications";

function getApplications(): DistributorApplication[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) as DistributorApplication[] : [];
  } catch {
    return [];
  }
}

export const distributorRepository = {
  getAll(): DistributorApplication[] {
    return getApplications();
  },

  updateStatus(
    id: string,
    status: DistributorApplicationStatus
  ): boolean {
    const applications = getApplications();
    const index = applications.findIndex(
      (application) => application.id === id
    );

    if (index === -1) return false;

    applications[index] = {
      ...applications[index],
      status,
    };

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(applications)
    );

    return true;
  },
};
