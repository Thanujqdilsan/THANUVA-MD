exports.run = async(sock, msg, content) => {
  const text = `*🤖 ${require('../config').botName} Menu*\n\n` +
    `!menu – show this menu\n` +
    `!ping – check bot responsiveness\n`;
  const jid = msg.key.remoteJid;
  await sock.sendMessage(jid, { text });
};
