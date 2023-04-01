import { useState } from 'react'
import styles from './Client.module.css'
import axios from 'axios'

const APIFY_API_KEY = process.env.NEXT_PUBLIC_APIFY_API_KEY

const Client = () => {

    const [websiteLink, setWebsiteLink] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)

    const [result, setResult] = useState<any>()

    const handleScrape = async () => {

        console.log('scraping', websiteLink)

        // await scrapeApify()
    }

    return (
        <div className={styles.container}>
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