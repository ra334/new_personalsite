import { auth } from '@src/auth'
import Header from '@src/layouts/Header'
import Sidebar from '@src/layouts/admin/Sidebar'

async function AdminPage() {
    const session = await auth()

    return (
        <>
            <Header />
            <div className="container h-full w-full border p-4">
                <Sidebar />
            </div>
        </>
    )
}

export default AdminPage
