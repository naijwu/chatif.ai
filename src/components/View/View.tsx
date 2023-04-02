import { PageContext } from "@/screens/Client/Client";
import React, { useState } from "react";
import Button from "../Button/Button";
import Confetti from 'react-confetti'
import Chat from "../Chat/Chat";
import styles from "./View.module.css";
import { useRouter } from "next/router";

type Props = {
  setPage: React.Dispatch<React.SetStateAction<string>>;
  pageContext: PageContext;
}

const View = ({
  setPage,
  pageContext
}: Props) => {
  const router = useRouter()
  const [previewUrl, setPreviewUrl] = useState<string>('')

  return (
    <div className={styles.wrapper}>
      {pageContext?.isNew &&  <Confetti />}
      <div className={styles.buttons}>
        <Button onClick={()=>{setPage('dashboard')}}>
          <div className={styles.buttonInner}>
            <span>
              {`<-`}
            </span>
            Dashboard
          </div>
        </Button>
      </div>

      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.leftInner}>
            <div className={styles.leftInnerSection}>
              <div className={styles.textContainer}>
                {pageContext?.isNew && (
                  <div className={styles.newCondition}>
                    <h2>Congratulations on building your chatbot!</h2>
                  </div>
                )}

                <div className={styles.embedText}>
                  Embed code
                </div>
                <p className={styles.helperText}>
                  Copy and paste the code below to your website
                </p>
              </div>
              <textarea readOnly value={`<script async src="https://chatif.ai/js/chat/${pageContext?.chatAppId}"></script>`} />
              <div className={styles.copyText}>
                Copy embed code
              </div>
            </div>
            <div className={styles.leftInnerSection}>
              <div className={styles.textContainer}>
                <div className={styles.embedText}>
                  Preview your bot
                </div>
                <p className={styles.helperText}>
                  Enter the website you want to preview this chatbot on
                </p>
              </div>
              <div className={styles.previewWrapper}>
                <input type="text" value={previewUrl} onChange={e=>setPreviewUrl(e.target.value.replace('/',''))} placeholder="Website link" />
                <Button className={styles.narrowBtt} onClick={()=>{
                  router.push(`/user/${previewUrl}?appName=${pageContext?.chatAppId}`)
                }}>
                    Preview
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.right}>
          <Chat isStatic chatAppId={pageContext?.chatAppId} />
        </div>
      </div>
    </div>
  );
};

export default View;
