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
      from: {
        address: process.env.SENDER_EMAIL,
        display_name: "Website Contact Form"
      },
      to: {
        address: process.env.RECEIVING_EMAIL,
        display_name: "Site Admin"
      },
      subject: "New Contact Form Submission",
      plain: `Name: ${name}\nEmail: ${email}`
      // You can also add "html" for rich formatting:
      // html: `<p><strong>Name:</strong> ${name}<br><strong>Email:</strong> ${email}<br><strong>Message:</strong> ${message}</p>`
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



