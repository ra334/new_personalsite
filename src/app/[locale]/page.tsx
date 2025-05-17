import {useTranslations} from 'next-intl'
import Header from "@src/layouts/Header"

function Home() {
    const t = useTranslations('home')

    return (
        <>
            <Header />
            <main>
                <h1>{t('name')}</h1>
            </main>
        </>
    )
}

export default Home
