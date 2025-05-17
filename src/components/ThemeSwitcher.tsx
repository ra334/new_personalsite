'use client'
import { useState, useEffect } from "react"
import Image from "next/image"
import MoonIMG from '@/public/themeSwitcher/moon.svg'
import SunIMG from '@/public/themeSwitcher/sun.svg'

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
                    <Image src={MoonIMG} alt="Moon" />
                </button>
            ) : (
                <button
                    className="w-[20px] cursor-pointer"
                    onClick={() => handleThemeChange("light")}
                >
                    <Image src={SunIMG} alt="Sun" />
                </button>
            )}
        </div>
    )
}

export default ThemeSwitcher