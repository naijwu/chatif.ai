import { useState } from 'react'
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
import styles from './User.module.css'

const User = ({
    demoUrl
}: {
    demoUrl?: string
}) => {
    const [showChat, setShowChat] = useState<boolean>(false)

    const configuration = new Configuration({
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const [question, setQuestion] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)

    const [chatHistory, setChatHistory] = useState<{
        content: string,
        role: 'system' | 'user' | 'assistant'
    }[]>([
        {
            role: 'system',
            content: "you are a helpful, witty, friendly assistant."
        }
    ])

    const updateChat = async (updatedChatHistory: any) => {
        const response = await openai.createChatCompletion({ 
            model: "gpt-3.5-turbo",
            messages: updatedChatHistory as ChatCompletionRequestMessage[]
        })

        const respondedChatHistory = JSON.parse(JSON.stringify(updatedChatHistory || []))
        respondedChatHistory.push(response.data.choices[0].message)
        setChatHistory(respondedChatHistory)

        setLoading(false)
    }

    const addChat = async () => {
        const updatedChatHistory = JSON.parse(JSON.stringify(chatHistory || []))
        updatedChatHistory.push({
            content: question,
            role: 'user'
        })
        setQuestion('')
        setChatHistory(updatedChatHistory)
        setLoading(true)

        await updateChat(updatedChatHistory)
    }

    return (
        <>
            <iframe width="100%" height="100%" className={styles.demoWebsite} src={`https://${demoUrl}`} />

            <div className={styles.interfaceWrapper}>

                <div className={styles.interface}>
                    <div className={`${styles.chat} ${showChat ? styles.opened : ''}`}>
                        <div className={styles.chatHistory}>
                            {chatHistory?.map((item, index) => item.role !== 'system' && (
                                <div key={index}>
                                    {item.role === 'user' ? '(me)' : '(bot)'} {item.content}
                                </div>
                            ))}
                            {loading && 'typing...'}
                        </div>
                        <div className={styles.chatBox}>
                            <textarea value={question} onChange={e=>setQuestion(e.target.value)} />
                            <button onClick={addChat}>
                                Send
                            </button>
                        </div>
                    </div>
                    <div className={styles.guy}>
                        Chat
                    </div>
                </div>
            </div>
        </>
    )
}

export default User;