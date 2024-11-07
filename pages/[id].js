import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import styled from "styled-components";
import { useState } from "react";

const lightNeedIcon = {
  "Full Sun": "☀️☀️☀️☀️",
  "Partial Shade": "☀️☀️☀️",
  Shade: "☀️☀️",
  "Full Shade": "☀️",
};

const waterNeedIcon = {
  Low: "💧",
  Medium: "💧💧",
  High: "💧💧💧",
};

const seasonIcons = {
  Spring: "🌱",
  Summer: "🐝",
  Fall: "🍂",
  Winter: "❄️",
};

export default function PlantDetails({ plants, onDeletePlant, onEditPlant }) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  function handleDelete() {
    setShowConfirmation(true);
  }
  function handleCancelDelete() {
    setShowConfirmation(false);
  }
  function handleConfirmDelete() {
    onDeletePlant(plant.id);
    setShowConfirmation(false);
  }
  function handleEdit() {
    onEditPlant(updatePlant);
    setShowEdit(false);
  }
  function handleEditClick() {
    setShowEdit(true);
  }
  const router = useRouter();
  const { id } = router.query;

  if (!router.isReady) return null;

  const plant = plants.find((plant) => plant.id === id);

  if (!plant) return <p>Plant not found</p>;

  return (
    <>
      <Link href="/">Back</Link>
      {!isEditing ? (
        <Container>
          <h1>Details Page</h1>
          <RoundImage
            alt={image of ${plant.name}}
            src={plant.imageUrl || "/assets/empty.avif"}
            width={200}
            height={200}
          />
          <h2>{plant.name}</h2>
          <p>{plant.botanicalName}</p>
          <p>{plant.description}</p>
          <p>
            Light: {lightNeedIcon[plant.lightNeed]} {plant.lightNeed}
          </p>
          <p>
            Water need: {waterNeedIcon[plant.waterNeed]} {plant.waterNeed}
          </p>
          <p>
            Fertiliser season:
            {plant.fertiliserSeason.map((season) => (
              <span key={season}>
                {seasonIcons[season]} {season}{" "}
              </span>
            ))}
          </p>
<section>
            <button onClick={handleEditClick}>Edit</button>
            {!showConfirmation ? (
              <button onClick={handleDelete}>Delete</button>
            ) : (
              <>
                <p>Are you sure?</p>
                <button onClick={handleCancelDelete}>Cancel</button>
                <button onClick={handleConfirmDelete}>Delete</button>
              </>
            )}
          </section>
        </Container>
      ) : (
        // Render the form for editing with pre-filled data
        <PlantForm
          initialData={plant}
          onSubmitPlant={handleEditPlant} // Callback to save edited plant
          onToggleForm={() => setIsEditing(false)} // Close form on cancel
        />
      )}
    </>
  );
}

const Container = styled.article`
  border: 2px solid black;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  padding: 10px 10px 30px;
  margin: 20px 38px 23px 35px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
`;

const RoundImage = styled(Image)`
  border-radius: 100%;
`;
