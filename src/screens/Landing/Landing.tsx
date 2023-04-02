import Button from "@/components/Button/Button";
import { useRouter } from "next/router";
import styles from "./Landing.module.css";
import landingtopImg from "@/components/landingTop.svg";
import Image from "next/image";

import landingMid from "@/components/landingMid.svg";
import landingBottom from "@/components/landingBottom.svg";

const Landing = () => {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.navigation}>
        <div className={styles.navLeft}>
          <div className={styles.brand}>chatif.ai</div>
        </div>
        <div className={styles.navCenter}>
          <div className={styles.links}>
            <div className={styles.link}>how it works</div>
            <div className={styles.link}>features</div>
            <div className={styles.link}>pricing</div>
          </div>
        </div>
        <div className={styles.navRight}>
          <Button href={"/client"}>get started</Button>
        </div>
      </div>

      <div className={styles.hero}>
        <h1>{`All your website's information, accessible in one message.`}</h1>
        <p>
          {`Generate a custom chatbot for your website with just one click using our innovative chatbot generator tool. Our AI technology creates personalized chatbots to engage with visitors, enhance the user experience, and increase customer satisfaction. Try it today!`}
        </p>
        <Button href={"/client"} minWidth={150}>
          try it now
        </Button>
      </div>

      <div className={styles.immerse}>
        <Image className={styles.topImg} src={landingtopImg} alt="" />
      </div>

      <Image className={styles.midImg} src={landingMid} alt="" />
      <Image className={styles.bottomImg} src={landingBottom} alt="" />

      {/* <div className={styles.featuresWrapper}>
                <h2>Features</h2>
                <div className={styles.featuresGrid}>
                    {[
                        {
                            title: 'feature',
                            content: '123',
                        },
                        {
                            title: 'feature',
                            content: '123',
                        },
                        {
                            title: 'feature',
                            content: '123',
                        },
                        {
                            title: 'feature',
                            content: '123',
                        }
                    ].map((feature, index) => (
                        <div className={styles.feature} key={index}>
                            <div className={styles.featureImage}>
                            </div>
                            <h3 className={styles.featureTitle}>
                                {feature.title}
                            </h3>
                            <p className={styles.featureInfo}>
                                {feature.content}
                            </p>
                        </div>
                    ))}
                </div>
            </div> */}
    </div>
  );
};

export default Landing;
