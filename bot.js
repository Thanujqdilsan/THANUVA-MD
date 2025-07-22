const { default: makeWASocket, DisconnectReason, fetchLatestBaileysVersion } = require('@adiwajshing/baileys');
const P = require('./lib/functions');
const config = require('./config');
const fs = require('fs');
const express = require('express');
const qrcode = require('qrcode');

async function startBot() {
  const { version, isLatest } = await fetchLatestBaileysVersion();
  const sock = makeWASocket({
    version,
    printQRInTerminal: false,
    auth: { creds: JSON.parse(fs.existsSync(config.sessionPath) ? fs.readFileSync(config.sessionPath) : '{}') }
  });

  sock.ev.on('connection.update', async(update) => {
    const { connection, lastDisconnect, qr } = update;
    if (qr) await qrcode.toFile(config.qrPath, qr);
    if (connection === 'close') {
      if (lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut) startBot();
    }
    if (connection === 'open') {
      console.log(`✅  Bot ${config.botName} connected as ${config.ownerName}`);
      fs.writeFileSync(config.sessionPath, JSON.stringify(sock.authState, null, 2));
    }
  });

  sock.ev.on('messages.upsert', P.handleMessage(sock));

  const app = express();
  app.use(express.static('pair-web/public'));
  app.get('/', (req, res) => res.redirect('/index.html'));
  app.listen(config.port, () => console.log(`🌐 QR server running at http://localhost:${config.port}`));
}

startBot();
