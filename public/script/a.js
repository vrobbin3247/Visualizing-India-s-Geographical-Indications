// preprocessGIData.js
import fs from "fs";

// Indian states with approximate center coordinates
const stateCoordinates = {
  "Andhra Pradesh": { lat: 15.9129, lng: 79.74 },
  "Arunachal Pradesh": { lat: 28.218, lng: 94.7278 },
  Assam: { lat: 26.2006, lng: 92.9376 },
  Bihar: { lat: 25.0961, lng: 85.3131 },
  Chhattisgarh: { lat: 21.2787, lng: 81.8661 },
  Chattisgarh: { lat: 21.2787, lng: 81.8661 }, // alt spelling
  Goa: { lat: 15.2993, lng: 74.124 },
  Gujarat: { lat: 22.2587, lng: 71.1924 },
  Haryana: { lat: 29.0588, lng: 76.0856 },
  "Himachal Pradesh": { lat: 31.1048, lng: 77.1734 },
  Jharkhand: { lat: 23.6102, lng: 85.2799 },
  Karnataka: { lat: 15.3173, lng: 75.7139 },
  Kerala: { lat: 10.8505, lng: 76.2711 },
  "Madhya Pradesh": { lat: 22.9734, lng: 78.6569 },
  Maharashtra: { lat: 19.7515, lng: 75.7139 },
  Manipur: { lat: 24.6637, lng: 93.9063 },
  Meghalaya: { lat: 25.467, lng: 91.3662 },
  Mizoram: { lat: 23.1645, lng: 92.9376 },
  Nagaland: { lat: 26.1584, lng: 94.5624 },
  Odisha: { lat: 20.9517, lng: 85.0985 },
  Punjab: { lat: 31.1471, lng: 75.3412 },
  Rajasthan: { lat: 27.0238, lng: 74.2179 },
  Sikkim: { lat: 27.533, lng: 88.5122 },
  "Tamil Nadu": { lat: 11.1271, lng: 78.6569 },
  Tamilnadu: { lat: 11.1271, lng: 78.6569 }, // alt spelling
  Telangana: { lat: 18.1124, lng: 79.0193 },
  Tripura: { lat: 23.9408, lng: 91.9882 },
  "Uttar Pradesh": { lat: 26.8467, lng: 80.9462 },
  "Uttar Predesh": { lat: 26.8467, lng: 80.9462 }, // typo in data
  Uttarakhand: { lat: 30.0668, lng: 79.0193 },
  Uttarkhand: { lat: 30.0668, lng: 79.0193 }, // alt spelling
  "West Bengal": { lat: 22.9868, lng: 87.855 },

  // Union Territories
  "Jammu & Kashmir": { lat: 33.7782, lng: 76.5762 },
  "Jammu and Kashmir": { lat: 33.7782, lng: 76.5762 },
  "Jammu & Kashmir (UT)": { lat: 33.7782, lng: 76.5762 },
  Ladakh: { lat: 34.1526, lng: 77.5771 },
  "Ladakh (UT)": { lat: 34.1526, lng: 77.5771 },
  Delhi: { lat: 28.7041, lng: 77.1025 },
  Pondicherry: { lat: 11.9416, lng: 79.8083 },
  "Andaman and Nicobar Islands": { lat: 11.7401, lng: 92.6586 },
  "Dadara & Nagar Haveli": { lat: 20.1809, lng: 73.0169 },
  "Daman Diu": { lat: 20.4283, lng: 72.8397 },

  // International (for reference)
  Peru: { lat: -9.19, lng: -75.0152 },
  France: { lat: 46.2276, lng: 2.2137 },
  "United States of America": { lat: 37.0902, lng: -95.7129 },
  "United Kingdom": { lat: 55.3781, lng: -3.436 },
  Italy: { lat: 41.8719, lng: 12.5674 },
  Portugal: { lat: 39.3999, lng: -8.2245 },
  Mexico: { lat: 23.6345, lng: -102.5528 },
  Ireland: { lat: 53.1424, lng: -7.6921 },
  Chile: { lat: -35.6751, lng: -71.543 },
  Greece: { lat: 39.0742, lng: 21.8243 },
  "Czech Republic": { lat: 49.8175, lng: 15.473 },
  Germany: { lat: 51.1657, lng: 10.4515 },
  Spain: { lat: 40.4637, lng: -3.7492 },
  Japan: { lat: 36.2048, lng: 138.2529 },
  Thailand: { lat: 15.87, lng: 100.9925 },
};

// Read and parse the CSV
function parseCSV(content) {
  const lines = content.split("\n");
  const headers = lines[0].split(",");
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;

    const values = lines[i].split(",");
    const entry = {};

    headers.forEach((header, index) => {
      entry[header.trim()] = values[index]?.trim() || "";
    });

    data.push(entry);
  }

  return data;
}

// Process GI data
function processGIData(rawData) {
  const processedData = [];

  rawData.forEach((item) => {
    // Collect all states for this GI
    const states = [];
    const coordinates = [];

    for (let i = 1; i <= 7; i++) {
      const stateKey = i === 1 ? "State" : `State ${i}`;
      const stateName = item[stateKey];

      if (stateName) {
        states.push(stateName);

        const coords = stateCoordinates[stateName];
        if (coords) {
          coordinates.push({
            state: stateName,
            lat: coords.lat,
            lng: coords.lng,
          });
        } else {
          console.warn(`Warning: No coordinates found for state: ${stateName}`);
        }
      }
    }

    // Only include if we have at least one valid coordinate
    if (coordinates.length > 0) {
      processedData.push({
        id: item["S.No"],
        name: item["Geographical Indications"],
        type: item["Goods"],
        states: states,
        coordinates: coordinates,
        primaryState: states[0] || "",
        stateCount: states.length,
      });
    }
  });

  return processedData;
}

// Main execution
function main() {
  try {
    // Read the CSV file
    const csvContent = fs.readFileSync(
      "Total Registered GI details of GI Application in India.txt",
      "utf-8"
    );

    // Parse and process
    const rawData = parseCSV(csvContent);
    console.log(`Parsed ${rawData.length} GI records`);

    const processedData = processGIData(rawData);
    console.log(
      `Processed ${processedData.length} GI records with coordinates`
    );

    // Generate statistics
    const typeStats = {};
    processedData.forEach((item) => {
      typeStats[item.type] = (typeStats[item.type] || 0) + 1;
    });

    console.log("\nGI Types Distribution:");
    Object.entries(typeStats).forEach(([type, count]) => {
      console.log(`   ${type}: ${count}`);
    });

    // Save processed data
    fs.writeFileSync(
      "processedGIData.json",
      JSON.stringify(processedData, null, 2)
    );

    console.log("\nSaved to processedGIData.json");

    // Also save a summary
    const summary = {
      totalRecords: processedData.length,
      typeBreakdown: typeStats,
      indianStates: Object.keys(stateCoordinates).filter(
        (s) =>
          ![
            "Peru",
            "France",
            "United States of America",
            "United Kingdom",
            "Italy",
            "Portugal",
            "Mexico",
            "Ireland",
            "Chile",
            "Greece",
            "Czech Republic",
            "Germany",
            "Spain",
            "Japan",
            "Thailand",
          ].includes(s)
      ).length,
    };

    fs.writeFileSync("giDataSummary.json", JSON.stringify(summary, null, 2));

    console.log("Saved summary to giDataSummary.json\n");
  } catch (error) {
    console.error("Error:", error.message);
  }
}

main();
