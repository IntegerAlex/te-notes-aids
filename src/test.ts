import { Storage } from "@google-cloud/storage";
import { createClient } from "@libsql/client";
import 'dotenv/config'
import path from "path";
import fs from "fs";


const storage = new Storage(
    {
        projectId: process.env.PROJECT_ID ||"my-project-id",
        keyFilename: path.join(__dirname, "../positive-rush-416318-dbd6bc9d69a8.json" || "key.json")
    }
);


const turso = createClient({
  url: process.env.TURSO_DATABASE_URL || "postgres://localhost:5432/turso",
  authToken: process.env.TURSO_AUTH_TOKEN || "turso",
});



// storage.getBuckets().then((data) => {
//     console.log(data)
// }).catch((err) => {
//     console.log(err)
// })

const add = path.join(__dirname, "../pdfs/May_Jun_2023.pdf")
export async function upload(name:string){
    storage.bucket("tepdfs").upload(name)
        .then((data) => {
            // console.log(data)
            storeLinks(data[0].name, data[0].metadata.mediaLink ?? '', data[0].metadata.id ?? '', Number(data[0].metadata.size) ?? 0)
            .then(() => {
                return ({message: "Uploaded"})
            })
            .catch((err:Error) => {
                console.log(err)
                return Promise.reject(err)
            })
            
        }).catch((err) => {
            console.log(err)
            return Promise.reject(err)
        })

}


// upload(add).then((data) => {
//     console.log(data)
// }).catch((err) => {
//     console.log(err)
// }
// )


export async function download(name:string):Promise<Buffer>{
    return new Promise((resolve, reject) => {
    // console.log(name)S
    storage.bucket("tepdfs").file(name)
        .download()
        .then((data) => {
            console.log(data)
            resolve(data[0]) // Fix: Resolve the first element of the data array

        }).catch((err) => {
            console.log(err)
            reject(err)
        })
    })
}


// download("2019 Pattern/Artificial Intelligence/Oct - 2022.pdf").then((data) => {
//     console.log(data)
// })
 
// storage.bucket("tepdfs").file("AI Decode.pdf").download().then((data) => {
//     console.log(data)
// }).catch((err) => {
//     console.log(err)
// });



async function storeLinks(name:string, mediaLink:string, id:string, size:number){
    const query = `INSERT INTO pdflinks (name, mediaLink, id, size) VALUES ('${name}', '${mediaLink}', '${id}', ${size})`
    turso.execute(query).then((data) => {
        console.log(data)
    }).catch((err) => {
        console.log(err)
    })
}


interface File{
    name:string,
    mediaLink:string,
    id:string,
    size:number
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
