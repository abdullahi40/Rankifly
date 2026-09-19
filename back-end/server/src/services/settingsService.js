import pool from "../config/db.js";

const updateDiscordWebhook = async (sellerId, webhookUrl) => {
  await pool.query("UPDATE sellers SET discord_webhook = $1 WHERE id = $2", [
    webhookUrl,
    sellerId,
  ]);
};

export { updateDiscordWebhook };
