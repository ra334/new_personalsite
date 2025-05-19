import { useTranslations } from "next-intl"

function Footer() {
    const t = useTranslations("common")
    const currentYear = new Date().getFullYear()
    const copyrightText = `© ${currentYear} ` + t("footer.copyright")

    return (
        <footer className="mt-auto p-6">
            <div className="container">
                <div className="flex justify-center">
                    {copyrightText}
                </div>
            </div>
        </footer>
    )
}

export default Footer