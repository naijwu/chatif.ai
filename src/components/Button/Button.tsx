import { useRouter } from "next/router";
import styles from "./Button.module.css";

type Props = {
  children: any;
  href: string;
  className?: string;
  minWidth?: number;
  [x: string | number]: any;
};

const Button = ({ children, href, minWidth, className, ...other }: Props) => {
  const router = useRouter();

  return (
    <div
      {...other}
      className={`${styles.button} ${className || ""}`}
      onClick={() => router.push(href)}
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
