require("dotenv").config();
const http = require("http");
const app = require("./app");
const router = require("./routes/stackoverflowRoutes");

const server = http.createServer(app);

const { PORT, HOST } = process.env;


app.use("/app/", router );

server.listen(PORT, HOST, () => console.log("Server listening"));
