module.exports = {
    // Will only be available on the server side
    serverRuntimeConfig: {

    },
    // Will be available on both server and client
    publicRuntimeConfig: {
        backUrl: process.env.REACT_APP_BACK_URL,
        apiUrl: process.env.REACT_APP_API_URL,
        storageKey: process.env.REACT_APP_LOCAL_STORAGE_KEY,
        appName: 'Grand Theft Bootleg',
        googleKey: process.env.REACT_APP_GOOGLE_KEY,
        twitterKey: process.env.REACT_APP_TWITTER_KEY,
        facebookKey: process.env.REACT_APP_FACEBOOK_KEY,
    },
    images: {
        domains: ['localhost'],
    },
}