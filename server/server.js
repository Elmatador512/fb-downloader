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
    return res.status(400).json({ error: "URL manquante" });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000); // 25s max

    const response = await fetch("https://api.cobalt.tools/api/json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      },
      body: JSON.stringify({
        url: url,
        downloadMode: "auto" // important pour FB/TikTok
      }),
      signal: controller.signal
    });

    clearTimeout(timeout);
    
    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: "Cobalt a refusé", details: text });
    }

    const data = await response.json();
    console.log("REPONSE COBALT :", JSON.stringify(data));
    res.json(data);

  } catch (error) {
    console.log(error);
    if (error.name === 'AbortError') {
      return res.status(504).json({ error: "Timeout - Cobalt trop lent" });
    }
    res.status(500).json({ error: "Erreur du serveur", details: error.message });
  }
});

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
