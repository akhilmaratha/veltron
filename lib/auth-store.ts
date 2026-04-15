import { createHash } from "node:crypto";

export type UserRole = "admin" | "customer";

export interface AuthUserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
}

const hashPassword = (password: string) =>
  createHash("sha256").update(password).digest("hex");

const nowId = () => `${Date.now()}-${Math.round(Math.random() * 1000)}`;

const demoAdminEmail = process.env.AUTH_DEMO_ADMIN_EMAIL ?? "admin@veltron.com";
const demoAdminPassword = process.env.AUTH_DEMO_ADMIN_PASSWORD ?? "Admin@123";

const users: AuthUserRecord[] = [
  {
    id: "seed-admin-1",
    name: "Veltron Admin",
    email: demoAdminEmail.toLowerCase(),
    passwordHash: hashPassword(demoAdminPassword),
    role: "admin",
  },
];

export function findUserByEmail(email: string): AuthUserRecord | undefined {
  return users.find((user) => user.email === email.toLowerCase());
}

export function verifyUser(email: string, password: string): AuthUserRecord | null {
  const user = findUserByEmail(email);

  if (!user) {
    return null;
  }

  const candidateHash = hashPassword(password);
  return candidateHash === user.passwordHash ? user : null;
}

export function registerUser(params: {
  name: string;
  email: string;
  password: string;
}): AuthUserRecord {
  const existing = findUserByEmail(params.email);

  if (existing) {
    throw new Error("Email is already registered.");
  }

  const nextUser: AuthUserRecord = {
    id: nowId(),
    name: params.name,
    email: params.email.toLowerCase(),
    passwordHash: hashPassword(params.password),
    role: "customer",
  };

  users.push(nextUser);
  return nextUser;
}