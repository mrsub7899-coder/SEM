const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/contact', async (req, res) => {
  const { name, email, } = req.body;

   // Send email via Maileroo API
  try {
    const mailResponse = await axios.post(
      'https://api.maileroo.com/send',
      {
        from: process.env.SENDER_EMAIL,
        to: process.env.RECEIVING_EMAIL,
        subject: 'New Contact Form Submission',
        text: `Name: ${name}\nEmail: ${email}`
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.MAILEROO_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (mailResponse.status === 200) {
      res.send(`<h1>Thank you, ${name}!</h1><p>Your message has been sent successfully.</p>`);
    } else {
      res.send('Error sending');
    }
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res.send('Error sending');
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
