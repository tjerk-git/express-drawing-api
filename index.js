const express = require('express');
const app = express();
const cors = require('cors');
const postmark = require('postmark');
require('dotenv').config();

const debug = require("debug")("author");

app.use(express.json());
// app.use(cors({
//   origin: process.env.CORS_ALLOWED
// }));

function generateRandomName() {
  return `${Date.now()}.png`;
}



app.post('/image_processing', (req, res) => {

  try {
    const data = req.body;
    if (!data || !data.image) {
      debug(`No data: ${req.body}`);
      return res.status(400).json({ error: 'Invalid JSON data' });
    }
    const imageBuffer = data.image.split(',')[1];
    sendEmail(imageBuffer, data.email);

    return res.status(200).json({ message: 'POST request successful' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

function sendEmail(imageBuffer, email) {

  debug(`sending email with attachment`);

  if (!email) {
    email = "empty string i guess";
  }

  const postmarkClient = new postmark.ServerClient(process.env.POSTMARK_API_KEY);

  const emailOptions = {
    From: 'appointments@hamaki.pro',
    To: 'tjerk.dijkstra@icloud.com',
    Subject: 'Image Attachment',
    TextBody: `A new artwork from potloodgum.com author: ${email}`,
    MessageStream: 'outbound',
  };

  const attachment = {
    Name: generateRandomName(),
    Content: imageBuffer,
    ContentType: 'image/png',
  };

  emailOptions.Attachments = [attachment];

  postmarkClient.sendEmail(emailOptions)
    .then((result) => {
      console.log('Email sent:', result);
      debug(`Email sent ${result}`);
    })
    .catch((error) => {
      console.log('Error sending email:', error.message);
      debug(`Email not send ${error.message}`);
    });
}

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
