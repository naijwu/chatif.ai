import Button from "@/components/Button/Button";
import React from "react";
import styles from "./BotCard.module.css";

type Props = {
  title: string;
  onView: () => void;
  onCustomize: () => void;
};

const BotCard = ({ title, onView, onCustomize }: Props) => {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.buttons}>
        <Button href="#" className={styles.btt} onClick={onView}>
          View
        </Button>
        <Button href="#" className={styles.btt} onClick={onCustomize}>
          Customize
        </Button>
      </div>
    </div>
  );
};

export default BotCard;
