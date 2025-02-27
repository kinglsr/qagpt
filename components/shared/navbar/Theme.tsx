import React, { useEffect } from "react";
import { useTheme } from "@/context/ThemeProvider";
import Image from "next/image";

const Theme = () => {
  const { mode, setMode } = useTheme();

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setMode(storedTheme);
    } else {
      setMode("dark"); // Set default mode to "dark"
    }
  }, [setMode]);

  const toggleTheme = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    localStorage.setItem("theme", newMode);
  };

  return (
    <label className="relative inline-flex cursor-pointer items-center">
      <input
        type="checkbox"
        value=""
        className="peer sr-only"
        checked={mode === "dark"}
        onChange={toggleTheme}
      />
      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-orange-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
      <div className="ml-3">
        {mode === "light" ? (
          <Image
            src="/assets/icons/sun.svg"
            alt="sun"
            width={20}
            height={20}
            className="active-theme"
          />
        ) : (
          <Image
            src="/assets/icons/moon.svg"
            alt="moon"
            width={20}
            height={20}
            className="active-theme"
          />
        )}
      </div>
    </label>
  );
};

export default Theme;
