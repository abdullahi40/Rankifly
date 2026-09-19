import axios from "axios";

const sendDiscordNotification = async (webhook_url, data) => {
  const amount = Number(data.amount_cents) / 100;
  const payload = {
    content: "🔥 New sale!",
    embeds: [
      {
        title: "New Affiliate Sale",
        description: `${data.affiliate_name} made $${amount.toFixed(2)}`,
        fields: [
          { name: "Points", value: String(data.points), inline: true },
          { name: "Product", value: data.product_name || "N/A", inline: true },
        ],
      },
    ],
  };

  try {
    await axios.post(webhook_url, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Discord notification failed:", error.message);
  }
};

export { sendDiscordNotification };
