import React from "react";
import styles from "./View.module.css";

const View = () => {
  return (
    <div className={styles.container}>
      <div className={styles.left}>Left</div>
      <div className={styles.right}>Right</div>
    </div>
  );
};

export default View;
