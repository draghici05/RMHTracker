import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
// import { Sequelize } from 'sequelize';  

const express = require("express");
const app = express();

app.use(express.json());

// routes
app.use("/api", require("./routes"));

app.listen(8080, () => {
  console.log("Backend running on http://localhost:8080");
});