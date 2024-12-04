const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const config = require("./config");
const rp = require("request-promise");

const app = express();
const port = 3444; 

app.use(cors()); 
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
  })
);

app.get("/", (request, response) => {
  response.json({ info: "Node.js, Express and Zoom API" });
});

// Use the ApiKey and APISecret from config.js
const payload = {
  iss: config.APIKey,
  exp: Math.floor(Date.now() / 1000) + 60, // Aumenta el tiempo de expiración a 60 segundos
};

const token = jwt.sign(payload, config.APISecret);
console.log("Generated JWT token:", token); // Debug message

app.post("/meeting", async (req, res) => {
  const email = req.body.email;
  console.log("Received request to create meeting for email:", email); // Debug message
  const options = {
    method: "POST",
    uri: `https://api.zoom.us/v2/users/${email}/meetings`,
    body: {
      topic: "Meeting",
      type: 1,
      settings: {
        host_video: true,
        participant_video: true,
      },
    },
    auth: {
      bearer: token,
    },
    headers: {
      "User-Agent": "Zoom-api-Jwt-Request",
      "content-type": "application/json",
    },
    json: true,
  };

  try {
    const response = await rp(options);
    console.log("Meeting created successfully:", response.join_url); // Debug message
    res.status(200).json({ join_url: response.join_url });
  } catch (err) {
    console.error("API call failed, reason: ", err);
    res.status(500).json({ error: "Failed to create meeting" });
  }
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
