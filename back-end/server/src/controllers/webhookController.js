import crypto from "node:crypto";
import { handleWhopEvent } from "../services/webhookService.js";
import { ApiError } from "../utils/errors.js";

const verifyWhopSignature = (rawBody, signature) => {
  const secret = process.env.WHOP_WEBHOOK_SECRET;
  if (!rawBody || !signature || !secret) {
    return false;
  }

  const normalizedSignature = signature.startsWith("sha256=")
    ? signature.slice(7)
    : signature;

  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected, "utf8"),
      Buffer.from(normalizedSignature, "utf8")
    );
  } catch {
    return false;
  }
};

const handleWhopWebhook = async (req, res, next) => {
  try {
    const signature =
      req.headers["x-whop-signature"] || req.headers["x-signature"];
    if (!verifyWhopSignature(req.rawBody, signature)) {
      return res.status(401).json({ error: "Invalid webhook signature" });
    }

    const event = req.body;

    if (!event?.type) {
      return res.status(400).json({ error: "Missing webhook event type" });
    }

    await handleWhopEvent(event);
    res.status(200).json({ message: "Webhook processed successfully" });
  } catch (error) {
    console.error("Webhook processing failed:", error);
    next(new ApiError("Webhook processing failed", 500));
  }
};

export { handleWhopWebhook };
