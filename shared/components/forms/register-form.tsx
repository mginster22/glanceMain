"use client";
import { signIn } from "next-auth/react";
import React, { useState } from "react";

interface Props {
  onClose: () => void;
}

export const RegisterForm: React.FC<Props> = ({ onClose }) => {
  const [name, setName] = useState("");
  const [email,setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading,setLoading]=useState(false)


 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
      setLoading(true);
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || 'Ошибка регистрации');
        setLoading(false);
      return;
    }

    // После регистрации — сразу логинимся
    const signInRes = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (signInRes?.ok) {
      onClose();
    } else {
      alert('Ошибка входа после регистрации');
    }
  } catch (error) {
    alert('Ошибка сети или сервера');
  } finally {
      setLoading(false);
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
        <h2 className="text-lg font-semibold mb-4">Регистрация</h2>
        <input
          type="text"
          placeholder="Полное имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded mb-2"
          required
            disabled={loading}
        />
        <input
          type="text"
          placeholder="Ваш email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded mb-2"
          required
            disabled={loading}
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded mb-4"
          required
            disabled={loading}
        />
        <button
          type="submit"
           className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
          disabled={loading}
        >
         {loading ? "Загрузка..." : "Зарегистрироваться"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="w-full mt-2 text-sm text-gray-500"
            disabled={loading}
        >
          Отмена
        </button>
      </form>
    </div>
  );
};
