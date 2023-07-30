const express = require('express');
const app = express();
const cors = require('cors');
const postmark = require('postmark');
require('dotenv').config();

app.use(express.json());
app.use(cors({
  origin: process.env.CORS_ALLOWED
}));

// method that generates a random name based on the current time and adds .png behind it
function generateRandomName() {
  return `${Date.now()}.png`;
}

app.post('/image_processing', (req, res) => {
  try {
    const data = req.body;
    if (!data || !data.image) {
      return res.status(400).json({ error: 'Invalid JSON data' });
    }

    const imageBuffer = data.image.split(',')[1];
    sendEmail(imageBuffer);

    return res.status(200).json({ message: 'POST request successful' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Function to send email with attachment
function sendEmail(imageBuffer) {

  const postmarkClient = new postmark.ServerClient(process.env.POSTMARK_API_KEY);

  const emailOptions = {
    From: 'appointments@hamaki.pro', // Replace with your email address
    To: 'tjerk.dijkstra@icloud.com', // Replace with the recipient's email address
    Subject: 'Image Attachment',
    TextBody: 'Here is the image you requested!',
    MessageStream: 'outbound',
  };

  const attachment = {
    Name: generateRandomName(), // You can customize the attachment filename here
    Content: imageBuffer, // File path to the image on your server
    ContentType: 'image/png',
  };

  emailOptions.Attachments = [attachment];

  postmarkClient.sendEmail(emailOptions)
    .then((result) => {
      console.log('Email sent:', result);
    })
    .catch((error) => {
      console.log('Error sending email:', error.message);
    });
}

const port = 1337; // Change the port as needed
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
