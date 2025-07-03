'use client'

import Button from '@src/components/Button'
import GoogleIcon from '@src/components/svg/GoogleIcon'
import { signIn } from 'next-auth/react'

function Login() {
    return (
        <div className="">
            <Button onClick={signIn}>
                <div className="flex gap-2 items-center">
                    <GoogleIcon className="block" width={18} height={18} />
                    Login with Google
                </div>
            </Button>
        </div>
    )
}

export default Login
