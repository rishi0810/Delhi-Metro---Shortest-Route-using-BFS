// Fetch the JSON data from the external file
fetch("stations.json")
  .then((response) => response.json())
  .then((data) => {
    // Store the fetched data in a global variable
    window.metroStationsJSON = data;
    // Populate datalist with station names
    const stationList = document.getElementById("stations");
    Object.keys(data.stations).forEach((station) => {
      const option = document.createElement("option");
      option.value = station;
      stationList.appendChild(option);
    });
  })
  .catch((error) => console.error("Error loading the JSON file:", error));

function calculate() {
  // Check if the data has been loaded
  if (!window.metroStationsJSON) {
    alert("Station data is still loading. Please try again in a moment.");
    return;
  }

  const sourceStation = document.getElementById("source").value;
  const destinationStation = document.getElementById("destination").value;

  if (sourceStation === destinationStation) {
    alert(
      "The source and destination are the same, please select a different destination station"
    );
    return;
  }

  if (sourceStation === "" || destinationStation === "") {
    alert("Please select source and destination stations.");
    return;
  }

  const visited = {};
  const queue = [[sourceStation]];
  let foundPath = null;

  while (queue.length > 0) {
    const path = queue.shift();
    const currentStation = path[path.length - 1];

    if (currentStation === destinationStation) {
      foundPath = path;
      break;
    }

    visited[currentStation] = true;

    for (const neighbor in window.metroStationsJSON.stations[currentStation]) {
      if (!visited[neighbor]) {
        const newPath = [...path, neighbor];
        queue.push(newPath);
      }
    }
  }

  if (!foundPath) {
    alert("No path found between the selected stations.");
    return;
  }

  const fare = foundPath.length - 1;
  let finalFare = 0;
  switch (true) {
    case fare <= 5:
      finalFare = 10;
      break;
    case fare > 5 && fare <= 12:
      finalFare = 15;
      break;
    case fare > 12 && fare <= 20:
      finalFare = 30;
      break;
    case fare > 20 && fare <= 30:
      finalFare = 40;
      break;
    case fare > 30 && fare <= 40:
      finalFare = 50;
      break;
    case fare > 40:
      finalFare = 60;
      break;
    default:
      finalFare = 0;
      break;
  }

  document.getElementById("route").innerHTML = foundPath
    .map(
      (station, index) =>
        `<span class="badge bg-primary me-2">${index + 1}</span>${station}`
    )
    .join("<br>");

  document.getElementById("fare").textContent = `₹ ${finalFare}`;
  document.getElementById("results").classList.remove("d-none");
}
