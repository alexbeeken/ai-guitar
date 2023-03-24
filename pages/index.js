import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import React from 'react'
import Guitar, { getRenderFingerSpn } from 'react-guitar'
import { standard } from "react-guitar-tunings";

export default function Home() {
  const [chordInput, setAnimalInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chord: chordInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      const noSpaces = data.result.replace(/\s+/g, "").replace(/\[/g, "").replace(/\]/g, "");
      const frets = noSpaces.split(',').map(num => parseInt(num, 10))

      setResult(frets);
      setAnimalInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <img src="/dog.png" className={styles.icon} />
        <h3>Have chatGPT show you any guitar chord!</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="chord"
            placeholder="Enter a chord like: G, C7, Fmaj7, etc..."
            value={chordInput}
            onChange={(e) => setAnimalInput(e.target.value)}
          />
          <input type="submit" value="Generate chart" />
        </form>
        <div className={styles.guitar}>
          <Guitar
            renderFinger={getRenderFingerSpn(standard)}
            strings={result}
          />
        </div>
      </main>
    </div>
  );
}
