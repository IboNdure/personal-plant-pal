import GlobalStyle from "../styles";
import useLocalStorageState from "use-local-storage-state";
import { plants } from "@/assets/plants";
import Layout from "@/components/Layout";
const initialPlants = plants;

export default function App({ Component, pageProps }) {
  const [plants, setPlants] = useLocalStorageState("favourites", {
    defaultValue: initialPlants,
  });

  function toggleFavourite(id) {
    setPlants((prevPlants) =>
      prevPlants.map((plant) =>
        plant.id === id ? { ...plant, isFavourite: !plant.isFavourite } : plant
      )
    );
  }

  return (
    <>
      <Layout>
        <GlobalStyle />
        <Component
          {...pageProps}
          plants={plants}
          toggleFavourite={toggleFavourite}
        />
      </Layout>
    </>
  );
}
