import Header from '@src/layouts/Header'
import Sidebar from '@src/layouts/admin/Sidebar'

function DraftsPage() {
    return (
        <>
            <Header />
            <div className="container h-full w-full border p-4 flex">
                <Sidebar />
                <div className="flex justify-center items-center w-full">
                    <h1>Drafts</h1>
                </div>
            </div>
        </>
    )
}

export default DraftsPage
