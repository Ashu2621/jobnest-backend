const express = require("express");
const cors = require("cors");

const mlRoutes = require("./routes/ml.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/ml", mlRoutes);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Node server running on port ${PORT}`);
});
