import { useState } from 'react'
import styles from './User.module.css'

const DEMO_WEBSITE_URL = "https://www.jaewuchun.com"
const OPEN_AI_KEY = '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'

const User = () => {
    const [showChat, setShowChat] = useState<boolean>(false)

    return (
        <>
            <iframe width="100%" height="100%" className={styles.demoWebsite} src={DEMO_WEBSITE_URL} />

            <div className={styles.interfaceWrapper}>

                <div className={styles.interface}>
                    <div className={`${styles.chat} ${showChat ? styles.opened : ''}`}>
                        hi
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