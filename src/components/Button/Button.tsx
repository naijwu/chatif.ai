import { useRouter } from 'next/router'
import styles from './Button.module.css'

const Button = ({ children, href, minWidth }: { children: any, href: string, minWidth?: number }) => {
    const router = useRouter()

    return (
        <div className={styles.button} onClick={()=>router.push(href)} style={minWidth ? {
            minWidth: `${minWidth}px`,
            textAlign: 'center'
        } : {}}>
            {children}
        </div>
    )
}

export default Button