import { create, StateCreator } from "zustand"
import { ENV } from "../config/env";
import { ILoginResponse, IUser } from "../interfaces"; // Import from index
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { persist } from "zustand/middleware";

interface AuthState {
  user: undefined | IUser | any,
  token: undefined | string,
  authStatus: "pending" | "auth" | "not-auth",
  isLoading: boolean;
}

interface Actions {
  logout: () => Promise<void>;
  login: (
    phone: string,
    pin: string
  ) => Promise<void>;
  clientLogin: (
    phone: string,
    ci_nit: string
  ) => Promise<void>;
  clientRegister: (
    name: string,
    phone: string,
    ci_nit: string
  ) => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  updateProfile: (data: { name: string, email: string, phone: string, avatar?: string }) => Promise<void>;
  changePin: (data: { current_pin: string, pin: string, pin_confirmation: string }) => Promise<void>;
}

const storeApi: StateCreator<AuthState & Actions> = (set, get) => ({
  user: undefined,
  token: undefined,
  authStatus: "pending",
  isLoading: false,

  login: async (phone: string, pin: string) => {
    set({ isLoading: true });
    try {
      // Backend expects { phone, pin }
      const { data } = await ENV.post<ILoginResponse>("/auth/login", { phone, pin });

      set(() => ({
        user: data.user,
        token: data.accessToken, // Backend returns 'accessToken'
        authStatus: "auth",
        isLoading: false
      }))
      toast.success(`Bienvenido ${data.user.name}`);
    }
    catch (error) {
      set(() => ({
        user: undefined,
        token: undefined,
        authStatus: "not-auth",
        isLoading: false
      }));
      if (isAxiosError(error)) {
        toast.error(
          "Error de inicio de sesión",
          {
            description: error.response?.data.message || "Credenciales incorrectas"
          }
        );
      }
    }
  },

  clientLogin: async (phone: string, ci_nit: string) => {
    set({ isLoading: true });
    try {
      const { data } = await ENV.post<ILoginResponse>("/client/login", { phone, ci_nit });

      set(() => ({
        user: data.user,
        token: data.accessToken,
        authStatus: "auth",
        isLoading: false
      }));
      toast.success(`Bienvenido ${data.user.name}`);
    } catch (error) {
      set(() => ({
        user: undefined,
        token: undefined,
        authStatus: "not-auth",
        isLoading: false
      }));
      if (isAxiosError(error)) {
        toast.error("Error de inicio de sesión", {
          description: error.response?.data.message || "Credenciales incorrectas"
        });
      }
    }
  },

  clientRegister: async (name: string, phone: string, ci_nit: string) => {
    set({ isLoading: true });
    try {
      const { data } = await ENV.post<ILoginResponse>("/client/register", { name, phone, ci_nit });

      set(() => ({
        user: data.user,
        token: data.accessToken,
        authStatus: "auth",
        isLoading: false
      }));
      toast.success(`Cuenta creada con éxito, ¡Bienvenido ${data.user.name}!`);
    } catch (error) {
      set({ isLoading: false });
      if (isAxiosError(error)) {
        toast.error("Error al registrarse", {
          description: error.response?.data.message || "Ocurrió un error inesperado"
        });
      }
    }
  },

  hasPermission: (permission) => {
    // Backend 'permissions' field implementation might vary, adjusting based on simpler role check for now
    // const { user } = get();
    // return user?.permissions.includes(permission) ?? false;
    return true; // Placeholder until permissions are fully implemented
  },

  hasRole: (role) => {
    const { user } = get();
    return user?.role === role; // Backend user has single 'role' field
  },

  checkAuthStatus: async () => {
    const token = get().token;

    // Helper to verify token validity
    const verifyToken = async (accessToken: string) => {
      const { data } = await ENV.get<IUser>("/me", {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      return data;
    };

    // Helper to refresh token
    const tryRefresh = async () => {
      try {
        const { data } = await ENV.post<ILoginResponse>("/auth/refresh");
        set({
          user: data.user,
          token: data.accessToken,
          authStatus: "auth",
          isLoading: false
        });
        return true;
      } catch (error) {
        console.error("Session refresh failed", error);
        return false;
      }
    };

    if (!token) {
      // No token? Try refreshing directly (maybe we have a cookie)
      const refreshed = await tryRefresh();
      if (!refreshed) {
        set({ user: undefined, token: undefined, authStatus: "not-auth", isLoading: false });
      }
      return;
    }

    // Check if current token is valid
    try {
      const user = await verifyToken(token);
      set({ user, token, authStatus: "auth", isLoading: false });
    } catch (error) {
      // Token invalid/expired? Try refresh
      const refreshed = await tryRefresh();
      if (!refreshed) {
        set({ user: undefined, token: undefined, authStatus: "not-auth", isLoading: false });
      }
    }
  },

  logout: async () => {
    const token = get().token;

    if (get().authStatus === "not-auth") {
      set(() => ({
        user: undefined,
        token: undefined,
        authStatus: "not-auth"
      }));
      return;
    }
    try {
      await ENV.post("/auth/logout", {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // Clear state
      set(() => ({
        user: undefined,
        token: undefined,
        authStatus: "not-auth"
      }));
    }
    catch (error) {
      // Force logout on error
      set(() => ({
        user: undefined,
        token: undefined,
        authStatus: "not-auth"
      }));

      if (isAxiosError(error)) {
        if (error.response?.status === 401) {
          // Already unauthorized
        } else {
          toast.error("Error al cerrar sesión");
        }
      }
    }
  },

  updateProfile: async (data) => {
    set({ isLoading: true });
    try {
      const response = await ENV.post("/profile/update", data);
      set({ user: response.data.user, isLoading: false });
      toast.success("Perfil actualizado correctamente");
    } catch (error) {
      set({ isLoading: false });
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message || "Error al actualizar perfil");
      }
      throw error;
    }
  },

  changePin: async (data) => {
    set({ isLoading: true });
    try {
      await ENV.post("/profile/change-pin", data);
      set({ isLoading: false });
      toast.success("PIN actualizado correctamente");
    } catch (error) {
      set({ isLoading: false });
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message || "Error al cambiar PIN");
      }
      throw error;
    }
  },
})

export const useAuthStore = create<AuthState & Actions>()(
  persist(storeApi, {
    name: "auth-store",
    partialize: (state) => ({ token: state.token, user: state.user, authStatus: state.authStatus }), // Persist necessary fields
  })
);