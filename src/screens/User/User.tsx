import { useState } from 'react'
import { ChatCompletionRequestMessage } from "openai";
import styles from './User.module.css'
import { openai } from '@/utility/openai';
import { speechToText, sttFromMic, textToSpeech } from '@/utility/speechServices';

const User = ({
    demoUrl
}: {
    demoUrl?: string
}) => {
    const [showChat, setShowChat] = useState<boolean>(false)

    const [question, setQuestion] = useState<string>('')
    const [isUsingSpeechTT, setIsUsingSpeechTT] = useState<boolean>(false)
    const [isUsingTextTS, setIsUsingTextTS] = useState<boolean>(false)

    const [replyAudio, setReplyAudio] = useState<any>()

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

    // Adding GPT's response
    const updateChat = async (updatedChatHistory: any) => {
        const response = await openai.createChatCompletion({ 
            model: "gpt-3.5-turbo",
            messages: updatedChatHistory as ChatCompletionRequestMessage[]
        })

        const respondedChatHistory = JSON.parse(JSON.stringify(updatedChatHistory || []))
        const assistantMessage = response.data.choices[0].message
        respondedChatHistory.push(assistantMessage)
        setChatHistory(respondedChatHistory)

        setLoading(false)
    }

    // Adding user's message
    const addChat = async (question: string) => {
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

    // for speech to text (taking user's audio)
    async function handleAudioFileChange(event: any) {
        const audioFile = event.target.files[0];
        await speechToText(audioFile)
          .then(response => {
            addChat(response.data)
          })
          .catch(error => {
            console.error(error);
          });
    }
    
    // for text to speech (reading out GPT)
    async function handleTextToSpeech(
        // text: string
    ) {
        const text = "Hi, this is a test if this will work"

        const response: any = await textToSpeech(text)

        if (!response) {
            console.error('error')
            return
        }
        
        const linkToAudio = URL.createObjectURL(new Blob([response.data], { type: 'audio/mpeg' }))
        console.log(linkToAudio)
        setReplyAudio(linkToAudio);
    }

    return (
        <>
            <iframe width="100%" height="100%" className={styles.demoWebsite} src={`https://${demoUrl}`} />

            <div className={styles.interfaceWrapper}>
                <div className={styles.interface}>
                    <div className={styles.accessibility}>
                        <div>
                            Enable speech to text:
                            <input type="checkbox" checked={isUsingSpeechTT} onChange={()=>{setIsUsingSpeechTT(!isUsingSpeechTT)}} />
                        </div>
                        <div>
                            Enable text to speech:
                            <input type="checkbox" checked={isUsingTextTS} onChange={()=>{setIsUsingTextTS(!isUsingTextTS)}} />
                        </div>
                    </div>


                    {replyAudio && <audio controls src={URL.createObjectURL(new Blob([replyAudio], { type: 'audio/mpeg' }))} />}
                    <div onClick={handleTextToSpeech}>Click me for text to speech sample</div>

                    <input type="file" accept="audio/mp3" onChange={handleAudioFileChange} />
                    <div onClick={sttFromMic}>speak</div>


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
                            <button onClick={()=>addChat(question)}>
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