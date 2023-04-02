import React from "react";
import Button from "../Button/Button";
import styles from "./Dashboard.module.css";
import DashStats from "./DashStats.png";
import Image from "next/image";
import BotCard from "./botcard/BotCard";

const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

type Props = {
  setIsCreating: React.Dispatch<React.SetStateAction<boolean>>;
};

const bots = [
  {
    title: "Telus Bot",
    onView: () => {},
    onCustomize: () => {},
  },
  {
    title: "Elections Canada Chatbot",
    onView: () => {},
    onCustomize: () => {},
  },
];

const Dashboard = ({ setIsCreating }: Props) => {
  return (
    <div className={styles.container}>
      <h2>Dashboard</h2>
      <div className={styles.buttons}>
        <Button href="#">
          <div
            className={styles.buttonInner}
            onClick={() => {
              setIsCreating(true);
            }}
          >
            <PlusIcon />
            New chatbot
          </div>
        </Button>
      </div>

      <Image src={DashStats} alt="" />

      <div className={styles.botList}>
        <h3 className={styles.subheading}>Your Chatbots</h3>
        <div className={styles.botCards}>
          {bots.map((bot, index) => (
            <BotCard key={index} {...bot} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
