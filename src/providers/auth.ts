import type { AuthProvider } from "@refinedev/core";
import { BACKEND_BASE_URL } from "@/constants";

// Strip trailing /api/ to get the base origin for better-auth endpoints
const AUTH_BASE = BACKEND_BASE_URL.replace(/\/api\/?$/, "");

const authFetch = (path: string, init?: RequestInit) =>
  fetch(`${AUTH_BASE}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

export const authProvider: AuthProvider = {
  login: async ({ email, password, providerName }) => {
    if (providerName) {
      return {
        success: false,
        error: { name: "LoginError", message: "Social login is not configured" },
      };
    }

    try {
      const res = await authFetch("/api/auth/sign-in/email", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return {
          success: false,
          error: { name: "LoginError", message: err.message ?? "Invalid credentials" },
        };
      }

      return { success: true, redirectTo: "/" };
    } catch {
      return {
        success: false,
        error: { name: "NetworkError", message: "Could not connect to server" },
      };
    }
  },

  register: async ({ email, password, name, role }) => {
    try {
      const res = await authFetch("/api/auth/sign-up/email", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
          name: name || email.split("@")[0],
          role: role || "student",
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return {
          success: false,
          error: { name: "RegisterError", message: err.message ?? "Registration failed" },
        };
      }

      return { success: true, redirectTo: "/" };
    } catch {
      return {
        success: false,
        error: { name: "NetworkError", message: "Could not connect to server" },
      };
    }
  },

  logout: async () => {
    try {
      await authFetch("/api/auth/sign-out", { method: "POST" });
    } catch {
      // ignore
    }
    return { success: true, redirectTo: "/login" };
  },

  check: async () => {
    try {
      const res = await authFetch("/api/auth/get-session");
      if (!res.ok) return { authenticated: false, redirectTo: "/login" };
      const data = await res.json();
      if (data?.session) return { authenticated: true };
      return { authenticated: false, redirectTo: "/login" };
    } catch {
      return { authenticated: false, redirectTo: "/login" };
    }
  },

  getIdentity: async () => {
    try {
      const res = await authFetch("/api/auth/get-session");
      if (!res.ok) return null;
      const data = await res.json();
      if (!data?.user) return null;
      return {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        avatar: data.user.image,
        role: data.user.role,
      };
    } catch {
      return null;
    }
  },

  onError: async (error) => {
    if (error?.statusCode === 401 || error?.status === 401) {
      return { logout: true, redirectTo: "/login" };
    }
    return { error };
  },
};
