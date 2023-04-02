import React from "react";
import Button from "../Button/Button";
import styles from "./CreationPage.module.css";
import { APIFY_DATA_TIMEOUT, PageContext } from "@/screens/Client/Client";

type Props = {
  url: string;
  setURL: React.Dispatch<React.SetStateAction<string>>;
  appName: string;
  setAppName: React.Dispatch<React.SetStateAction<string>>;
  setPage: React.Dispatch<React.SetStateAction<string>>;
  setPageContext: React.Dispatch<React.SetStateAction<PageContext>>;
  loading: boolean;
  handleScrape: () => void;
};

const CreationPage = ({
  url,
  setURL,
  appName,
  setAppName,
  setPage,
  loading,
  handleScrape,
}: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.buttons}>
        {!loading && (
          <Button href="#" disabled={loading} lightmode>
            <div
              className={`${styles.buttonInner}`}
              onClick={() => {
                if (loading) return;
                setPage("dashboard");
              }}
            >
              <span>{`<-`}</span>
              Dashboard
            </div>
          </Button>
        )}
      </div>

      <div className={styles.newBot}>
        <h2>
          {loading ? `Generating your chatbot` : `Let's generate your chatbot!`}
        </h2>
        {loading && (
          <p>
            Please wait until the process completes before leaving this page
          </p>
        )}
        {loading ? (
          <>
            <div className={styles.progress}>
              <div
                style={{
                  animationDuration: `${APIFY_DATA_TIMEOUT}s`,
                }}
                className={styles.progressBar}
              ></div>
            </div>
          </>
        ) : (
          <>
            <div className={styles.field}>
              <strong>Name</strong>
              <input
                value={appName}
                onChange={(e) => {
                  setAppName(e.target.value);
                }}
                type="text"
              />
            </div>
            <div className={styles.field}>
              <strong>URL</strong>
              <input
                value={url}
                onChange={(e) => {
                  setURL(e.target.value);
                }}
                type="text"
              />
            </div>
            <div className={styles.buttonPane}>
              <div className={styles.button} onClick={handleScrape}>
                Generate
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CreationPage;
