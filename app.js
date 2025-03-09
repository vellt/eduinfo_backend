const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const morgan = require('morgan');
const path = require('path'); // Fájl útvonalak kezelése
const { trimMiddleware } = require('./middlewares/trim')
const { sendErrorResponse } = require("./utils/responseHelper");

const v1AdminRoutes = require("./routes/v1/adminRoutes");
const v1AuthRoutes = require("./routes/v1/authRoutes");
const v1InstitutionRoutes = require("./routes/v1/institutionRoutes");
const v1PersonRoutes = require("./routes/v1/personRoutes");

// Alkalmazás létrehozása
const app = express();

// Middleware-k
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(trimMiddleware); // minden beérkező adatot trimmel

// log időzóna
morgan.token('date', () => new Date().toLocaleString('hu-HU', { hour12: false }));

// Logger
app.use(morgan('combined'));

// Static fájlok kiszolgálása
app.use('/api/v1/uploads', express.static(path.join(__dirname, 'uploads')));

// Útvonalak
app.use("/api/v1/admin", v1AdminRoutes);
app.use("/api/v1/auth", v1AuthRoutes);
app.use("/api/v1/institution", v1InstitutionRoutes);
app.use("/api/v1/person", v1PersonRoutes);

// nem létező útvonal
app.use((_, res) => sendErrorResponse(res,404,'Az útvonal nem létezik.' ));

module.exports = app; // Az app exportálása
