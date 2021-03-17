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
                    cities: [item.City.length > 0  ? item.City : 'Unknown'],
                    isCompleteShow: item.Full === 'Yes',
                    isAudioOnly: item.Video === 'No',
                    isProRecord: item.ProShot === 'Yes',
                    soundQuality: 5,
                    videoQuality: 5,
                    state: 2,
                },
                headers: {
                    Authorization: `Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ7XCJfaWRcIjp7XCIkb2lkXCI6XCI2MDNmNDFiZjAwZGY5ODcwMDAzYWI3ZDVcIn0sXCJzdHJhdGVneVwiOjAsXCJtYWlsXCI6XCJ0ZXN0QHRlc3QuZnJcIixcInVzZXJuYW1lXCI6XCJ0ZXN0NVwiLFwicm9sZVwiOjMsXCJjcmVhdGVkT25cIjpcIjIwMjEtMDMtMDNUMDc6NTg6NTUuNDA3WlwiLFwibW9kaWZpZWRPblwiOlwiMjAyMS0wMy0wM1QwNzo1ODo1NS40MDdaXCJ9IiwiZXhwIjoxNjE0ODQ0Nzk2LjU4Nn0.k4bbjkT2ajw8R7ggECZpfELAOa_j0lU9-gJjt7PSSdy0U3rqupM3q2FrN6NDXl0Kp9FbYObjeYEK9C2bVivamQ`
                }
            })
        } catch (error) {
            console.log(item.Title, ">")
            console.error(error.response.data)
        }
    }
})()