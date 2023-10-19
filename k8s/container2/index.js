// container2.js
const express = require('express');
const fs = require('fs').promises;
const app = express();
const PORT = 6001;

app.use(express.json());

app.post('/get-temperature', async (req, res) => {
    try {
        const { file, name } = req.body;

        if (!file || !name) {
            return res.json({
                file: null,
                error: "Invalid JSON input."
            });
        }

        const data = await fs.readFile(`/persistent/volume/${file}`, 'utf8');
        const lines = data.split('\n');
        const headers = lines[0].split(',');

        const tempIndex = headers.indexOf('temperature');
        if (tempIndex === -1) {
            throw new Error('Invalid CSV format.');
        }

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',');

            if (values[0] === name) {
                return res.json({
                    file,
                    temperature: parseInt(values[tempIndex].trim(), 10)
                });
            }
        }

        res.json({
            file,
            error: `Location "${name}" not found in the file.`
        });

    } catch (err) {
        if (err.code === 'ENOENT') {
            res.json({
                file,
                error: "File not found."
            });
        } else {
            res.json({
                file,
                error: "Input file not in CSV format."
            });
        }
    }
});

app.listen(PORT, () => {
    console.log(`Container 2 service running on port ${PORT}`);
});
