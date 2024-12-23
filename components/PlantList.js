import PlantCard from "./PlantCard";

export default function PlantList({
  plants,
  toggleFavourite,
  reminders,
  showWeatherAlert,
  openWeatherAlertModal,
  code,
}) {
  if (!plants || plants.length === 0)
    return (
      <p>
        There are no plants here yet! Start adding some to create your own plant
        collection.
      </p>
    );
  return (
    <ul>
      {plants.map((plant) => {
        const plantReminders = Array.isArray(reminders)
          ? reminders.filter(
              (reminder) => reminder.plantId === plant._id && !reminder.isDone
            )
          : [];

        return (
          <li key={plant._id}>
            <PlantCard
              plant={plant}
              toggleFavourite={toggleFavourite}
              hasActiveReminder={plantReminders?.length > 0}
              showWeatherAlert={showWeatherAlert}
              openWeatherAlertModal={openWeatherAlertModal}
              code={code}
            />
          </li>
        );
      })}
    </ul>
  );
}
