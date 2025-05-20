"use client";
import React, { useState } from "react";
import { signIn } from 'next-auth/react';


interface Props {
  onClose: () => void;
}

export const LoginForm: React.FC<Props> = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (res?.ok) {
     onClose()// редирект на главную или дашборд
    } else {
      alert('Ошибка входа');
    }
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
        <h2 className="text-lg font-semibold mb-4">Вход</h2>
        <input
          type="email"
          placeholder="Ваш email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          Войти
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
