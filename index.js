const express = require('express');
const app = express();
const cors = require('cors');
const { createWriteStream } = require('fs');
const { join } = require('path');
const { Buffer } = require('buffer');
const { v4: uuidv4 } = require('uuid');

app.use(express.json());
app.use(cors({
  origin: 'https://potloodgum.com',
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

    // convert data64 into image and save it to disk
    const imageBuffer = Buffer.from(data.image.split(',')[1], 'base64');
    const imageName = 'public/images/' + generateRandomName();
    const imagePath = join(__dirname, imageName);

    const writeStream = createWriteStream(imagePath);
    writeStream.write(imageBuffer);
    writeStream.end();

    return res.status(200).json({ message: 'POST request successful' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

const port = 5000; // Change the port as needed
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
