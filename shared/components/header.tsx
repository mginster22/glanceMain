"use client";
import React from "react";
import { Container } from "./container";
import { AlignJustify, House, ShoppingCart, UserRound } from "lucide-react";
import { cn } from "./libs";
import Link from "next/link";
import { CartDrawer } from "./ui/cart-drawer";
import { SearchInput } from "./search-input";
import { ProfilePopup } from "./profile-popup";
import { RegisterForm } from "./forms/register-form";
import { useProductStore } from "@/store/useProduct";
import { useCartStore } from "@/store/useCart";
import { LoginForm } from "./forms/login-form";
import { useSession } from "next-auth/react";

interface Props {
  className?: string;
}

export const Header = () => {
  //Вызываем один раз Products
  const { products, fetchProducts } = useProductStore((state) => state);

  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const userName = session?.user?.name;
  const userEmail = session?.user?.email;

  const { cart, active, openCart, fetchCart } = useCartStore((state) => state);

  React.useEffect(() => {
    fetchProducts();
  }, []);

  React.useEffect(() => {
    if (status === "authenticated") {
      fetchCart();
    }
  }, [status, fetchCart]);

  const [profile, setProfile] = React.useState(false);

  const popupRef = React.useRef<HTMLDivElement>(null);
  const iconRef = React.useRef<HTMLDivElement>(null);

  const [showRegister, setShowRegister] = React.useState(false);
  const [showLogin, setShowLogin] = React.useState(false);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        popupRef.current &&
        !popupRef.current.contains(target) &&
        iconRef.current &&
        !iconRef.current.contains(target)
      ) {
        setProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div
        className={cn(
          "border-b-1 border-[#DEDEDE] pb-6 pt-1 max-h-[200px] sticky top-0 bg-white z-50 max-sm:static"
        )}
      >
        <Container className="flex justify-between items-center mt-8 max-sm:justify-center ">
          <div className="flex items-center gap-30  max-sm:flex-col max-sm:gap-4  ">
            <Link href="/">
              <img src="/logo.png" />
            </Link>
            <SearchInput />
          </div>
          <div className="max-sm:fixed max-sm:justify-center max-sm:bg-gray-100 max-sm:bottom-0 max-sm:w-full max-sm:gap-12 gap-6 items-center flex bg-gray-white  border-gray-200 z-50 py-2">
            <Link href="/" className=" flex flex-col items-center gap-1">
              <House className="" />
              <span className="text-xs ">Главная</span>
            </Link>
            <Link href="/catalog" className="flex flex-col items-center gap-1">
              <AlignJustify />
              <span className="text-xs">Каталог</span>
            </Link>

            {active ? (
              <CartDrawer />
            ) : (
              <div
                onClick={() => openCart()}
                className="flex flex-col items-center gap-1"
              >
                <div className="flex items-center gap-1">
                  <ShoppingCart />
                  <span className="text-gray-400 text-xs">{cart.length}</span>
                </div>
                <span className="text-xs">Корзина</span>
              </div>
            )}
            <div className="relative">
              <div
                ref={iconRef}
                className="flex flex-col items-center gap-1 cursor-pointer w-[50px]"
                onClick={() => setProfile((prev) => !prev)}
              >
                {session?.user?.image ? (
                  <img
                    src={session.user.image}
                    alt="Аватар"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <UserRound />
                )}
                <span className="text-xs text-center max-w-[80px] truncate">
                  {userName ?? "Профиль"}
                </span>
              </div>
              {profile && (
                <ProfilePopup
                  onClose={() => setProfile(false)}
                  setShowRegister={setShowRegister}
                  setShowLogin={setShowLogin}
                  popupRef={popupRef}
                />
              )}
              {showRegister && (
                <RegisterForm onClose={() => setShowRegister(false)} />
              )}
              {showLogin && <LoginForm onClose={() => setShowLogin(false)} />}
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};
