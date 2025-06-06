import { useTranslations } from "next-intl"
import Link from "next/link"
import LocaleSwitcher from "@src/components/LocaleSwitcher"
import ThemeSwitcher from "@src/components/ThemeSwitcher"
import TorIcon from "@src/components/svg/header/TorIcon"

function Header() {
    const t = useTranslations("common")
    

    return (
        <header className="pt-5 dark:text-white">
            <div className="container">
                <div className="flex justify-around px-6">
                    <span className="w-full text-xl">
                        <Link href="/" className="font-medium">
                            {t("header.name")}
                        </Link>
                    </span>
                    <div className="flex gap-6">
                        <nav className="">
                            <ul className="flex gap-5 cursor-pointer">
                                <li>
                                    <Link href="/blog">
                                        {t("header.nav.blog")}
                                    </Link>
                                </li>
                                {/* <li>
                                    <Link href="/projects">
                                        {t("header.nav.projects")}
                                    </Link>
                                </li> */}
                                <li>
                                    <Link href="/about">
                                        {t("header.nav.about")}
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                        <div>
                            <a
                                href="http://msavchukgt7dzz7u3v7gkmrdgwdvuahurhti6sb3pu3rkwrndob6zcid.onion/"
                                title={t("header.tor")}
                            >
                                <TorIcon />
                            </a>
                        </div>
                        <LocaleSwitcher />
                        <ThemeSwitcher />
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
