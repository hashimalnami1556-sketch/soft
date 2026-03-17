import express from "express";

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.json({
    status: "RakanAPI Server Running",
    message: "Welcome to Rakan API",
    endpoints: ["/api"]
  });
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});