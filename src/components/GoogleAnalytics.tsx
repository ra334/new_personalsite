function GoogleAnalytics() {
    const googleAnalyticsId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID

    if (!googleAnalyticsId) {
        console.warn('Google Analytics ID is not set in environment variables.')
        return null
    }

    return (
        <>
            <script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
            ></script>
            <script
                dangerouslySetInnerHTML={{
                    __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${googleAnalyticsId}');
            `,
                }}
            />
        </>
    )
}

export default GoogleAnalytics
