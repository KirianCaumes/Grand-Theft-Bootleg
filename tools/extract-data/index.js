const csv = require('csv-parser')
const fs = require('fs')
const axios = require('axios').default
    ;

/**
 * Download content as CSV:
 * https://docs.google.com/spreadsheets/d/1pHhsfhiihyAzzSA8pwOimy4feq2_5BSIuLUS3F0NLC8/edit
 */

(async () => {
    /** @type {any[]} */
    const items = await new Promise(resolve => {
        const results = []
        fs.createReadStream('Bootlegs - In Flames.csv')
            .pipe(csv())
            .on('data', data => results.push(data))
            .on('end', () => resolve(results))
    })

    for await (const item of items) {
        try {
            await axios.request({
                baseURL: "http://localhost:5000/api/bootleg",
                method: 'POST',
                data: {
                    title: item.Title.length > 4 ? item.Title : `${item.Title}${'_'.repeat(5 - item.Title?.length)}`,
                    description: item.Comment.length > 0 ? item.Comment : "Azerty",
                    date: new Date(`${item.Year}-01-01`),
                    picture: null,
                    links: [item.Link],
                    bands: ['In Flames'],
                    songs: ['Intro'],
                    countries: [item.Country.length > 0 ? item.Country : "United States"],
                    cities: [item.City.length > 0 ? item.City : 'Unknown'],
                    isCompleteShow: item.Full === 'Yes',
                    isAudioOnly: item.Video === 'No',
                    isProRecord: item.ProShot === 'Yes',
                    soundQuality: 5,
                    videoQuality: 5,
                    state: 2,
                },
                headers: {
                    Authorization: `Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ7XCJfaWRcIjp7XCIkb2lkXCI6XCI2MDc2YTgyNDAwMWQ5ZDBhMDBiMzM1N2RcIn0sXCJzdHJhdGVneVwiOjAsXCJtYWlsXCI6XCJraXJpYW4uY2F1bWVzMkBnbWFpbC5jb21cIixcInVzZXJuYW1lXCI6XCJraXJpYW5cIixcInJvbGVcIjozLFwiY3JlYXRlZE9uXCI6XCIyMDIxLTA0LTE0VDA4OjMwOjI4LjMxM1pcIixcIm1vZGlmaWVkT25cIjpcIjIwMjEtMDQtMTRUMDg6MzA6MjguMzEzWlwifSIsImV4cCI6MTYxODQ3NTQ3MS4wNTV9.od39KnOo1QvgnGEmwfv5tqKfXc64XLwnnuTaZmZJxEP5LGKqll12z2eNDR9f1cutMQ0W__raY16qVb-J0bsE1A`
                }
            })
        } catch (error) {
            console.log(item.Title, ">")
            console.error(error.response.data)
        }
    }
})()