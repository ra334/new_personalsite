import { useTranslations } from "next-intl"
import Header from "@src/layouts/Header"
import Footer from "@src/layouts/Footer"
import Link from "next/link"
import GithubIcon from "@src/components/svg/footer/GithubIcon"

function ProjectsPage() {
    const t = useTranslations("projects")
    const projectItems = t.raw("items")

    const githubLinks = ["https://github.com/AnyToolLab/Frontend"]

    interface Project {
        title: string
        text: string
        technologies: string[]
    }

    return (
        <>
            <Header />
            <main className="max-w-[800px] mx-auto">
                <div className="text-center m-15">
                    <h1 className="h1_title">{t("title")}</h1>
                    <p className="text">{t("description")}</p>
                </div>
                <ul>
                    {projectItems.map((item: Project, index: number) => {
                        return (
                            <li key={index} className="border p-4">
                                <h2 className="h3_title">{item.title}</h2>
                                <p className="text_small mb-4">{item.text}</p>
                                <div className="flex justify-between items-center">
                                    <div className="">
                                        {item.technologies.map(
                                            (
                                                tech: string,
                                                techIndex: number
                                            ) => (
                                                <span
                                                    key={techIndex}
                                                    className="font-normal text-base"
                                                >
                                                    {tech}
                                                    {techIndex <
                                                        item.technologies
                                                            .length -
                                                            1 && " | "}
                                                </span>
                                            )
                                        )}
                                    </div>
                                    <Link href={githubLinks[index]}>
                                        <GithubIcon />
                                    </Link>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </main>
            <Footer />
        </>
    )
}

export default ProjectsPage
