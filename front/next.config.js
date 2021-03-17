module.exports = {
    // Will only be available on the server side
    serverRuntimeConfig: {

    },
    // Will be available on both server and client
    publicRuntimeConfig: {
        //Some URLs
        backUrl: process.env.REACT_APP_BACK_URL,
        apiUrl: process.env.REACT_APP_API_URL,
        appUrl: process.env.REACT_APP_APP_URL,
        //In app
        storageKey: process.env.REACT_APP_LOCAL_STORAGE_KEY,
        appName: 'Grand Theft Bootleg',
        appMail: 'grand.theft.bootleg@gmail.com',
        //Some keys
        googleKey: process.env.REACT_APP_GOOGLE_KEY,
        twitterKey: process.env.REACT_APP_TWITTER_KEY,
        facebookKey: process.env.REACT_APP_FACEBOOK_KEY,
        gtmId: process.env.REACT_APP_GTM_ID,
    },
    images: {
        domains: ['localhost'],
    },
}