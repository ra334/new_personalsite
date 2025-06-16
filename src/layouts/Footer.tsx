import EmailIcon from '@src/components/svg/footer/EmailIcon'
import GithubIcon from '@src/components/svg/footer/GithubIcon'
import LinkedInIcon from '@src/components/svg/footer/LinkedinIcon'
import TelegramIcon from '@src/components/svg/footer/TelegramIcon'
import TwitterIcon from '@src/components/svg/footer/TwitterIcon'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

function Footer() {
    const t = useTranslations('common')
    const currentYear = new Date().getFullYear()
    const startYear = 2025
    const yearDisplay =
        startYear === currentYear ? startYear : `${startYear} - ${currentYear}`
    const copyrightText = `© ${yearDisplay} ` + t('footer.copyright')

    return (
        <footer className="mt-auto p-6">
            <div className="container">
                <div className="flex justify-between">
                    {copyrightText}
                    <div className="flex gap-4">
                        <Link href="mailto:savcukmihajlo@gmail.com">
                            <EmailIcon />
                        </Link>
                        <Link target="_blank" href="https://github.com/ra334">
                            <GithubIcon />
                        </Link>
                        <Link
                            target="_blank"
                            href="https://www.linkedin.com/in/mykhailo-savchuk-466b182a5/"
                        >
                            <LinkedInIcon />
                        </Link>
                        <Link target="_blank" href="https://t.me/half_zero">
                            <TelegramIcon />
                        </Link>
                        <Link target="_blank" href="https://x.com/haIf_zero">
                            <TwitterIcon />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
