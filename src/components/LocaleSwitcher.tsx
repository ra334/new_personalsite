"use client"
import { useRouter } from "next/navigation"
import { usePathname } from "@src/i18n/navigation"
import { useLocale } from "next-intl"
import { useState } from "react"

function LocaleSwitcher() {
    const locale = useLocale()
    const router = useRouter()
    const pathname = usePathname()
    const hiddenLocale = locale === "en" ? "uk" : "en"
    const [hiddenLocaleStyle, setHiddenLocaleStyle] = useState("hidden")

    function changeLocale() {
        router.push(`/${hiddenLocale}${pathname}`)
    }

    function showHiddenLocale() {
        if (hiddenLocaleStyle === "hidden") {
            setHiddenLocaleStyle("block")
        } else {
            setHiddenLocaleStyle("hidden")
        }
    }

    return (
        <div className="cursor-pointer">
            <div className="flex gap-2 items-center" onClick={showHiddenLocale}>
                {locale.toUpperCase()}
                <svg
                    fill="currentColor"
                    height="15px"
                    width="15px"
                    version="1.1"
                    id="Layer_1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 330 330"
                >
                    <path
                        id="XMLID_225_"
                        d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393
        c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393
        s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"
                    />
                </svg>
            </div>
            <div className={hiddenLocaleStyle + " relative"}>
                <button className="absolute cursor-pointer" onClick={() => changeLocale()}>
                    {hiddenLocale.toUpperCase()}
                </button>
            </div>
        </div>
    )
}

export default LocaleSwitcher
