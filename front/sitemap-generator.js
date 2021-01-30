const { configureSitemap } = require('@sergeymyssak/nextjs-sitemap')
const mongo = require('mongodb')
require('dotenv').config()
    ;
(async () => {
    const db = await mongo.connect(process.env.MONGO_CONNEXION)
    const dbo = db.db(process.env.MONGO_DB)
    const bootlegs = await dbo.collection('bootlegs').find({}).toArray()
    await db.close()

    const Sitemap = configureSitemap({
        baseUrl: 'https://grand-theft-bootleg.com',
        include: bootlegs.map(bootleg => `/bootleg/${encodeURIComponent(bootleg.title)}-${bootleg._id}`),
        exclude: ['/404', '/api/[...slug]', '/general-conditions', '/login', '/register', '/user/', '/bootleg/[id]/', '/bootleg/[id]/edit'],
        excludeIndex: true,
        pagesConfig: {
            '/bootleg/*': {
                priority: '0.5',
                changefreq: 'monthly',
            },
        },
        isTrailingSlashRequired: true,
        targetDirectory: __dirname + '/public',
        pagesDirectory: __dirname + '/pages',
    })
    Sitemap.generateSitemap()
})()