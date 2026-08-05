const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Serveur Downloader OK");
});

app.post("/download", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({
      error: "URL manquante"
    });
  }

  try {
    const response = await fetch("https://api.cobalt.tools/api/json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        url: url
      })
    });

    const data = await response.json();

console.log(data);

res.json(data);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Erreur du serveur",
      details: error.message
    });
  }
});

app.listen(port, () => {
  console.log(`Serveur lancé sur le port ${port}`);
});
