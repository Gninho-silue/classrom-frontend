import type { AccessControlProvider } from "@refinedev/core";
import { authProvider } from "./auth";

// Cache identity to avoid one HTTP call per can() invocation.
// We intentionally return { can: true } when identity is still loading so
// Refine never caches a false-negative during the initial render.
let _identity: { role?: string } | null = null;
let _cacheAt = 0;
const CACHE_TTL = 30_000;

const getRole = async (): Promise<string | undefined> => {
  if (_identity && Date.now() - _cacheAt < CACHE_TTL) return _identity.role;
  const id = await authProvider.getIdentity?.();
  if (id) {
    _identity = id as { role?: string };
    _cacheAt = Date.now();
  }
  return (id as any)?.role;
};

export const accessControlProvider: AccessControlProvider = {
  can: async ({ resource, action }) => {
    const role = await getRole();

    // Still loading — allow everything so Refine doesn't cache false-negatives
    if (!role) return { can: true };

    if (role === "admin") return { can: true };

    if (role === "teacher") {
      if (resource === "users" && ["create", "delete"].includes(action)) {
        return { can: false };
      }
      return { can: true };
    }

    if (role === "student") {
      if (resource === "users") return { can: false };
      if (["create", "edit", "delete"].includes(action)) return { can: false };
      return { can: true };
    }

    return { can: true };
  },
};
