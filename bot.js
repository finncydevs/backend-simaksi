const {
  makeWASocket,
  makeCacheableSignalKeyStore,
  fetchLatestBaileysVersion,
  useMultiFileAuthState,
} = require("@whiskeysockets/baileys");
const { Boom } = require("@hapi/boom");
const qrcode = require("qrcode-terminal");
const { DisconnectReason } = require("@whiskeysockets/baileys");

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("./auth");
  const { version, isLatest } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    printQRInTerminal: true,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, saveCreds),
    },
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "close") {
      const shouldReconnect =
        (lastDisconnect.error = Boom)?.output?.statusCode !==
        DisconnectReason.loggedOut;
      console.log(
        "connection closed due to",
        lastDisconnect.error,
        ", reconnecting",
        shouldReconnect
      );
      if (shouldReconnect) startBot();
    } else if (connection === "open") {
      console.log("✅ Bot terhubung ke WhatsApp");
    }
  });

  global.sendQRCode = async (phone, transaksiId) => {
    const filePath = path.join(
      __dirname,
      "public",
      "qrcodes",
      `${transaksiId}.png`
    );

    if (!fs.existsSync(filePath)) {
      console.error("❌ File QR code tidak ditemukan:", filePath);
      return;
    }

    const buffer = fs.readFileSync(filePath);
    const waId = phone.replace(/^0/, "62") + "@s.whatsapp.net";

    await sock.sendMessage(waId, {
      image: buffer,
      caption: `QR Code untuk transaksi Anda:\n${transaksiId}`,
    });

    console.log(`✅ QR Code terkirim ke ${phone}`);
  };
}
startBot();
