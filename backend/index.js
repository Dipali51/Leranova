require("dotenv").config();
const express  = require("express");
const cors     = require("cors");
const path     = require("path");          
const connectDB = require("./Connection/db");

const userRoutes   = require("./routes/userroutes");
const courseRoutes = require("./routes/courseroutes");

const app  = express();
const PORT = 3001;


app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));


connectDB();

app.use("/api", userRoutes);
app.use("/api", courseRoutes);

app.listen(PORT, () =>
  console.log(`✅ Server running at: http://localhost:${PORT}`)
);
