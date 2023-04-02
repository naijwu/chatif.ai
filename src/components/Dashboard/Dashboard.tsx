import React, { useEffect, useState } from "react";
import Button from "../Button/Button";
import styles from "./Dashboard.module.css";
import DashStats from "./DashStats.png";
import Image from "next/image";
import BotCard from "./botcard/BotCard";

import { ref, onValue } from "firebase/database";
import { db } from "@/utility/firebase";
import { Bot } from "@/utility/types";

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

const Dashboard = ({ setIsCreating }: Props) => {
  const userUID = "Y458AEs1X0MUcqcTduJwBq1WDOh2";
  const [bots, setBots] = useState<Bot[]>([]);
  useEffect(() => {
    onValue(ref(db, `users/${userUID}`), (snapshot) => {
      const data = snapshot.val() || {};
      const botObjects = Object.values(data) as Bot[];
      console.log(botObjects);
      setBots(botObjects);
    });
  }, []);

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
            <BotCard
              key={index}
              {...bot}
              onView={() => {}}
              onCustomize={() => {}}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
