import React from "react";
import Avatar from "../Avatar";
import styles from "./Sidebar.module.css";
import HomeIcon from "../icons/HomeIcon";

const OPTIONS = [
  {
    link: "#",
    icon: <HomeIcon />,
  },
];

const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.brand}>
        <Avatar />
      </div>
      <div className={styles.icons}>
        {OPTIONS.map((linkItem, index) => (
          <div key={index} className={styles.sidebarLink}>
            {linkItem.icon}
          </div>
        ))}
      </div>
      <div className={styles.userIcon}></div>
    </div>
  );
};

export default Sidebar;
