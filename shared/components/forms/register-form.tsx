"use client";
import { useUserStore } from "@/store/userStore";
import React, { useState } from "react";

interface Props {
  onClose: () => void;
}

export const RegisterForm: React.FC<Props> = ({ onClose }) => {
  const register = useUserStore((state) => state.register);
  const [fullname, setFullname] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register(fullname, password);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-[#0000007a] z-50 flex items-center justify-center"
      onClick={onClose} // клик по фону — закрывает
    >
      <form
        onClick={(e) => e.stopPropagation()} // клик по форме — НЕ закрывает
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-80"
      >
        <h2 className="text-lg font-semibold mb-4">Регистрация</h2>
        <input
          type="text"
          placeholder="Полное имя"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
          className="w-full border p-2 rounded mb-2"
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded mb-4"
          required
        />
        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded"
        >
          Зарегистрироваться
        </button>
        <button
          type="button"
          onClick={onClose}
          className="w-full mt-2 text-sm text-gray-500"
        >
          Отмена
        </button>
      </form>
    </div>
  );
};
