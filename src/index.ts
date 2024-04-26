import express from 'express';
import 'dotenv/config';
import fs from 'fs';
import { download } from './test';
import { checkInjection } from './util';


const app = express();
app.use(express.json());
app.use(express.static('public'));

app.get('/', async (req, res) => {
    res.sendFile('index.html');
});

app.get('/download', async (req, res) => {

    try {
        console.log(req.query)
        // Get the filename from the query string
        const filename = req.query.filename as string;
        
        // Check for injection vulnerabilities
        await checkInjection(filename);

        // Download the file
        const fileData:Buffer = await download(filename);
        
        // Set response headers for downloading the PDF file
        res.set('Content-Disposition', `inline; filename="${filename}"`);
        res.set('Content-Type', 'application/pdf');
        
        // Send the file data as the response
        res.send(fileData);
    } catch (err: any) {
        // Handle errors
        res.status(400).send(err.message || 'Error downloading file');
    }
});



app.listen(8080, () => {
    console.log('Server is running on port 8080');
}
);