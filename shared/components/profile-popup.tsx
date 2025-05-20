"use client";
import React from "react";
import { cn } from "./libs";
import LogoutButton from "@/shared/components/logout-button";
import { useSession } from "next-auth/react";

interface Props {
  className?: string;
  onClose?: () => void;
  setShowRegister: React.Dispatch<React.SetStateAction<boolean>>;
  setShowLogin: React.Dispatch<React.SetStateAction<boolean>>;
  popupRef: React.RefObject<HTMLDivElement | null>;
}

export const ProfilePopup: React.FC<Props> = ({
  className,
  onClose,
  popupRef,
  setShowRegister,
  setShowLogin,
}) => {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const userName = session?.user?.name;
  const userEmail = session?.user?.email;
  return (
    <>
      <div
        ref={popupRef}
        className={cn(
          "absolute top-full mt-2 right-0 w-64 bg-white shadow-lg rounded-xl p-4 z-50  max-sm:left-1/2 max-sm:-translate-x-1/2 max-sm:top-100 max-sm:w-[90%] max-sm:fixed",
          className
        )}
      >
        {session?.user ? (
          <>
            <h2 className="text-lg font-semibold mb-2">Профиль</h2>
            <p className="text-sm text-gray-600">Вы вошли как {userName}</p>
            <p className="text-sm text-gray-600">{userEmail}</p>
            <LogoutButton />
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold mb-2">Профиль</h2>
            <p className="text-sm text-gray-600">Вы вошли как гость</p>
            <button
              className="mt-4 w-full py-2 bg-black text-white rounded-md text-sm"
              onClick={() => {
                onClose?.();
                setShowLogin(true);
              }}
            >
              Войти
            </button>
            <button
              className="mt-4 w-full py-2 bg-black text-white rounded-md text-sm"
              onClick={() => {
                onClose?.();
                setShowRegister(true);
              }}
            >
              Зарегистрироваться
            </button>
          </>
        )}
      </div>
    </>
  );
};
