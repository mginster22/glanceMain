"use client";
import React, { useState } from "react";
import { signIn } from "next-auth/react";

interface Props {
  onClose: () => void;
}

export const LoginForm: React.FC<Props> = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.ok) {
      onClose();
    } else {
      alert("Ошибка входа");
    }

    setLoading(false);
  };

  const handleGithubLogin = async () => {
    setLoading(true);
    await signIn("github");
  };

  return (
    <div
      className="fixed inset-0 bg-[#0000007a] z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <form
        onClick={(e) => e.stopPropagation()}
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
          type="button"
          onClick={handleGithubLogin}
          disabled={loading}
          className="flex justify-center items-center ml-auto mr-auto pb-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            "Загрузка..."
          ) : (
            <>
              Войти через <img src="/github.svg" className="w-6 h-6 ml-2" />
            </>
          )}
        </button>
        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Загрузка..." : "Войти"}
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
