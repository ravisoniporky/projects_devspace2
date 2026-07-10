const express = require("express");

const TENANT_ID = process.env.MS_TENANT_ID;
const CLIENT_ID = process.env.MS_CLIENT_ID;
const CLIENT_SECRET = process.env.MS_CLIENT_SECRET;
const PORT = process.env.PORT || 3001;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "https://dev.porky.com";

if (!TENANT_ID || !CLIENT_ID || !CLIENT_SECRET) {
    throw new Error("MS_TENANT_ID, MS_CLIENT_ID and MS_CLIENT_SECRET must be set as environment variables.");
}

let cachedToken = null;
let tokenExpiresAt = 0;

async function getAccessToken() {
    if (cachedToken && Date.now() < tokenExpiresAt) {
        return cachedToken;
    }

    const params = new URLSearchParams({
        grant_type: "client_credentials",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        scope: "https://graph.microsoft.com/.default"
    });

    const response = await fetch(`https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    });

    if (!response.ok) {
        throw new Error(`Token request failed: ${response.status} ${await response.text()}`);
    }

    const data = await response.json();
    cachedToken = data.access_token;
    tokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000;
    return cachedToken;
}

const app = express();

app.use((req, res, next) => {
    res.set("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
    if (req.method === "OPTIONS") {
        res.set("Access-Control-Allow-Methods", "GET");
        return res.sendStatus(204);
    }
    next();
});

// Same path the UI5 app calls (sap.app/dataSources/msGraphMapping/uri).
app.get("/msgraph/v1.0/*", async (req, res) => {
    try {
        const token = await getAccessToken();
        const graphPath = req.originalUrl.replace(/^\/msgraph\/v1\.0/, "");
        const graphResponse = await fetch(`https://graph.microsoft.com/v1.0${graphPath}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        res.status(graphResponse.status);
        res.set("Content-Type", graphResponse.headers.get("content-type") || "application/octet-stream");
        res.send(Buffer.from(await graphResponse.arrayBuffer()));
    } catch (error) {
        res.status(502).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`msgraph-proxy listening on port ${PORT}`);
});
