"use client";
import styles from "../page.module.css";
import Link from "next/link";
import { GlobeLock } from "lucide-react";
import { usePathname } from "next/navigation";
import ThemeDropdown from "./ThemeDropDown";
import UseUserStore from "../store/UserStore";

export default function Navbar() {
  const { isAuthenticated } = UseUserStore();
  const pathname = usePathname();

  const getNavigationItems = () => {
    if (pathname === "/") {
      return [{ name: "Registrarse", href: "/signUp" },
      ];

    }

    if (pathname === "/home") {
      return [
        { name: "Playground", href: "/playground" },
        { name: "Desafios", href: "/challenges" },
        { name: "Perfil", href: "/settings" },
      ];
    }

    if (pathname === "/playground") {
      return [
        { name: "Dashboard", href: "/home" },
        { name: "Desafios", href: "/challenges" },
      ];
    }

    if (pathname === "/challenges") {
      return [
        { name: "Dashboard", href: "/home" },
        { name: "Playground", href: "/playground" },
      ];
    }

    if (pathname === "/settings") {
      return [
        { name: "Dashboard", href: "/home" },
        { name: "Playground", href: "/playground" },
        { name: "Desafios", href: "/challenges" },
      ];
    }

    return [
      { name: "Ingresar", href: "/" },
    ];
  };

  const getHomeRoute = () => {
    if (isAuthenticated) {
      return "/home";
    }
    return "/";
  };

  const navItems = getNavigationItems();

  return (
    <nav className={`${styles.navigation} bg-base-100`}>
      <div className="flex items-center justify-between gap-2">
        <Link
          href={getHomeRoute()}
          className="text-xl sm:text-2xl font-bold cursor-pointer ml-60 hover:text-primary transition"
        >
          CryptoPlayground
        </Link>
        <GlobeLock size={24} className="text-primary" />
      </div>
      <ul className={`${styles.navList} flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 p-4 mr-30`}>
        {/* Conditionally render navigation items */}
        {navItems.map((item) => (
          <li key={item.name} className={styles.navItem}>
            <Link href={item.href}>{item.name}</Link>
          </li>
        ))}
        {/* Theme Dropdown - always show this */}
        <ThemeDropdown />
      </ul>
    </nav>
  );
}
