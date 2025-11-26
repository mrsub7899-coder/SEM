import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const { name, email, } = req.body;

  
  // Send email via Maileroo API
  try {
    const mailResponse = await axios.post(
       "https://smtp.maileroo.com/api/v2/emails",
      {
        from: process.env.SENDER_EMAIL,
        to: process.env.RECEIVING_EMAIL,
        subject: "New Contact Form Submission",
        plain: `Name: ${name}\nEmail: ${email}`
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.MAILEROO_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    if (mailResponse.status === 200) {
      return res.status(200).send(`Thank you, ${name}! Your message has been sent successfully.`);
    } else {
      return res.status(500).send("Error sending email.");
    }
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    return res.status(500).send("Error sending email.");
  }
}

