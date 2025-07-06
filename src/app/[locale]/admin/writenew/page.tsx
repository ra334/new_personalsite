'use client'

import Editor from '@src/layouts/admin/Editor'
import EditorToolBar from '@src/layouts/admin/EditorToolBar'
import Sidebar from '@src/layouts/admin/Sidebar'
import { type Editor as EditorType } from '@tiptap/react'
import { useState, useEffect } from 'react'

function WriteNewPage() {
    const [editor, setEditor] = useState<EditorType | null>(null)

    return (
        <div className="container h-screen flex flex-col">
            <div className="my-2">
                <EditorToolBar editor={editor} />
            </div>
            <div className="border flex flex-grow overflow-y-auto p-2 mb-2">
                <Sidebar isWriteNewPage={true} />
                <main className="justify-center items-center w-full pl-2">
                    <div className="h-full overflow-auto">
                        <Editor setEditor={setEditor} />
                    </div>
                </main>
            </div>
        </div>
    )
}

export default WriteNewPage
