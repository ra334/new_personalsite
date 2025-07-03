import Footer from '@src/layouts/Footer'
import Header from '@src/layouts/Header'
import SignInButton from '@src/layouts/SignInButton'

async function SigninPage() {
    return (
        <>
            <Header />
            <div className="container h-full w-full flex flex-col justify-center items-center">
                <SignInButton />
            </div>
            <Footer />
        </>
    )
}

export default SigninPage
