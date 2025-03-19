const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

// Open Graph 처리
app.get("/og", (req, res) => {
    console.log("Open Graph 요청 감지됨!");

    const title = "대구 간송미술관";
    const description = "1938년 보화각에서 비롯된 문화보국의 첫 걸음";
    const image = "https://kansung-8e750.web.app/link_image.jpg";
    const url = "https://kansung-8e750.web.app";

    res.status(200).set({
        "Content-Type": "text/html; charset=UTF-8",
        "Cache-Control": "public, max-age=0, s-maxage=600",
        "Access-Control-Allow-Origin": "*",
    }).send(`
        <!DOCTYPE html>
        <html lang="ko">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta name="color-scheme" content="light">
            
            <!-- Open Graph 태그 -->
            <meta property="og:title" content="${title}">
            <meta property="og:description" content="${description}">
            <meta property="og:image" content="${image}">
            <meta property="og:url" content="${url}">
            <meta property="og:type" content="website">

            <!-- Twitter Card 추가 -->
            <meta name="twitter:card" content="summary_large_image">
            <meta name="twitter:title" content="${title}">
            <meta name="twitter:description" content="${description}">
            <meta name="twitter:image" content="${image}">
            <title>${title}</title>
        </head>
        <body>
        </body>
        </html>
    `);
});

// ✅ Firebase Functions 등록
exports.serveOGPage = functions.https.onRequest(app);
