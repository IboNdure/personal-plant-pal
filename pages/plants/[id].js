import { useRouter } from "next/router";
import useSWR from "swr";
import Image from "next/image";
import styled from "styled-components";
import { useState } from "react";
import PlantForm from "@/components/PlantForm";
import EditIcon from "@/public/Icons/pencil-fill.svg";
import TrashIcon from "@/public/Icons/delete-bin-5-fill.svg";

import LowWaterdropIcon from "@/public/Icons/drop-line.svg";
import MediumWaterdropIcon from "@/public/Icons/contrast-drop-2-line.svg";
import HighWaterdropIcon from "@/public/Icons/drop-fill.svg";

import FullSunIcon from "@/public/Icons/sun-fill.svg";
import PartialShadeIcon from "@/public/Icons/sun-foggy-fill.svg";
import FullShadeIcon from "@/public/Icons/sun-cloudy-fill.svg";
import FertiliserIcon from "@/public/Icons/leaf-fill.svg";
import LocationIcon from "@/public/Icons/map-pin-2-line.svg";
import TemperatureIcon from "@/public/Icons/temp-cold-line.svg";
import HumidityIcon from "@/public/Icons/water-percent-line.svg";
import AirDraftIcon from "@/public/Icons/windy-fill.svg";
import CatIcon from "@/public/Icons/cat.svg";
import DogIcon from "@/public/Icons/dog.svg";
import CareIcon from "@/public/Icons/award-line.svg";
import PlantReminder from "@/components/PlantReminder";
import { useSession } from "next-auth/react";
import Link from "next/link";
import BackIcon from "@/public/Icons/arrow-left-s-line.svg";
import { Player } from "@lottiefiles/react-lottie-player";

const weatherAnimation = "/animation/weather.json";

const lightNeedIcon = {
  "Full Sun": <FullSunIcon />,
  "Partial Shade": <PartialShadeIcon />,
  "Full Shade": <FullShadeIcon />,
};

const waterNeedIcon = {
  Low: <LowWaterdropIcon />,
  Medium: <MediumWaterdropIcon />,
  High: <HighWaterdropIcon />,
};

export default function PlantDetails({
  reminders,
  onAddReminder,
  onEditReminder,
  onDeleteReminder,
}) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const { data: session } = useSession();

  const router = useRouter();
  const { id } = router.query;

  const { data: plant, mutate } = useSWR(id ? `/api/plants/${id}` : null);

  if (!router.isReady) return null;

  if (!plant) return <p>Loading...</p>;

  const plantReminders = Array.isArray(reminders)
    ? reminders.filter((reminder) => reminder.plantId === plant._id)
    : [];

  function handleDelete() {
    setShowConfirmation(true);
  }
  function handleCancelDelete() {
    setShowConfirmation(false);
  }

  async function handleConfirmDelete() {
    const response = await fetch(`/api/plants/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      router.push("/plants");
    }
  }

  function handleEditClick() {
    setShowEdit(true);
  }

  async function handleEdit(updatedPlant) {
    const response = await fetch(`/api/plants/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedPlant),
    });

    if (response.ok) {
      mutate();
      setShowEdit(false);
    }
  }

  function toggleUploadImage() {
    setUploadOpen(!uploadOpen);
  }

  async function handleImageUpload(event) {
    event.preventDefault();
    const file = event.target.image.files[0];

    const maxSizeMB = 5;
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(
        `Your image is larger than ${maxSizeMB}MB. Please select a smaller image.`
      );
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        alert("Image upload failed. Please try again.");
        return;
      }

      const data = await response.json();
      const newImageUrl = data.secure_url;

      const updatedPlant = { ...plant, imageUrl: newImageUrl };

      const updateResponse = await fetch(`/api/plants/${plant._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPlant),
      });

      if (updateResponse.ok) {
        mutate();
        setUploadOpen(false);
      } else {
        alert("Failed to update plant with new image. Please try again.");
      }
    } catch (error) {
      alert("An unexpected error occurred. Please try again.");
    }
  }

  if (!session) {
    return (
      <>
        <h1>Details Page</h1>
        <StyledCard>
          <p>This plant is snoozing! Log in to wake it up.</p>
          <div>
            <PlayerWeatherCare
              autoplay
              loop
              src={weatherAnimation}
              aria-hidden="true"
            />
          </div>
        </StyledCard>
      </>
    );
  }
  return (
    <>
      <StyledLink href={"/plants"} aria-label="go to plantlist">
        <BackIcon />
      </StyledLink>
      <h1>Details Page</h1>

      {!showEdit ? (
        <CardDetails>
          <Image
            alt={`image of ${plant.name}`}
            src={plant.imageUrl || "/assets/empty.avif"}
            width={200}
            height={200}
          />

          <ButtonUpload onClick={toggleUploadImage}>Upload Image</ButtonUpload>
          {uploadOpen && (
            <UploadForm
              onSubmit={handleImageUpload}
              encType="multipart/form-data"
            >
              <UploadPopUp>
                <h3>Upload Your Plant</h3>

                <label htmlFor="file-upload"></label>
                <StyledFileInput
                  type="file"
                  id="file-upload"
                  name="image"
                  accept=".jpg, .jpeg, .png"
                  required
                />

                <ButtonContainer>
                  <ButtonSave type="submit">Upload</ButtonSave>
                  <ButtonCancel onClick={toggleUploadImage}>
                    Cancel
                  </ButtonCancel>
                </ButtonContainer>
              </UploadPopUp>
            </UploadForm>
          )}

          <h2>{plant.name}</h2>
          <h3>{plant.botanicalName}</h3>

          {plant.description && (
            <DescriptionContainer>
              <p>{plant.description}</p>
            </DescriptionContainer>
          )}

          <AllIconsContainer>
            <IconContainer>
              {lightNeedIcon[plant.lightNeed]}
              <span>{plant.lightNeed}</span>
            </IconContainer>

            <IconContainer>
              {waterNeedIcon[plant.waterNeed]}
              <span>{plant.waterNeed} Water Need</span>
            </IconContainer>

            {plant.fertiliserSeason && plant.fertiliserSeason.length > 0 && (
              <IconContainer>
                <FertiliserIcon />
                {plant.fertiliserSeason.map((season) => (
                  <span key={season}>{season}</span>
                ))}
              </IconContainer>
            )}
          </AllIconsContainer>

          <AllIconsContainer>
            {plant.catPoisonous && (
              <IconContainer>
                <CatIcon />
                {plant.catPoisonous}
              </IconContainer>
            )}

            {plant.dogPoisonous && (
              <IconContainer>
                <DogIcon />
                {plant.dogPoisonous}
              </IconContainer>
            )}
          </AllIconsContainer>

          {(plant.careLevel ||
            plant.location ||
            plant.humidity ||
            plant.temperature ||
            plant.airDraftIntolerance) && <h3>Additional Infos</h3>}
          <AdditionalContainer>
            {plant.careLevel && (
              <IconContainer>
                <CareIcon />
                <span>{plant.careLevel}</span>
              </IconContainer>
            )}

            {plant.location && (
              <IconContainer>
                <LocationIcon />
                <span>{plant.location}</span>
              </IconContainer>
            )}
            {plant.humidity && (
              <IconContainer>
                <HumidityIcon />
                <span>{plant.humidity} Humidity</span>
              </IconContainer>
            )}

            {plant.temperature && (
              <IconContainer>
                <TemperatureIcon />
                <span>{plant.temperature}</span>
              </IconContainer>
            )}
            {plant.airDraftIntolerance && (
              <IconContainer>
                <AirDraftIcon />
                <span>Airdraft Sensitivity: {plant.airDraftIntolerance}</span>
              </IconContainer>
            )}
          </AdditionalContainer>

          <section>
            {plant.owner && (
              <>
                <ButtonEdit onClick={handleEditClick}>
                  <EditIcon />
                </ButtonEdit>

                {!showConfirmation ? (
                  <ButtonDeleteIcon onClick={handleDelete}>
                    <TrashIcon />
                  </ButtonDeleteIcon>
                ) : (
                  <>
                    <p>Are you sure?</p>
                    <ButtonCancel onClick={handleCancelDelete}>
                      Cancel
                    </ButtonCancel>
                    <ButtonDelete onClick={handleConfirmDelete}>
                      Delete
                    </ButtonDelete>
                  </>
                )}
              </>
            )}
          </section>
        </CardDetails>
      ) : (
        <PlantForm
          initialData={plant}
          onSubmitPlant={handleEdit}
          onToggleForm={() => setShowEdit(false)}
          isEditMode={true}
        />
      )}

      <PlantReminder
        plant={plant}
        reminders={plantReminders}
        showPopup={showPopup}
        setShowPopup={setShowPopup}
        onAddReminder={onAddReminder}
        onEditReminder={onEditReminder}
        onDeleteReminder={onDeleteReminder}
      />
    </>
  );
}

const StyledLink = styled(Link)`
  position: absolute;
  left: 30px;
  top: 147px;
  color: var(--color-text-primary);
`;
const CardDetails = styled.article`
  padding: 10px 10px 30px;
  margin: 20px 38px 23px 35px;

  @media (min-width: 720px) {
    width: 50%;
    margin: 20px auto 0 auto;
  }
`;

const ButtonEdit = styled.button`
  color: var(--color-button-favourite);
  margin: 5px;
`;

const ButtonDeleteIcon = styled.button`
  color: var(--color-button-favourite);
  margin: 5px;
`;

const ButtonDelete = styled.button`
  background-color: var(--color-button-delete);
  margin: 5px;

  &:hover {
    background-color: var(--color-button-delete-hover);
  }
`;

const ButtonCancel = styled.button`
  background-color: var(--color-button-cancel);
  margin: 5px;

  &:hover {
    background-color: var(--color-button-cancel-hover);
  }
`;

const IconContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  text-align: center;

  span {
    font-size: 0.9rem;
    color: var(--color-text-primary);
    text-align: center;
  }
`;

const AllIconsContainer = styled.div`
  display: flex;
  gap: 50px;
  justify-content: center;
  margin: 0 30px 0 30px;
`;

const AdditionalContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  justify-items: center;
  align-items: center;

  & > :last-child:nth-child(odd) {
    grid-column: span 2;
    justify-self: center;
  }
`;

const DescriptionContainer = styled.section`
  margin: 0 30px 0 30px;

  @media (min-width: 720px) {
    margin: 0 100px 0 100px;
  }
`;

const UploadForm = styled.form`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  z-index: 1000;
  border-radius: 0;
`;

const UploadPopUp = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 80%;
  max-width: 400px;
  max-height: 50vh;
  overflow-y: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
`;

const StyledFileInput = styled.input`
  background-color: lightgrey;
  width: 200px;
`;

const ButtonUpload = styled.button`
  background-color: var(--color-text-primary);

  &:hover {
    background-color: var(--color-button-add-hover);
  }
`;

const ButtonSave = styled.button`
  background-color: var(--color-button-save);
  margin: 5px;

  &:hover {
    background-color: var(--color-button-save-hover);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 5px;
`;
const StyledCard = styled.article`
  padding: 10px 10px 30px;
  margin: 20px 38px 23px 35px;
  text-align: center;
`;

const PlayerWeatherCare = styled(Player)`
  height: 100px;
  width: 100px;
`;
