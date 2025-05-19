'use client'
import { useState, useEffect } from "react"
import Image from "next/image"
import MoonIcon from "./svg/header/MoonIcon"
import SunIcon from "./svg/header/SunIcon"

function ThemeSwitcher() {
    const [currentTheme, setCurrentTheme] = useState("light")

    function getCurrentTheme() {
        const theme = localStorage.getItem('theme')
        if (theme) {
            setCurrentTheme(theme)
            handleThemeChange(theme)
        } 
    }

    function setTheme(theme: string) {
        localStorage.setItem('theme', theme)
        setCurrentTheme(theme)
    }

    function handleThemeChange(theme: string) {
        if (theme === "light") {
            document.documentElement.classList.remove("dark")
            setTheme("light")
        } else {
            document.documentElement.classList.add("dark")
            setTheme("dark")
        }
    }

    useEffect(() => {
        getCurrentTheme()
    }, [])

    return (
        <div className="w-[15px]">
            {currentTheme === "light" ? (
                <button
                    className="w-[20px] cursor-pointer"
                    onClick={() => handleThemeChange("dark")}
                >
                    <MoonIcon />
                </button>
            ) : (
                <button
                    className="w-[20px] cursor-pointer"
                    onClick={() => handleThemeChange("light")}
                >
                    <SunIcon />
                </button>
            )}
        </div>
    )
}

export default ThemeSwitcher