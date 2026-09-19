import { updateDiscordWebhook } from "../services/settingsService.js";
import { ApiError } from "../utils/errors.js";

const updateDiscordWebhookHandler = async (req, res, next) => {
  try {
    const { webhook_url } = req.body;

    if (!webhook_url) {
      return res.status(400).json({ error: "webhook_url is required" });
    }

    await updateDiscordWebhook(req.seller.id, webhook_url);
    res.json({ message: "Discord webhook saved" });
  } catch (error) {
    next(new ApiError("Failed to update Discord webhook", 500));
  }
};

export { updateDiscordWebhookHandler as updateDiscordWebhook };
