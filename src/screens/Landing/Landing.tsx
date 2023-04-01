import { useRouter } from 'next/router'
import styles from './Landing.module.css'

const Landing = () => {
    const router = useRouter()

    return (
        <div className={styles.container}>
            <div className={styles.navigation}>
                <div className={styles.brand}>
                    chatif.ai
                </div>
                <div className={styles.links}>
                    <div className={styles.link}>
                        how it works
                    </div>
                    <div className={styles.link}>
                        pricing
                    </div>
                </div>
                <div className={styles.button} onClick={()=>router.push('/client')}>
                    get started
                </div>
            </div>

            <div className={styles.hero}>
                <h1>{`Generate your website's chatbot in one click`}</h1>
            </div>
        </div>
    )
}

export default Landing;