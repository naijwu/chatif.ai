import { useState } from 'react'
import styles from './Client.module.css'
import axios from 'axios'
import { Configuration, OpenAIApi } from 'openai'
import { openai } from '@/utility/openai'

const exampleData = [
    {
      "url": "https://www.jaewuchun.com",
      "pageTitle": "jaewuchun",
      "h1": "jaewuchun",
      "first_h2": "",
      "random_text_from_the_page": "based in Vancouver, I'm a second-year science undergrad @ ubc (currently on gap).when not building mainstream.so, I'm developing for nwPlus ubc or going for a drive.early highschool I built several websites (for conferences, charities, businesses).I have a habit of starting projects randomly (most small, weekend projects).some (larger) projects include internetspace.co🡥, wordseveryday.net🡥, and opengavel.app🡥.I love gamifying everything so these are my stats.these days, I've been learning of and building in crypto & web3.I'm interested in the financial markets, writing, and systems.I like to think and create, I love people and ideas.cheers"
    },
    {
      "url": "https://www.jaewuchun.com/undergrad-at-ubc",
      "pageTitle": "jaewuchun",
      "h1": "jaewuchun",
      "first_h2": "",
      "random_text_from_the_page": "undergrad @ ubcI hope to major in Computer ScienceSome courses I’ve taken and are taking:CPSC 110: Systematic Program Design (DrRacket, Recursion)CPSC 121: Models of Computation (Logic)CPSC 210: Software Construction (Java)MATH 100: Differential Calculus w/ Physics applications (Calc 1)MATH 101: Integral Calculus w/ Physics applications (Calc 2)ATSC 113: Atmospheric Science18 transfer credits from IB (for physics, english, and economics courses)"
    },
    {
      "url": "https://www.jaewuchun.com/mainstream",
      "pageTitle": "jaewuchun",
      "h1": "jaewuchun",
      "first_h2": "",
      "random_text_from_the_page": "building mainstream.solaunched closed beta!mainstream is a modular, end-to-end governance platform for DAOs. Discuss proposals, have off-chain voting (Moloch, Snapshot, etc.), and then on-chain voting (Bravo, etc.) all in a package that makes sense and is efficientcurrently closing our pre-seed round (led by Lemniscap, joined by Samsung Next + many amazing angels) to focus on onboarding organizations to the platformmedium to long term, we want to offer deep treasury + delegation insight, as well as explore metagovernance + cross-chain governanceexciting!visit the landing at mainstream.so🡥"
    },
    {
      "url": "https://www.jaewuchun.com/nwplus",
      "pageTitle": "jaewuchun",
      "h1": "jaewuchun",
      "first_h2": "",
      "random_text_from_the_page": "development director @ nwPlus ubcI push modifications and updates for internal tools (hackathon applicant evaluator),update hacker-facing applications (hacker portal), andcreate and/or update the websites for the three hackathons hosted by nwPlus: nwHacks, HackCamp, and cmd-f*.we work with react and firebase.recently hired two new devs as an incoming (for 2022-23) directorbasically, I push buttons, make life easier, and vibevisit nwPlus at nwplus.io🡥"
    },
    {
      "url": "https://www.jaewuchun.com/websites",
      "pageTitle": "jaewuchun",
      "h1": "jaewuchun",
      "first_h2": "",
      "random_text_from_the_page": "website creationslooking back, I went kind of hard with making a bunch of websites in highschoolthese are several I've designed and codedint'l youth debate initiativesite was for a debate education-focused non-profithelp the business had a list of gofundme's and resources for the looting in the USpa senate was for my highschool's student governmentnimz kitchen was for a fully custom catering serviceminienterprize 2019site was for Canada's largest high-school case competitionchun2020 was my student gov't campaign websitepacific model ungithub was for a highschool MUN conference <-> 2019site bc forensics leaguesite was for a debate academyinova computer associationsite was for a highschool org that hosted cs-related workshops and eventswish youth network society was for a highschool charity that fundraised for researchprosper vancouvergithub was for another highschool case competition <-> 2018site central model un was for an inaugural MUN day-conference"
    },
  ]

const APIFY_API_KEY = process.env.NEXT_PUBLIC_APIFY_API_KEY

const Client = () => {

    const APIFY_DATA_TIMEOUT = 20000

    const [websiteLink, setWebsiteLink] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)

    const [result, setResult] = useState<any>()

    const scrapeApify = async () => {
        let datasetId: undefined | number = undefined
        setLoading(true)

        await axios.post(`https://api.apify.com/v2/acts/apify~web-scraper/runs?token=${APIFY_API_KEY}`, {
            "breakpointLocation": "NONE",
            "browserLog": false,
            "debugLog": false,
            "downloadCss": true,
            "downloadMedia": true,
            "globs": [
                {
                    "glob": `${websiteLink}/**`
                }
            ],
            "headless": true,
            "ignoreCorsAndCsp": false,
            "ignoreSslErrors": false,
            "injectJQuery": true,
            "keepUrlFragments": false,
            "linkSelector": "a[href]",
            "pageFunction": "// The function accepts a single argument: the \"context\" object.\n// For a complete list of its properties and functions,\n// see https://apify.com/apify/web-scraper#page-function \nasync function pageFunction(context) {\n    // This statement works as a breakpoint when you're trying to debug your code. Works only with Run mode: DEVELOPMENT!\n    // debugger; \n\n    // jQuery is handy for finding DOM elements and extracting data from them.\n    // To use it, make sure to enable the \"Inject jQuery\" option.\n    const $ = context.jQuery;\n    const pageTitle = $('title').first().text();\n    const h1 = $('h1').first().text();\n    const first_h2 = $('h2').first().text();\n    const random_text_from_the_page = $('p').first().text();\n\n\n    // Print some information to actor log\n    context.log.info(`URL: ${context.request.url}, TITLE: ${pageTitle}`);\n\n    // Manually add a new page to the queue for scraping.\n   await context.enqueueRequest({ url: 'http://www.example.com' });\n\n    // Return an object with the data extracted from the page.\n    // It will be stored to the resulting dataset.\n    return {\n        url: context.request.url,\n        pageTitle,\n        h1,\n        first_h2,\n        random_text_from_the_page\n    };\n}",
            "postNavigationHooks": "// We need to return array of (possibly async) functions here.\n// The functions accept a single argument: the \"crawlingContext\" object.\n[\n    async (crawlingContext) => {\n        // ...\n    },\n]",
            "preNavigationHooks": "// We need to return array of (possibly async) functions here.\n// The functions accept two arguments: the \"crawlingContext\" object\n// and \"gotoOptions\".\n[\n    async (crawlingContext, gotoOptions) => {\n        // ...\n    },\n]\n",
            "proxyConfiguration": {
                "useApifyProxy": true
            },
            "runMode": "DEVELOPMENT",
            "startUrls": [
                {
                    "url": `${websiteLink}`
                }
            ],
            "useChrome": false,
            "waitUntil": [
                "networkidle2"
            ]
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(function (response) {
            datasetId = response.data.data.defaultDatasetId
            console.log(response.data, datasetId);
            
            const fetchDataset = () => {
                if (datasetId) {
                    fetch(`https://api.apify.com/v2/datasets/${datasetId}/items?token=${APIFY_API_KEY}`)
                        .then(response => response.json())
                        .then(data => {
                            console.log(data.length)
                            cleanAndAddContext(data)
                            setLoading(false)
                        })
                        .catch(error => console.error(error));
                }
            }

            setTimeout(fetchDataset, APIFY_DATA_TIMEOUT); 
        })
        .catch(function (error) {
            console.error(error);
        });
    }

    const handleScrape = async () => {
        console.log('scraping', websiteLink)

        await scrapeApify()
    }

    async function getSummaryOfText(textToSummarize: string) {
          const response = await openai.createCompletion({
            model: 'text-davinci-002',
            prompt: `Summarize the following content: ${textToSummarize}`,
            max_tokens: 257,
            temperature: 0.1,
        });

        const summary = response.data.choices[0].text;
        return summary;
    }

    async function cleanAndAddContext(scrapedArray: any) {
        // temporary 
        scrapedArray = exampleData
        
        const cleanedArray = []

        if (!scrapedArray) return console.error ('no data to sort')

        for (let i = 0; i < scrapedArray.length; i++) {
            const { url, random_text_from_the_page } = scrapedArray[i]

            const pathArray = url.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')
            pathArray.shift()
            const path = pathArray.join('/')
            const summary = await getSummaryOfText(random_text_from_the_page);

            cleanedArray.push({
                path: `/${path}`,
                summary,
                content: random_text_from_the_page
            })
        }
        setResult(cleanedArray)
    }

    return (
        <div className={styles.container}>
            <div onClick={cleanAndAddContext}>
                clean data
            </div>
            <div className={styles.section}>
                <h3>Website you want to botify:</h3>
                <input type="text" value={websiteLink} onChange={e=>setWebsiteLink(e.target.value)} />
                <button onClick={handleScrape}>
                    Add!
                </button>
            </div>

            {loading && 'loading...'}
            {result && (
                <div className={styles.section}>
                    {JSON.stringify(result || {})}
                </div>
            )}
        </div>
    )
}

export default Client;