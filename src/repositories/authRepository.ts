import initialUsers from "../data/users.json";
import { storageService } from "../services/storageService";
import type { LoginCredentials, User, UserRecord, UserRole } from "../types/auth";

const SESSION_KEY = "app_session";
const PROFILES_KEY = "app_user_profiles";
const users = initialUsers as UserRecord[];

function getProfiles(): Record<string, Pick<User, "department" | "city">> {
  return storageService.get<Record<string, Pick<User, "department" | "city">>>(PROFILES_KEY) ?? {};
}

export const authRepository = {
  login(credentials: LoginCredentials, expectedRole: UserRole): User | null {
    const foundUser = users.find((user) =>
      user.carnet === credentials.carnet.trim() &&
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
    return users.map(({ password: _password, ...user }) => ({
      ...user,
      ...(profiles[user.id] ?? {}),
    }));
  },

  updateProfile(userId: string, location: Pick<User, "department" | "city">): User | null {
    const profiles = getProfiles();
    profiles[userId] = { department: location.department?.trim(), city: location.city?.trim() };
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
