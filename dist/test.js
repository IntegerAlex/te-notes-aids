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
exports.download = exports.upload = void 0;
const storage_1 = require("@google-cloud/storage");
const client_1 = require("@libsql/client");
require("dotenv/config");
const path_1 = __importDefault(require("path"));
const storage = new storage_1.Storage({
    projectId: process.env.PROJECT_ID || "my-project-id",
    keyFilename: path_1.default.join(__dirname, "../positive-rush-416318-dbd6bc9d69a8.json" || "key.json")
});
const turso = (0, client_1.createClient)({
    url: process.env.TURSO_DATABASE_URL || "postgres://localhost:5432/turso",
    authToken: process.env.TURSO_AUTH_TOKEN || "turso",
});
// storage.getBuckets().then((data) => {
//     console.log(data)
// }).catch((err) => {
//     console.log(err)
// })
const add = path_1.default.join(__dirname, "../pdfs/May_Jun_2023.pdf");
function upload(name) {
    return __awaiter(this, void 0, void 0, function* () {
        storage.bucket("tepdfs").upload(name)
            .then((data) => {
            var _a, _b, _c;
            // console.log(data)
            storeLinks(data[0].name, (_a = data[0].metadata.mediaLink) !== null && _a !== void 0 ? _a : '', (_b = data[0].metadata.id) !== null && _b !== void 0 ? _b : '', (_c = Number(data[0].metadata.size)) !== null && _c !== void 0 ? _c : 0)
                .then(() => {
                return ({ message: "Uploaded" });
            })
                .catch((err) => {
                console.log(err);
                return Promise.reject(err);
            });
        }).catch((err) => {
            console.log(err);
            return Promise.reject(err);
        });
    });
}
exports.upload = upload;
// upload(add).then((data) => {
//     console.log(data)
// }).catch((err) => {
//     console.log(err)
// }
// )
function download(name) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            // console.log(name)S
            storage.bucket("tepdfs").file(name)
                .download()
                .then((data) => {
                console.log(data);
                resolve(data[0]); // Fix: Resolve the first element of the data array
            }).catch((err) => {
                console.log(err);
                reject(err);
            });
        });
    });
}
exports.download = download;
// download("2019 Pattern/Artificial Intelligence/Oct - 2022.pdf").then((data) => {
//     console.log(data)
// })
// storage.bucket("tepdfs").file("AI Decode.pdf").download().then((data) => {
//     console.log(data)
// }).catch((err) => {
//     console.log(err)
// });
function storeLinks(name, mediaLink, id, size) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = `INSERT INTO pdflinks (name, mediaLink, id, size) VALUES ('${name}', '${mediaLink}', '${id}', ${size})`;
        turso.execute(query).then((data) => {
            console.log(data);
        }).catch((err) => {
            console.log(err);
        });
    });
}
// Define your bucket name
// const bucketName = 'tepdfs';
// // Function to retrieve metadata for all objects (files and folders) recursively
// async function retrieveObjectMetadata(prefix = '') {
//     try {
//         // Get a list of objects in the bucket with the specified prefix (folder)
//         const [objects] = await storage.bucket(bucketName).getFiles({ prefix });
//         // Iterate over each object and retrieve its metadata
//         for (const object of objects) {
//             const [metadata] = await object.getMetadata();
//             const { name, mediaLink, id, size } = metadata;
//             // Store the metadata using your storeLinks function
//             await storeLinks(name, mediaLink, id, size);
//             // If the object is a folder (ends with '/'), recursively retrieve metadata for its contents
//             if (name.endsWith('/')) {
//                 await retrieveObjectMetadata(name);
//             }
//         }
//         console.log("Metadata retrieved and stored successfully.");
//     } catch (error) {
//         console.error("Error retrieving metadata:", error);
//     }
// }
// // Call the function to retrieve and store metadata for all objects in the bucket
// retrieveObjectMetadata();
