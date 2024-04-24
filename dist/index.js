"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const test_1 = require("./test");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.static('public'));
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.sendFile('index.html');
}));
app.get('/download', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.query);
        // Get the filename from the query string
        const filename = req.query.filename;
        // Check for injection vulnerabilities
        // await checkInjection(filename);
        // Download the file
        const fileData = yield (0, test_1.download)(filename);
        // Set response headers for downloading the PDF file
        res.set('Content-Disposition', `inline; filename="${filename}"`);
        res.set('Content-Type', 'application/pdf');
        // Send the file data as the response
        res.send(fileData);
    }
    catch (err) {
        // Handle errors
        res.status(400).send(err.message || 'Error downloading file');
    }
}));
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
