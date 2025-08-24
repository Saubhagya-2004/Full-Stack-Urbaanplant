const express = require('express');
const connectDb = require('./config/database');
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());
app.use(express.json());
const http = require('http');
const server = http.createServer(app);
//cors
const cors = require('cors');
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
//router
const authRouter = require('./routes/authRouter');
const plantRouter = require('./routes/plantRouter')

app.use('/',authRouter);
app.use('/',plantRouter);
connectDb()
  .then(() => {
    console.log("Database connection sucessfully...");
    server.listen(7777, () => {
      console.log("Server connected sucessfully " + 7777);
    });
  })
  .catch((err) => {
    console.error("database cannot be connected");
  });
 