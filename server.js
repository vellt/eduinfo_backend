require('dotenv').config();
const http = require('http');
const app = require('./app'); // Importáljuk az app.js-t

const PORT = process.env.PORT || 3000;

// HTTP szerver létrehozása az app.js segítségével
const server = http.createServer(app);

// Hosszabb keep-alive timeout beállítása
server.keepAliveTimeout = 65000; // 65 másodperc
server.headersTimeout = 66000; // 66 másodperc

// Szerver indítása
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
