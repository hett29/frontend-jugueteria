
import initialUsers from "../data/users.json";
import { storageService } from "../services/storageService";
import { distributorRepository } from "./distributorRepository";
import type {
  LoginCredentials,
  User,
  UserRecord,
  UserRole,
} from "../types/auth";

const SESSION_KEY = "app_session";
const PROFILES_KEY = "app_user_profiles";
const REGISTERED_USERS_KEY = "app_registered_users";

const users = initialUsers as UserRecord[];

function getProfiles(): Record<string, Pick<User, "department" | "city">> {
  return (
    storageService.get<
      Record<string, Pick<User, "department" | "city">>
    >(PROFILES_KEY) ?? {}
  );
}

function getRegisteredUsers(): UserRecord[] {
  return storageService.get<UserRecord[]>(REGISTERED_USERS_KEY) ?? [];
}

function getAllRecords(): UserRecord[] {
  return [...users, ...getRegisteredUsers()];
}

function isDistributorApproved(carnet: string): boolean {
  return distributorRepository.getAll().some(
    (application) =>
      application.carnet.trim() === carnet.trim() &&
      application.status === "APROBADA"
  );
}

export const authRepository = {
  // Registro normal de usuarios
  register(data: {
    name: string;
    carnet: string;
    password: string;
  }): User | null {
    const name = data.name.trim();
    const carnet = data.carnet.trim();
    const password = data.password;

    if (!name || !carnet || !password.trim()) return null;

    const carnetExists = getAllRecords().some(
      (user) => user.carnet.trim() === carnet
    );

    if (carnetExists) return null;

    const newUser: UserRecord = {
      id: `user-${Date.now()}`,
      name,
      carnet,
      password,
      role: "USUARIO",
    };

    storageService.set<UserRecord[]>(
      REGISTERED_USERS_KEY,
      [...getRegisteredUsers(), newUser]
    );

    return {
      id: newUser.id,
      name: newUser.name,
      carnet: newUser.carnet,
      role: "USUARIO",
    };
  },

  // Registro de distribuidores con solicitud aprobada
  registerDistributor(data: {
    carnet: string;
    password: string;
  }): User | null {
    const carnet = data.carnet.trim();
    const password = data.password;

    if (!carnet || !password.trim()) return null;

    // Solo puede registrarse quien tenga la solicitud aprobada
    if (!isDistributorApproved(carnet)) return null;

    // Evita crear dos cuentas con el mismo carnet
    const carnetExists = getAllRecords().some(
      (user) => user.carnet.trim() === carnet
    );

    if (carnetExists) return null;

    const application = distributorRepository
      .getAll()
      .find(
        (item) =>
          item.carnet.trim() === carnet &&
          item.status === "APROBADA"
      );

    if (!application) return null;

    const newDistributor: UserRecord = {
      id: `distributor-${Date.now()}`,
      name: application.representative.trim(),
      carnet,
      password,
      role: "DISTRIBUIDOR",
    };

    storageService.set<UserRecord[]>(
      REGISTERED_USERS_KEY,
      [...getRegisteredUsers(), newDistributor]
    );

    return {
      id: newDistributor.id,
      name: newDistributor.name,
      carnet: newDistributor.carnet,
      role: "DISTRIBUIDOR",
    };
  },

  // Inicio de sesión de usuarios, administradores y distribuidores
  login(
    credentials: LoginCredentials,
    expectedRole: UserRole
  ): User | null {
    const carnet = credentials.carnet.trim();

    // Un distribuidor debe tener una solicitud aprobada
    if (
      expectedRole === "DISTRIBUIDOR" &&
      !isDistributorApproved(carnet)
    ) {
      return null;
    }

    const foundUser = getAllRecords().find(
      (user) =>
        user.carnet.trim() === carnet &&
        user.password === credentials.password &&
        user.role === expectedRole
    );

    if (!foundUser) return null;

    const profile = getProfiles()[foundUser.id] ?? {};

    const sessionUser: User = {
      id: foundUser.id,
      name: foundUser.name,
      carnet: foundUser.carnet,
      role: foundUser.role,
      department: profile.department,
      city: profile.city,
    };

    storageService.set<User>(SESSION_KEY, sessionUser);

    return sessionUser;
  },

  getCurrentUser(): User | null {
    return storageService.get<User>(SESSION_KEY);
  },

  getAllUsers(): User[] {
    const profiles = getProfiles();

    return getAllRecords().map((user) => ({
      id: user.id,
      name: user.name,
      carnet: user.carnet,
      role: user.role,
      ...(profiles[user.id] ?? {}),
    }));
  },

  updateProfile(
    userId: string,
    location: Pick<User, "department" | "city">
  ): User | null {
    const profiles = getProfiles();

    profiles[userId] = {
      department: location.department?.trim(),
      city: location.city?.trim(),
    };

    storageService.set(PROFILES_KEY, profiles);

    const current = this.getCurrentUser();

    if (current?.id === userId) {
      const updated = { ...current, ...profiles[userId] };
      storageService.set<User>(SESSION_KEY, updated);
      return updated;
    }

    return null;
  },

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  },

  logout(): void {
    storageService.remove(SESSION_KEY);
  },
};
