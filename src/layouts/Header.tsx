import { auth } from '@src/auth'
import LocaleSwitcher from '@src/components/LocaleSwitcher'
import ThemeSwitcher from '@src/components/ThemeSwitcher'
import TorIcon from '@src/components/svg/header/TorIcon'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

async function Header() {
    const session = await auth()
    const t = await getTranslations('common')

    return (
        <header className="py-5 dark:text-white">
            <div className="container">
                <div className="flex justify-around px-6">
                    <span className="w-full text-xl">
                        <Link href="/" className="font-medium">
                            {t('header.name')}
                        </Link>
                    </span>
                    <div className="flex gap-6">
                        <nav className="">
                            <ul className="flex gap-5 cursor-pointer">
                                <li>
                                    <Link href="/blog">
                                        {t('header.nav.blog')}
                                    </Link>
                                </li>
                                {/* <li>
                                    <Link href="/projects">
                                        {t("header.nav.projects")}
                                    </Link>
                                </li> */}
                                {/* <li>
                                    <Link href="/about">
                                        {t("header.nav.about")}
                                    </Link>
                                </li> */}
                            </ul>
                        </nav>
                        <div>
                            <a
                                href="http://msavchukgt7dzz7u3v7gkmrdgwdvuahurhti6sb3pu3rkwrndob6zcid.onion/"
                                title={t('header.tor')}
                            >
                                <TorIcon />
                            </a>
                        </div>
                        <LocaleSwitcher />
                        <ThemeSwitcher />
                        {session ? (
                            <Link href={'/admin'}>Admin</Link>
                        ) : (
                            <div></div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
