import { useEffect, useRef, useState } from "react";
import { ChatCompletionRequestMessage } from "openai";
import styles from "./Chat.module.css";
import { openai } from "@/utility/openai";
import { ref, onValue } from "firebase/database";
import { db } from "@/utility/firebase";
import { chooseBetweenNodes } from "@/utility/userTraversal";
import { ChatLog } from "@/utility/types";
import thinkingState from './blobanimation.svg'
import Image from "next/image";

const SendIcon = () => (
  <svg
    width="17"
    height="19"
    viewBox="0 0 17 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <mask
      id="mask0_42_1817"
      maskUnits="userSpaceOnUse"
      x="0"
      y="0"
      width="17"
      height="19"
    >
      <rect width="16.5859" height="19" fill="#D9D9D9" />
    </mask>
    <g mask="url(#mask0_42_1817)">
      <path
        d="M2.07324 15.8333V3.16663L15.2037 9.49996L2.07324 15.8333ZM3.4554 13.4583L11.6447 9.49996L3.4554 5.54163V8.31246L7.60187 9.49996L3.4554 10.6875V13.4583Z"
        fill="currentColor"
      />
    </g>
  </svg>
);

type Props = {
    isStatic?: boolean,
    chatAppId?: string
}

const Chat = ({
    isStatic,
    chatAppId
}: Props) => {

    const chatBottomRef = useRef<HTMLDivElement>(null)

    function scrollToBottomChat() {
        if (chatBottomRef.current) {
            chatBottomRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }

  const userUID = "Y458AEs1X0MUcqcTduJwBq1WDOh2";
  const appName = chatAppId || 'stronger-bc';
  const [flatSummaries, setFlatSummaries] = useState([]);
  useEffect(() => {
    onValue(ref(db, `users/${userUID}/${appName}/pages`), (snapshot) => {
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
      questionRef.current.value = "";
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

  useEffect(() => {
    scrollToBottomChat()
  }, [chatHistoryToDisplay])

  return (
    <>
      <div className={`${styles.interfaceWrapper} ${isStatic ? styles.static : ''}`}>
        <div className={styles.interface}>
          <div className={`${styles.chat} ${(showChat || isStatic) ? styles.opened : ""}`}>
            <div className={styles.guy} onClick={() => setShowChat(isStatic || !showChat)}>
              <div className={styles.whiteAvatar}></div>
              <span className={styles.branding}>chatif.ai</span>
                {appName && `(${appName})`}
            </div>
            <div className={styles.chatHistory}>
              {chatHistoryToDisplay.length === 0 ? (
                <div className={styles.beginningOfChat}>
                    {`Hey! We're so glad you're here. `}
                    <br/><br/>
                    {`You can start by asking anything about everything on this site. This product is in beta so you may experience minimal bugs.`}
                </div>
              ) : chatHistoryToDisplay?.map(
                (item, index) =>
                  item.role !== "system" &&
                  (item.role === "user" ? (
                    <div className={`${styles.chatRow} ${styles.right}`}>
                      <div className={`${styles.chatMessage} ${styles.user}`}>
                        {item.content}
                      </div>
                      <div className={styles.avatarWrapper}>
                        {index + 3 > chatHistoryToDisplay.length && (
                          <div className={styles.avatar}></div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className={styles.chatRow}>
                      <div className={styles.avatarWrapper}>
                        {index + 3 > chatHistoryToDisplay.length && (
                          <div className={styles.avatar}></div>
                        )}
                      </div>
                      <div className={styles.chatMessage}>{item.content}</div>
                    </div>
                  ))
              )}
              <div className={`${styles.thinkingContainer} ${loading ? styles.show : ''}`}>
                  <Image fill src={thinkingState} alt="loading" />
              </div>
              <div ref={chatBottomRef}></div>
            </div>
            <div className={styles.chatBox}>
              <div className={styles.chatBoxInner}>
                <input type="text" ref={questionRef} />
                <div
                  className={`${styles.sendButton} ${loading ? styles.disabled : ''}`}
                  onClick={async () => {
                    if(loading) return
                    addQuestionToView();
                    setLoading(true);
                    await askGPT();
                    setLoading(false);
                  }}
                >
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

export default Chat;
