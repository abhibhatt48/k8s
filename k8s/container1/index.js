// container1.js
const express = require('express');
const axios = require('axios');
const fs = require('fs').promises;
const app = express();
const PORT = 6000;

app.use(express.json());

// This function initializes the microservice by sending the required JSON to the 3rd party.
async function initializeService() {
    try {
        const serviceIp = 'your-service-ip';  // You can dynamically fetch this if required.
        
        const response = await axios.post('http://129.173.67.184:6001/start', {
            banner: "B00933993",
            ip: "service ip need to be changed."
        });

        const { file, data } = response.data;
        if (file && data) {
            await axios.post('http://localhost:6000/store-file', { file, data });
        }
    } catch (error) {
        console.error('Failed to initialize:', error.message);
    }
}

app.post('/store-file', async (req, res) => {
    try {
        const { file, data } = req.body;

        if (!file || !data) {
            return res.json({
                file: null,
                error: "Invalid JSON input."
            });
        }

        await fs.writeFile(`/persistent/volume/${file}`, data);

        res.json({
            file,
            message: "Success."
        });

    } catch (err) {
        res.json({
            file: req.body.file,
            error: "Error while storing the file to the storage."
        });
    }
});

app.post('/get-temperature', async (req, res) => {
    try {
        const response = await axios.post('http://container2:6001/get-temperature', req.body);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({
            error: "Internal server error."
        });
    }
});

// Start server and initialize service
app.listen(PORT, () => {
    console.log(`Container 1 service running on port ${PORT}`);
    initializeService();
});
