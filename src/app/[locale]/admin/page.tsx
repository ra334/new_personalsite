import Header from '@src/layouts/Header'
import Sidebar from '@src/layouts/admin/Sidebar'

async function AdminPage() {
    return (
        <div className="h-screen flex flex-col pb-3">
            <Header />
            <div className="border container p-2 mb-3 flex flex-1">
                <Sidebar />
                <main className="h-full w-full flex justify-center items-center">
                    <h1>Dashboard page</h1>
                </main>
            </div>
        </div>
    )
}

export default AdminPage
