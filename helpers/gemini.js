const { GoogleGenerativeAI } = require("@google/generative-ai");
const { Monster } = require("../models");
require("dotenv").config();

const gemini = async (prompt) => {
  try {
    const lowerCasePrompt = prompt.toLowerCase();

    let species = null;
    if (lowerCasePrompt.includes("elder dragon")) {
      species = "elder dragon";
    } else if (lowerCasePrompt.includes("flying wyvern")) {
      species = "flying wyvern";
    } else if (lowerCasePrompt.includes("fanged beast")) {
      species = "fanged beast";
    } else if (lowerCasePrompt.includes("piscine wyvern")) {
      species = "piscine wyvern";
    } else if (lowerCasePrompt.includes("neopteron")) {
      species = "neopteron";
    } else if (lowerCasePrompt.includes("relict")) {
      species = "relict";
    } else if (lowerCasePrompt.includes("brute wyvern")) {
      species = "brute wyvern";
    } else if (lowerCasePrompt.includes("herbivore")) {
      species = "herbivore";
    } else if (lowerCasePrompt.includes("fanged wyvern")) {
      species = "fanged wyvern";
    } else if (lowerCasePrompt.includes("fish")) {
      species = "fish";
    } else if (lowerCasePrompt.includes("wingdrake")) {
      species = "wingdrake";
    } else if (lowerCasePrompt.includes("bird wyvern")) {
      species = "bird wyvern";
    }

    if (species) {
      // Ambil semua monster dengan spesies yang sesuai
      const monsters = await Monster.findAll({
        where: { species },
      });
      console.log(monsters, "<<< monster"); // Tambahkan ini untuk debug

      // Pilih 3 monster secara acak
      const selectedMonsters = [];
      const numMonstersToSelect = 3;

      // Memastikan tidak lebih dari jumlah monster yang ada
      const limit = Math.min(numMonstersToSelect, monsters.length);
      const shuffledMonsters = monsters.sort(() => 0.5 - Math.random());

      for (let i = 0; i < limit; i++) {
        selectedMonsters.push(shuffledMonsters[i]);
      }

      if (selectedMonsters.length > 0) {
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const descriptions = [];
        for (const monster of selectedMonsters) {
          const result = await model.generateContent(
            `Give a short description of ${monster.name}`
          );
          const description = result.response.text();
          descriptions.push({
            id: monster.id,
            type: monster.type,
            species: monster.species,
            name: monster.name,
            description: description,
            // imageUrl: monster.imageUrl, // Misalnya kamu punya field imageUrl di model
          });
        }

        return {
          data: descriptions,
          total: descriptions.length,
        };
      }
    }
  } catch (err) {
    console.error("Error generating content:", err);
    throw err;
  }
};

module.exports = gemini;
