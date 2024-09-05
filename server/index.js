require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");
const connectDB = require("./connectDB");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(helmet());
app.use(cors());

app.use("/auth", require("./routes/auth"));
app.use("/userMovies", require("./routes/userMovies"));

const startServer = async () => {
    try {
        await connectDB(process.env.MONGODB_URL);
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (e) {
        console.log(e);
    }
};

startServer();
module.exports = app;
