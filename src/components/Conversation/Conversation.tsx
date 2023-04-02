import styles from './Conversation.module.css'

const Conversation = ({
    width,
    conversation,
    top,
    left,
    transform
}: {
    width?: number,
    top?: string,
    left?: string,
    transform?: string,
    conversation: any
}) => {

    return (
        <div className={styles.example} style={{
            width,
            top,
            left,
            transform
        }}>
            <div className={styles.exampleHistory}>
                {conversation.map((msg: any, index: number) => msg.role === 'assistant' ? (
                    <div key={index} className={styles.exampleRow}>
                        <div className={styles.avatar}>
                        </div>
                        <div className={styles.message}>
                            {msg.content}
                        </div>
                    </div>
                ) : (
                    <div key={index} className={`${styles.exampleRow} ${styles.right}`}>
                        <div className={styles.message}>
                            {msg.content}
                        </div>
                        <div className={styles.avatar}>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Conversation;