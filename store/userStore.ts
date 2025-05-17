import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  fullname: string | null;
  isLoggedIn: boolean;
  register: (fullname: string, password: string) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      fullname: null,
      isLoggedIn: false,
      register: (fullname, password) => {
        // в реальном приложении сюда добавляется логика проверки/хэширования
        set({ fullname, isLoggedIn: true });
      },
      logout: () => set({ fullname: null, isLoggedIn: false }),
    }),
    { name: "user-storage" }
  )
);
