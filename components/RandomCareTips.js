import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { caretips } from "@/assets/caretips";
import Typewriter from "typewriter-effect";

export default function RandomCareTips({ darkMode }) {
  const [randomTip, setRandomTip] = useState("");

  function getRandomTip() {
    const randomIndex = Math.floor(Math.random() * caretips.length);
    return caretips[randomIndex].tip;
  }

  useEffect(() => {
    setRandomTip(getRandomTip());

    const interval = setInterval(() => {
      setRandomTip(getRandomTip());
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Caretipcard>
      <TipContainer darkMode={darkMode}>
        <Title darkMode={darkMode}>Your Plant Tip of the Day</Title>
        {randomTip && (
          <Typewriter
            key={randomTip}
            onInit={(typewriter) => {
              typewriter.changeDelay(65).typeString(randomTip).start();
            }}
          />
        )}
      </TipContainer>
    </Caretipcard>
  );
}

const Caretipcard = styled.article`
  margin-top: 35px;
  width: 80%;
  height: 200px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

const TipContainer = styled.section`
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  color: ${(props) =>
    props.darkMode
      ? "#ffffff"
      : "#2e4d36"}; /* Weiß im Darkmode und Dunkelgrün im Lightmode */
`;

const Title = styled.h2`
  margin: 0;
  padding: 20px;
  text-align: center;
  position: relative;
  color: ${(props) =>
    props.darkMode
      ? "#ffffff"
      : "#2e4d36"}; /* Weiß im Darkmode und Dunkelgrün im Lightmode */
`;
