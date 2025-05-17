"use client";
import React from "react";
import { cn } from "./libs";
import { useUserStore } from "@/store/userStore";

interface Props {
  className?: string;
  onClose?: () => void;
  setShowRegister: React.Dispatch<React.SetStateAction<boolean>>;
  popupRef: React.RefObject<HTMLDivElement | null>;
}

export const ProfilePopup: React.FC<Props> = ({ className, onClose ,popupRef,setShowRegister}) => {
  const fullname = useUserStore((state) => state.fullname);
  const logout = useUserStore((state) => state.logout);

  

  return (
    <>
      <div
        ref={popupRef}
        className={cn(
          "absolute top-full mt-2 right-0 w-64 bg-white shadow-lg rounded-xl p-4 z-50  max-sm:left-1/2 max-sm:-translate-x-1/2 max-sm:top-100 max-sm:w-[90%] max-sm:fixed",
          className
        )}
      >
        {fullname ? (
          <>
            <h2 className="text-lg font-semibold mb-2">{fullname}</h2>
            <span>Избраное</span>
            <button
              className="mt-4 w-full py-2 bg-black text-white rounded-md text-sm"
              onClick={logout}
            >
              Выйти
            </button>
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold mb-2">Профиль</h2>
            <p className="text-sm text-gray-600">Вы вошли как гость</p>
            <button
              className="mt-4 w-full py-2 bg-black text-white rounded-md text-sm"
              onClick={() => {
                onClose?.()
                setShowRegister(true)
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
