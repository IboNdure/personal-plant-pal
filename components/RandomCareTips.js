import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { caretips } from "@/assets/caretips";
import LightbulbIcon from "@/public/Icons/lightbulb.svg";

export default function RandomCareTips() {
  const [randomTip, setRandomTip] = useState("");

  function getRandomTip() {
    const randomIndex = Math.floor(Math.random() * caretips.length);
    return caretips[randomIndex].tip;
  }

  useEffect(function () {
    setRandomTip(getRandomTip());

    function updateTip() {
      setRandomTip(getRandomTip());
    }

    const interval = setInterval(updateTip, 10000);

    return function cleanup() {
      clearInterval(interval);
    };
  }, []);

  return (
    <TipContainer>
      {randomTip}
      <IconContainer>
        <LightbulbIcon />
      </IconContainer>
    </TipContainer>
  );
}

const TipContainer = styled.section`
  display: flex;
  position: absolute;
  text-align: center;
  align-items: center;
  padding: 10px;
`;

const IconContainer = styled.div`
  position: relative;
  top: -45px;
  left: -5px;
`;
