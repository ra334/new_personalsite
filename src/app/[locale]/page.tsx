import Footer from '@src/layouts/Footer'
import Header from '@src/layouts/Header'
import createGenerateMetadata from '@src/utils/metadata'
import {
    Handshake,
    Target,
    ShieldCheck,
    LifeBuoy,
    CalendarCheck,
} from 'lucide-react'
import { useTranslations } from 'next-intl'

interface Project {
    title: string
    text: string
    technologies: string[]
}

interface WhyMeItem {
    title: string
    text: string
}

export const generateMetadata = createGenerateMetadata('home')

function Home() {
    const t = useTranslations('home')
    const posts = []

    const developItems = t.raw('section_whatido.items_develop_list')
    const cybersecItems = t.raw('section_whatido.items_cybersec_list')
    const whymyItems = t.raw('section_whyme.items')
    const whymeIcons = [Handshake, Target, ShieldCheck, LifeBuoy, CalendarCheck]

    const cardAnimationStyle =
        'dark:shadow-white shadow-black shadow-md hover:shadow-lg transition hover:-translate-y-1 duration-300 ease-in-out select-none'

    return (
        <>
            <Header />
            <main className="">
                <div className="container flex justify-center">
                    <div className="max-w-[700px] px-2">
                        <section id="hero" className="text-center mt-15">
                            <h1 className="h1_title mb-8">
                                {t('section_hero.title')}
                            </h1>
                            <p className="text">{t('section_hero.text')}</p>
                        </section>
                        <section id="whatido" className="text-center mt-15">
                            <h2 className="h2_title mb-6">
                                {t('section_whatido.title')}
                            </h2>
                            <p className="text">{t('section_whatido.text')}</p>
                            <h3 className="h3_title my-6">
                                {t('section_whatido.items_develop_title')}
                            </h3>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-xl mx-auto">
                                {developItems.map(
                                    (item: string, index: number) => (
                                        <li
                                            key={index}
                                            className={
                                                `border
                                                min-h-[60px] p-2 text-center 
                                                flex items-center justify-center ` +
                                                cardAnimationStyle
                                            }
                                        >
                                            {item}
                                        </li>
                                    ),
                                )}
                            </ul>
                            <h3 className="h3_title my-6">
                                {t('section_whatido.items_cybersec_title')}
                            </h3>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-xl mx-auto">
                                {cybersecItems.map(
                                    (item: string, index: number) => (
                                        <li
                                            key={index}
                                            className={
                                                `border min-h-[60px] p-2 text-center flex items-center justify-center
                                        ${
                                            index === cybersecItems.length - 1
                                                ? 'md:col-span-2'
                                                : ''
                                        } ` + cardAnimationStyle
                                            }
                                        >
                                            {item}
                                        </li>
                                    ),
                                )}
                            </ul>
                        </section>

                        <section id="whyme" className="mt-15">
                            <h2 className="h2_title text-center mb-6">
                                {t('section_whyme.title')}
                            </h2>
                            <p className="text">{t('section_whyme.text')}</p>
                            <ul className="flex flex-col gap-4 border-l border-neutral-300 pl-6 mt-6">
                                {whymyItems.map(
                                    (item: WhyMeItem, index: number) => {
                                        const Icon = whymeIcons[index]
                                        return (
                                            <li key={index} className="ml-4">
                                                <div className="flex gap-2 items-center pb-3">
                                                    <Icon
                                                        className="min-w-[20px] min-h-[20px]"
                                                        width={20}
                                                        height={20}
                                                    />
                                                    <h3 className="h3_title ">
                                                        {item.title}
                                                    </h3>
                                                </div>
                                                <p>{item.text}</p>
                                            </li>
                                        )
                                    },
                                )}
                            </ul>
                        </section>
                        <section
                            id="contact"
                            className="border p-6 mt-15 flex items-center justify-center"
                        >
                            <div className="text-center">
                                <h2 className="h2_title mb-6">
                                    {t('section_contact.title')}
                                </h2>
                                <p className="text mb-3">
                                    {t('section_contact.text')}
                                </p>
                                <p className="text ">
                                    {t('section_contact.sub_text')}
                                </p>
                            </div>
                        </section>
                        <section id="lastposts" className="my-15">
                            {posts.length > 0 ? (
                                <h2 className="h2_title text-center mb-6">
                                    Posts are available
                                </h2>
                            ) : (
                                <>
                                    <h2 className="h2_title text-center mb-6">
                                        {t('section_lastposts.title')}
                                    </h2>
                                    <p className="text-center">
                                        {t('section_lastposts.empty')}
                                    </p>
                                </>
                            )}
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}

export default Home
