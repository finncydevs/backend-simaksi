const {
  makeWASocket,
  makeCacheableSignalKeyStore,
  fetchLatestBaileysVersion,
  useMultiFileAuthState,
  DisconnectReason,
} = require("@whiskeysockets/baileys");
const { Boom } = require("@hapi/boom");
const qrcode = require("qrcode-terminal");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

// Environment variables
const API_BASE_URL = process.env.API_URL || "http://localhost:5000";
const QR_CODE_DIR = path.join(__dirname, "public", "qrcodes");
const POLLING_INTERVAL = 5000; // 5 seconds

// Ensure QR code directory exists
if (!fs.existsSync(QR_CODE_DIR)) {
  fs.mkdirSync(QR_CODE_DIR, { recursive: true });
}

async function startBot() {
  try {
    const { state, saveCreds } = await useMultiFileAuthState("./auth");
    const { version } = await fetchLatestBaileysVersion();

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
          "🔌 Connection closed:",
          lastDisconnect.error.message,
          "| Reconnecting:",
          shouldReconnect
        );

        if (shouldReconnect) setTimeout(startBot, 3000);
      } else if (connection === "open") {
        console.log("✅ Connected to WhatsApp");
      }
    });

    // Enhanced QR Code Sender
    global.sendQRCode = async (phone, transaksiId) => {
      try {
        const sanitizedPhone = phone.replace(/[^0-9]/g, "").replace(/^0/, "62");
        const waId = `${sanitizedPhone}@s.whatsapp.net`;
        const filePath = path.join(QR_CODE_DIR, `${transaksiId}.png`);

        // Wait for QR code file with retries
        let retries = 0;
        while (!fs.existsSync(filePath)) {
          if (retries > 3) {
            throw new Error("QR code file not found after 3 retries");
          }
          await new Promise(resolve => setTimeout(resolve, 1000));
          retries++;
        }
        

        const buffer = fs.readFileSync(filePath);
        
        await sock.sendMessage(waId, {
          image: buffer,
          caption: `🎟️ QR Code untuk transaksi Anda:\nID Transaksi: ${transaksiId}\n\nJangan bagikan kode ini ke siapa pun.`,
        });

        console.log(`✅ QR Code sent to ${sanitizedPhone}`);
        return true;
      } catch (error) {
        console.error(`❌ Failed to send QR to ${phone}:`, error.message);
        return false;
      }
    };

    // Enhanced Transaction Poller
    let lastChecked = new Date();
    let isProcessing = false;

    setInterval(async () => {
      if (isProcessing) return;
      isProcessing = true;

      try {
        const { data: transaksis } = await axios.get(
          `${API_BASE_URL}/api/transaksis?sort=createdAt&order=desc`
        );

        const transaksiBaru = transaksis.filter(
          t => new Date(t.createdAt) > lastChecked
        );

        for (const transaksi of transaksiBaru.reverse()) { // Process oldest first
          try {
            const { data: pendaki } = await axios.get(
              `${API_BASE_URL}/api/${transaksi.id_pendaki}`
            );

            const phone = pendaki.phone?.replace(/[^0-9]/g, "").replace(/^0/, "62");
            if (!phone || phone.length < 10) {
              console.warn(`❌ Invalid phone for pendaki ${transaksi.id_pendaki}`);
              continue;
            }

            const success = await global.sendQRCode(phone, transaksi._id);
            if (success) {
              lastChecked = new Date(transaksi.createdAt);
              await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limiting
            }
          } catch (error) {
            console.error(`Error processing transaksi ${transaksi._id}:`, error.message);
          }
        }
      } catch (error) {
        console.error("❌ Polling error:", error.message);
      } finally {
        isProcessing = false;
      }
    }, POLLING_INTERVAL);

    console.log("🤖 Bot started successfully");
  } catch (error) {
    console.error("🔥 Critical startup error:", error.message);
    process.exit(1);
  }
}

// Handle uncaught errors
process.on("uncaughtException", (error) => {
  console.error("🚨 Uncaught Exception:", error.message);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("🚨 Unhandled Rejection at:", promise, "reason:", reason);
});

startBot();