const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
const https = require("https");
const cors = require("cors");
const fs = require("fs");
const path = require("path"); 
const { getDirectoryName, getCachedResponse, writeCachedRespone } = require("./utils")
const cacheMeConfig = require("./cacheMe.config");
const app = express();
dotenv.config();
app.use(cors());


function getFileName(url) {
  return url.split("/").join("_");
}

const cache = {};


app.use(express.json());
app.all("*", async (req, res) => {
  const url = req.originalUrl;
  const forwardServerUrl = cacheMeConfig.forwardServer.url;
  const directoryName = getDirectoryName(forwardServerUrl);

  // check if cached response exists
  console.log("Requesting Response from CacheMe", url);
  try {

    const filename = getFileName(url)+'.json';
    console.log(` | - Attempting reading cached response for ${url}`);

    const cachedResonse = getCachedResponse(directoryName, filename);
    
    if(cachedResonse === undefined){
      console.log(` | - Cached response not found for ${url}`);
      throw new Error("Cached response not found");
    }

    console.log(`Returning cached response for ${url}`);
    res.header = cachedResonse.responseHeader;
    return res.send(cachedResonse.data);

  } catch (err) {
    
    const serverUrl = `${forwardServerUrl}${url}`;
    console.log("Requesting from server", serverUrl);
    const options = {
      method: req.method,
      baseURL: forwardServerUrl,
      url: url,
      data: req.body,
      headers: { ...req.headers, host: null }, // forward headers to server
    };
    console.log(" | - Axios options", options);

    try {
      const response = await axios(options);
      const data = response.data;
      const requestHeader = req.headers;
      const responseHeader = response.headers;


      const filename = getFileName(url)+'.json';
      const directoryName = getDirectoryName(forwardServerUrl);

      const dataToCache = {
        data,
        requestHeader,
        responseHeader
      }

      console.log(` | - Caching response for ${url}`);

      console.log(directoryName);
      writeCachedRespone(directoryName, filename, dataToCache)  

      console.log(`Resnding response for ${url}`);
      res.header = response.headers;
      return res.send(response.data);
    } catch (error) {
      console.error(error);
      const statusCode = error.response ? error.response.status : 500;
      return res.status(statusCode).send(error);
    }
  }
});

app.listen(cacheMeConfig.cacheServer.port, () => {
  console.log("Proxy server listening on "+cacheMeConfig.cacheServer.port);
});
