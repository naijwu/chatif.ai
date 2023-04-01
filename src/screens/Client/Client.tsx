import { useState } from "react";
import styles from "./Client.module.css";
import axios from "axios";
import { openai } from "@/utility/openai";
import { flatSummaryToTree } from "@/utility/scrapeProcessing";
import { ref, set } from "firebase/database";
import { db } from "../../utility/firebase";

const APIFY_API_KEY = process.env.NEXT_PUBLIC_APIFY_API_KEY;

const Client = () => {
  const APIFY_DATA_TIMEOUT = 20000;
  const userUID = "Y458AEs1X0MUcqcTduJwBq1WDOh2";
  const appName = "cra-bot";

  const [websiteLink, setWebsiteLink] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [result, setResult] = useState<any>();

  const scrapeApify = async () => {
    let datasetId: undefined | number = undefined;
    setLoading(true);

    await axios
      .post(
        `https://api.apify.com/v2/acts/apify~web-scraper/runs?token=${APIFY_API_KEY}`,
        {
          breakpointLocation: "NONE",
          browserLog: false,
          debugLog: false,
          downloadCss: true,
          downloadMedia: true,
          globs: [
            {
              glob: `${websiteLink}/**`,
            },
          ],
          headless: true,
          ignoreCorsAndCsp: false,
          ignoreSslErrors: false,
          injectJQuery: true,
          keepUrlFragments: false,
          linkSelector: "a[href]",
          pageFunction:
            "// The function accepts a single argument: the \"context\" object.\n// For a complete list of its properties and functions,\n// see https://apify.com/apify/web-scraper#page-function \nasync function pageFunction(context) {\n    // This statement works as a breakpoint when you're trying to debug your code. Works only with Run mode: DEVELOPMENT!\n    // debugger; \n\n    // jQuery is handy for finding DOM elements and extracting data from them.\n    // To use it, make sure to enable the \"Inject jQuery\" option.\n    const $ = context.jQuery;\n    const pageTitle = $('title').first().text();\n    const h1 = $('h1').first().text();\n    const first_h2 = $('h2').first().text();\n    const random_text_from_the_page = $('p').first().text();\n\n\n    // Print some information to actor log\n    context.log.info(`URL: ${context.request.url}, TITLE: ${pageTitle}`);\n\n    // Manually add a new page to the queue for scraping.\n   await context.enqueueRequest({ url: 'http://www.example.com' });\n\n    // Return an object with the data extracted from the page.\n    // It will be stored to the resulting dataset.\n    return {\n        url: context.request.url,\n        pageTitle,\n        h1,\n        first_h2,\n        random_text_from_the_page\n    };\n}",
          postNavigationHooks:
            '// We need to return array of (possibly async) functions here.\n// The functions accept a single argument: the "crawlingContext" object.\n[\n    async (crawlingContext) => {\n        // ...\n    },\n]',
          preNavigationHooks:
            '// We need to return array of (possibly async) functions here.\n// The functions accept two arguments: the "crawlingContext" object\n// and "gotoOptions".\n[\n    async (crawlingContext, gotoOptions) => {\n        // ...\n    },\n]\n',
          proxyConfiguration: {
            useApifyProxy: true,
          },
          runMode: "DEVELOPMENT",
          startUrls: [
            {
              url: `${websiteLink}`,
            },
          ],
          useChrome: false,
          waitUntil: ["networkidle2"],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(function (response) {
        datasetId = response.data.data.defaultDatasetId;
        console.log(response.data, datasetId);

        const fetchDataset = () => {
          if (datasetId) {
            fetch(
              `https://api.apify.com/v2/datasets/${datasetId}/items?token=${APIFY_API_KEY}`
            )
              .then((response) => response.json())
              .then((data) => {
                console.log(data.length);
                cleanAndAddContext(data);
                setLoading(false);
              })
              .catch((error) => console.error(error));
          }
        };

        setTimeout(fetchDataset, APIFY_DATA_TIMEOUT);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  const handleScrape = async () => {
    console.log("scraping", websiteLink);

    await scrapeApify();
  };

  async function getSummaryOfText(textToSummarize: string) {
    const response = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: `Summarize the following content: ${textToSummarize}`,
      max_tokens: 257,
      temperature: 0.1,
    });

    const summary = response.data.choices[0].text;
    return summary;
  }

  async function cleanAndAddContext(scrapedArray: any) {
    // temporary
    const cleanedArray = [];

    if (!scrapedArray) return console.error("no data to sort");

    for (let i = 0; i < scrapedArray.length; i++) {
      const { url, pageTitle, random_text_from_the_page } = scrapedArray[i];

      const pathArray = url.replace(/^(https?:\/\/)?(www\.)?/, "").split("/");
      pathArray.shift();
      const path = pathArray.join("/");
      const summary = await getSummaryOfText(random_text_from_the_page);

      cleanedArray.push({
        title: pageTitle,
        path: `/${path}`,
        summary: summary || "",
        content: random_text_from_the_page,
      });
    }

    const treeRepresentation = flatSummaryToTree(cleanedArray);
    set(ref(db, `users/${userUID}/${appName}`), treeRepresentation);

    setResult(cleanedArray);
  }

  return (
    <div className={styles.container}>
        <div className={styles.sidebar}>
            <div className={styles.brand}>

            </div>
            <div className={styles.icons}>

            </div>
            <div className={styles.userIcon}>

            </div>
        </div>
        <div className={styles.wrapper}>
            <div className={styles.section}>
                <div className={styles.floatingButton}>
                    {`<- Go back`}
                </div>
                <h3>Website you want to botify:</h3>
                <input
                    type="text"
                    value={websiteLink}
                    onChange={(e) => setWebsiteLink(e.target.value)}
                    />
                <button onClick={handleScrape}>Add!</button>
            </div>
        </div>

      {loading && "loading..."}
      {result && (
        <div className={styles.section}>{JSON.stringify(result || {})}</div>
      )}
    </div>
  );
};

export default Client;
