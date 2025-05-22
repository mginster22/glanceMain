'use client';

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    // редирект на страницу логина после выхода
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-black text-white py-1 px-4 rounded"
    >
      Выйти
    </button>
  );
}
