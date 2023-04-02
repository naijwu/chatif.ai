import { useEffect, useRef, useState } from "react";
import { ChatCompletionRequestMessage } from "openai";
import styles from "./User.module.css";
import { openai } from "@/utility/openai";
import { ref, onValue } from "firebase/database";
import { db } from "@/utility/firebase";
import { chooseBetweenNodes } from "@/utility/userTraversal";
import { ChatLog } from "@/utility/types";

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

  const questionRef = useRef<HTMLTextAreaElement>(null);
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

    const nodeToSearch = await chooseBetweenNodes(question, flatSummaries);
    const prompt = `${question}\n\nAnswer with the following website content:\n\n${nodeToSearch?.content}`;
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
            <div className={styles.chatHistory}>
              {chatHistoryToDisplay?.map(
                (item, index) =>
                  item.role !== "system" && (
                    <div key={index}>
                      {item.role === "user" ? "(me)" : "(bot)"} {item.content}
                    </div>
                  )
              )}
              {loading && "typing..."}
            </div>
            <div className={styles.chatBox}>
              <textarea ref={questionRef} />
              <button
                onClick={async () => {
                  addQuestionToView();

                  setLoading(true);
                  await askGPT();
                  setLoading(false);
                }}
              >
                Send
              </button>
            </div>
          </div>
          <div className={styles.guy}>Chat</div>
        </div>
      </div>
    </>
  );
};

export default User;
