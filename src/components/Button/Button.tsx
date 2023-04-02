import { useRouter } from "next/router";
import styles from "./Button.module.css";

type Props = {
  children: any;
  href?: string;
  className?: string;
  minWidth?: number;
  onClick?: any;
  [x: string | number]: any;
};

const Button = ({ children, href, minWidth, className, disabled, onClick, ...other }: Props) => {
  const router = useRouter();

  return (
    <div
      {...other}
      className={`${styles.button} ${className || ""} ${disabled ? styles.disabled : ''}`}
    
        // no seriously, what the heck is this 
      onClick={onClick ? onClick : () => router.push(href || '')}

      style={
        minWidth
          ? {
              minWidth: `${minWidth}px`,
              textAlign: "center",
            }
          : {}
      }
    >
      {children}
    </div>
  );
};

export default Button;
