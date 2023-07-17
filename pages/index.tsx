/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "../styles/Home.module.css";
import Script from "next/script";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [scrollWidth, setScrollWidth] = useState(0);
  useEffect(() => {
    if (window) {
      window.addEventListener("scroll", () => {
        console.log("????");
      });
    }
  }, []);
  return (
    <>
      <div
        className={styles.scroll}
        style={{
          background: `linear-gradient(90deg, rgba(144,138,255,1) ${scrollWidth}%, rgb(255, 255, 255) 0%)`,
        }}
      ></div>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.slide}>
            <div className={styles.test}>TEST</div>
          </div>
          <div className={styles.slide}>
            <div className={styles.test}>TEST</div>
          </div>
          <div className={styles.slide}>
            <div className={styles.test}>TEST</div>
          </div>
        </div>
      </div>
    </>
  );
}
