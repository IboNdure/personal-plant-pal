import RandomCareTips from "@/components/RandomCareTips";
import { Player } from "@lottiefiles/react-lottie-player";
import Link from "next/link";
import styled, { keyframes, css } from "styled-components";
import WeatherIcon from "@/components/WeatherIcon";
import { getAllWeatherDescription } from "@/utils/getweatherdeatails";
import Login from "@/components/Login";
import { useSession } from "next-auth/react";

const fixedPlantAnimation = "/animation/plantgrowing.json";

export default function LandingPage({ weatherData }) {
  const { data: session } = useSession();

  return (
    <>
      <LoginContainer>
        <Login />
      </LoginContainer>
      <Cardcontainer>
        {session ? (
          <Card
            $animation={css`
              ${gradientMoveTopLeftToBottomRight}
            `}
          >
            <StyledLink href={"/create"}>
              <p>Create New Plant</p>
            </StyledLink>
          </Card>
        ) : (
          <Card
            $animation={css`
              ${gradientMoveTopLeftToBottomRight}
            `}
          >
            <DeactivatedText>Sign in first</DeactivatedText>
          </Card>
        )}
        <Card
          $animation={css`
            ${gradientMoveTopToBottom}
          `}
        >
          <StyledLink href={"/plants/"}>
            <p>My Plant List</p>
          </StyledLink>
        </Card>
        {session ? (
          <Card
            $animation={css`
              ${gradientMoveTopRightToBottomLeft}
            `}
          >
            <StyledLink href={"/favourites"}>
              <p>My Owned Plants</p>
            </StyledLink>
          </Card>
        ) : (
          <Card
            $animation={css`
              ${gradientMoveTopRightToBottomLeft}
            `}
          >
            <DeactivatedText>Sign in first</DeactivatedText>
          </Card>
        )}
      </Cardcontainer>

      <Cardcontainer>
        <Weathercard>
          <StyledWeatherLink href={"/weatherforecast"}>
            <StyledWeatherbutton>7-Day Forecast</StyledWeatherbutton>
          </StyledWeatherLink>
          <StyledWeatherLink href={"/"}>
            <h2>Current Weather Of Your Location</h2>

            <WindWeatherContainer>
              <p> {weatherData?.temperature}°C</p>
              <WeatherIcon weatherData={weatherData?.weathercode} />
              <p>{getAllWeatherDescription(weatherData?.weathercode)}</p>
            </WindWeatherContainer>

            <HumdityWindContainer>
              <HumidityContainer>
                <P>{weatherData?.humidity}%</P>
                <P>Humidity</P>
              </HumidityContainer>

              <WindContainer>
                <P>{weatherData?.windspeed} km/h</P>
                <P>Wind</P>
              </WindContainer>
            </HumdityWindContainer>
          </StyledWeatherLink>
        </Weathercard>
      </Cardcontainer>

      <Cardcontainer>
        <RandomCareTips />
      </Cardcontainer>

      <FixedAnimation>
        <PlayerPlant
          autoplay
          loop
          src={fixedPlantAnimation}
          speed={0.3}
          aria-hidden="true"
        />
      </FixedAnimation>
    </>
  );
}

const Cardcontainer = styled.section`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
`;

const Card = styled.article`
  width: 25%;
  text-align: center;
  height: 100px;
  justify-content: center;
  display: flex;
  align-items: center;
  border-radius: 10px;
  background: linear-gradient(135deg, #b5cbb2, #1f3528);
  background-size: 200% 200%;
  animation: ${({ $animation }) => $animation} 6s ease infinite;
`;

const gradientMoveTopLeftToBottomRight = keyframes`
  0% { background-position: 0% 0%; }
  50% { background-position: 100% 100%; }
  100% { background-position: 0% 0%; }
`;

const gradientMoveTopToBottom = keyframes`
  0% { background-position: 50% 0%; }
  50% { background-position: 50% 100%; }
  100% { background-position: 50% 0%; }
`;

const gradientMoveTopRightToBottomLeft = keyframes`
  0% { background-position: 100% 0%; }
  50% { background-position: 0% 100%; }
  100% { background-position: 100% 0%; }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: white;
`;

const Weathercard = styled.article`
  margin-top: 35px;
  width: 80%;
  justify-content: center;
  text-align: center;
`;

const StyledWeatherLink = styled(Link)`
  text-decoration: none;
  color: var(--color-text-primary);
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const FixedAnimation = styled.div`
  position: fixed;
  bottom: 50px;
  right: -35px;
  z-index: 100;
  pointer-events: none;
`;

const PlayerPlant = styled(Player)`
  height: 150px;
  width: 150px;
`;

const WindWeatherContainer = styled.section`
  text-decoration: none;
  color: var(--color-text-primary);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  padding: 20px;
  display: flex;
`;

const HumdityWindContainer = styled.section`
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const WindContainer = styled.section`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
`;

const HumidityContainer = styled.section`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
`;

const P = styled.p`
  margin: 3px;
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  width: 100%;
  align-items: center;
  text-align: center;
  justify-content: space-evenly;
  padding: 10px;
`;

const DeactivatedText = styled.p`
  color: white;
`;

const StyledWeatherbutton = styled.button`
  background-color: var(--color-text-primary);
`;
