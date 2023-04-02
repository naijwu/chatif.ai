import { useEffect, useRef, useState } from "react";
import { ChatCompletionRequestMessage } from "openai";
import styles from "./User.module.css";
import { openai } from "@/utility/openai";
import { ref, onValue } from "firebase/database";
import { db } from "@/utility/firebase";
import { chooseBetweenNodes } from "@/utility/userTraversal";
import { ChatLog } from "@/utility/types";

const SendIcon = () => (
    <svg width="17" height="19" viewBox="0 0 17 19" fill="none" xmlns="http://www.w3.org/2000/svg">
    <mask id="mask0_42_1817" maskUnits="userSpaceOnUse" x="0" y="0" width="17" height="19">
    <rect width="16.5859" height="19" fill="#D9D9D9"/>
    </mask>
    <g mask="url(#mask0_42_1817)">
    <path d="M2.07324 15.8333V3.16663L15.2037 9.49996L2.07324 15.8333ZM3.4554 13.4583L11.6447 9.49996L3.4554 5.54163V8.31246L7.60187 9.49996L3.4554 10.6875V13.4583Z" fill="white"/>
    </g>
    </svg>
)

const User = ({ demoUrl }: { demoUrl?: string }) => {
  const userUID = "Y458AEs1X0MUcqcTduJwBq1WDOh2";
  const appName = "telus-bot";
  const [flatSummaries, setFlatSummaries] = useState([]);
  useEffect(() => {
    onValue(ref(db, `users/${userUID}/${appName}`), (snapshot) => {
      const data = snapshot.val() || [];
      setFlatSummaries(data);
    });
  }, []);

  const questionRef = useRef<HTMLInputElement>(null);
  const [showChat, setShowChat] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [chatHistory, setChatHistory] = useState<ChatLog[]>([
    {
      role: "system",
      content: "you are a helpful, professional, friendly assistant.",
    },
  ]);
  const [chatHistoryToDisplay, setChatHistoryToDisplay] = useState<ChatLog[]>(
    []
  );

  const addQuestionToView = () => {
    const question = questionRef.current?.value || "";
    const updatedChatHistory = JSON.parse(
      JSON.stringify(chatHistoryToDisplay || [])
    );
    updatedChatHistory.push({
      content: question,
      role: "user",
    });
    setChatHistoryToDisplay(updatedChatHistory);
  };

  const addResponseToView = (response: any) => {
    setChatHistoryToDisplay((prev) => prev.concat(response));
  };

  const askGPT = async () => {
    const question = questionRef.current?.value || "";
    if (questionRef.current) {
        questionRef.current.value = ''
    }

    const nodesToSearch = await chooseBetweenNodes(question, flatSummaries);
    const prompt = `${question}\n\nAnswer with the following website content:\n\n${nodesToSearch[0].content}`;

    console.log(prompt);
    const updatedChatHistory = JSON.parse(
      JSON.stringify(chatHistory || [])
    ).concat({
      content: prompt,
      role: "user",
    });

    const response = (
      await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: updatedChatHistory as ChatCompletionRequestMessage[],
      })
    ).data.choices[0].message;

    const respondedChatHistory = JSON.parse(
      JSON.stringify(updatedChatHistory || [])
    ).concat(response);

    setChatHistory(respondedChatHistory);
    addResponseToView(response);
  };

  return (
    <>
      <iframe
        width="100%"
        height="100%"
        className={styles.demoWebsite}
        src={`https://${demoUrl}`}
      />

      <div className={styles.interfaceWrapper}>
        <div className={styles.interface}>
          <div className={`${styles.chat} ${showChat ? styles.opened : ""}`}>
            <div className={styles.guy} onClick={()=>setShowChat(!showChat)}>
                <div className={styles.whiteAvatar}></div>
                chatif.ai
            </div>
            <div className={styles.chatHistory}>
              {chatHistoryToDisplay?.map(
                (item, index) =>
                  item.role !== "system" && (
                    item.role === "user" ? (
                        <div className={`${styles.chatRow} ${styles.right}`}>
                            <div className={`${styles.chatMessage} ${styles.user}`}>
                                {item.content}
                            </div>
                            <div className={styles.avatarWrapper}>
                                {(index + 3 > chatHistoryToDisplay.length) && (
                                    <div className={styles.avatar}></div>
                                )}
                            </div>
                        </div>
                      ) : (
                        <div className={styles.chatRow}>
                            <div className={styles.avatarWrapper}>
                                {(index + 3 > chatHistoryToDisplay.length) && (
                                    <div className={styles.avatar}></div>
                                )}
                            </div>
                            <div className={styles.chatMessage}>
                                {item.content}
                            </div>
                        </div>
                      )
                  )
              )}
              {loading && "typing..."}
            </div>
            <div className={styles.chatBox}>
                <div className={styles.chatBoxInner}>
                    <input type="text" ref={questionRef} />
                    <div
                        className={styles.sendButton}
                        onClick={async () => {
                        addQuestionToView();
                        setLoading(true);
                        await askGPT();
                        setLoading(false);
                        }}>
                            <SendIcon />
                        Send
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default User;
