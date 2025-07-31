import { getGroupsPagenated, countAllGroups } from '@/db/models/article-groups'
import GroupsList from '@src/components/GroupsList'
import Pagination from '@src/components/Paginator'
import GroupsPanel from '@src/components/admin/GroupsPanel'
import Header from '@src/layouts/Header'
import Sidebar from '@src/layouts/admin/Sidebar'

async function GroupsPage() {
    const articlesPerPage = 5
    const articles = await getGroupsPagenated(0, articlesPerPage)
    const totalAllArticles = await countAllGroups()

    const totalPages = Math.ceil(totalAllArticles / articlesPerPage)

    return (
        <div className="h-screen flex flex-col pb-3 overflow-hidden">
            <Header />
            <div className="container h-full w-full border p-2 flex flex-grow gap-2 overflow-y-auto">
                <Sidebar />
                <main className="flex flex-col gap-2 w-full overflow-auto">
                    <GroupsPanel />
                    <GroupsList groups={articles} />
                    <Pagination
                        className="mt-auto pb-2"
                        basePath="/admin/groups"
                        currentPage={1}
                        totalPages={totalPages}
                    />
                </main>
            </div>
        </div>
    )
}

export default GroupsPage
