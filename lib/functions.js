module.exports.handleMessage = (sock) => async (msgUpdate) => {
  try {
    const msg = msgUpdate.messages[0];
    if (!msg.message || msg.key.fromMe) return;
    const sender = msg.key.remoteJid;
    const content = msg.message.conversation || msg.message.extendedTextMessage?.text;
    const isGroup = sender.endsWith("@g.us");

    if (!content) return;

    // plugin loader
    if (content.startsWith('!')) {
      const cmd = content.slice(1).trim().split(' ')[0];
      try {
        const plugin = require(`../plugins/${cmd}.js`);
        return plugin.run(sock, msg, content);
      } catch {
        return sock.sendMessage(sender, { text: 'Command not found, use !menu' });
      }
    }
  } catch (err) {
    console.error(err);
  }
};
