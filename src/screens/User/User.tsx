
import styles from "./User.module.css";
import Chat from "@/components/Chat/Chat";
import { useRouter } from "next/router";
import Button from "@/components/Button/Button";

const User = ({ demoUrl }: { demoUrl?: string }) => {
    const router = useRouter()
    const routeArray = router.asPath.split('?')
    let chatAppId
    if(routeArray.length > 1 && routeArray[1].includes('appName')) {
        chatAppId = routeArray[1].split('=')[1]
    }

  return (
    <>
        <div className={styles.banner}>
            <div className={styles.name}>
                chatif.ai
            </div>
            <Button href="/client">
                Finish preview
            </Button>
        </div>
      <iframe
        width="100%"
        className={styles.demoWebsite}
        src={`https://${demoUrl}`}
      />
      
      <Chat chatAppId={chatAppId} />
    </>
  );
};

export default User;
