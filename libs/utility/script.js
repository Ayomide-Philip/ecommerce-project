import fs from "fs";
import readline from "readline";
import path from "path";

// Adjust paths dynamically based on your folder setup
const inputPath = path.resolve("./data/articles.json");
const outputPath = path.resolve("./data/articles_sample.json");

const instream = fs.createReadStream(inputPath, { encoding: "utf8" });
const rl = readline.createInterface({ input: instream, terminal: false });

const ladieswearPool = [];
const menswearPool = [];

let currentObjectString = "";
let isBuildingObject = false;

console.log("Streaming and parsing your massive JSON file... Please wait.");

rl.on("line", (line) => {
  // Clean invisible/corrupt junk marks and swap single quotes to double quotes
  let cleanLine = line
    .replace(/[\ufeff\u200b\x00□]/g, "")
    .replace(/'/g, '"')
    .trim();

  // 1. Detect when a multi-line object block starts
  if (cleanLine.startsWith("{")) {
    isBuildingObject = true;
    currentObjectString = "";
  }

  if (isBuildingObject) {
    currentObjectString += cleanLine;
  }

  // 2. Detect when the multi-line object block ends
  if (cleanLine.endsWith("}") || cleanLine.endsWith("},")) {
    isBuildingObject = false;

    // Remove a trailing comma if it exists at the end of the object string
    if (currentObjectString.endsWith(",")) {
      currentObjectString = currentObjectString.slice(0, -1);
    }

    try {
      const obj = JSON.parse(currentObjectString);
      const indexName = String(obj.index_name || "").toLowerCase();

      // 3. Filter items directly into categories
      if (indexName === "ladieswear") {
        ladieswearPool.push(obj);
      } else if (indexName === "menswear") {
        menswearPool.push(obj);
      }
    } catch (e) {
      // Quietly skip broken strings or lines that aren't complete yet
    }

    currentObjectString = "";
  }
});

// Helper to grab random items safely from a collected pool
function getRandomSample(arr, size) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, size);
}

rl.on("close", () => {
  console.log(
    `Scan finished! Total found: ${ladieswearPool.length} Ladieswear & ${menswearPool.length} Menswear.`,
  );

  if (ladieswearPool.length === 0 && menswearPool.length === 0) {
    console.error(
      "⚠️ Error: No items matched. Double check if 'index_name' exists in your properties.",
    );
    return;
  }

  // Grab 50 random records from each category
  const selectedLadies = getRandomSample(ladieswearPool, 50);
  const selectedMen = getRandomSample(menswearPool, 50);

  // Merge into your final array of 100
  const finalSample = [...selectedLadies, ...selectedMen];

  // Ensure output directory exists before writing
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(finalSample, null, 4), "utf8");
  console.log(`🎉 Success! Extraction complete. File saved to: ${outputPath}`);
});
