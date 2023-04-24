const path = require('path');
const fs = require("fs");
/**  A function that takes url in the format protocal://subdomain.domain.com:port, and returns a directory name in the format subdomain_domain_com_port
 * 
 *  @param {string} url
 *  @returns {string} directoryName
 * 
*/
function getDirectoryName(url) {
  url = url.split('://')[1];
  const urlArray = url.split('.');
  return urlArray.join('_').split(':').join('_');
}



const cache = {};

function saveInMemoryCache(directory, filename, response) {
  if(cache[directory] === undefined){
    cache[directory] = {
      [filename]: response
    };
  }
  else {
    cache[directory][filename] = response;
  }
  
  return cache[directory][filename];
}

function getInMemoryCache(directory, filename){
  if(cache[directory] === undefined){
    return undefined;
  }
  else {
    return cache[directory][filename];
  }
}

function readObjectFromFile(directory = '', filename) {
  try{
    const filenameWithDirectory = path.resolve(__dirname, directory,filename);
    fs.accessSync(filenameWithDirectory, fs.constants.F_OK);
    const data = fs.readFileSync(filenameWithDirectory, "utf8");
    const obj = JSON.parse(data);
    return obj;
  }
   catch(err){
    return undefined;
  }

}

function saveObjectToFile(directory = '',filename, obj) {
  const data = JSON.stringify(obj);

  const filePathWithDirectory = path.resolve(__dirname, directory,filename);
  
  fs.access(filePathWithDirectory, fs.constants.F_OK, (err) => {
    if (err) {
      // File does not exist, create new file
      fs.mkdirSync(path.resolve(__dirname, directory), { recursive: true });
      fs.writeFile(filePathWithDirectory, data, (err) => {
        if (err) throw err;
        console.log(`Created and saved ${filename}`);
      });
    } else {
      // File exists, open in write mode (truncate the file)
      fs.writeFile(filePathWithDirectory, data, { flag: "w" }, (err) => {
        if (err) throw err;
        console.log(`Saved ${filePathWithDirectory}`);
      });
    }
  });
}


function getCachedResponse(directoryName = '', filename = '') {
  const cachedResonseFromFile = readObjectFromFile(directoryName,filename);
  if(cachedResonseFromFile !== undefined){
    saveInMemoryCache(directoryName, filename, cachedResonseFromFile);
    return cachedResonseFromFile;
  }
  
  // const cachedResponse = getInMemoryCache(directoryName, filename);
  // if(cachedResponse !== undefined){
  //   return cachedResponse;
  // }


  return undefined;
}

function writeCachedRespone(directoryName = '',filename = '', response = {}) {
  saveObjectToFile(directoryName,filename, response);
  return saveInMemoryCache(directoryName, filename, response);
}


function flushCache(directoryName = '') {
  // TODO
}

function flushAllCache(directoryName = '') {
  // TODO
}

module.exports = {
  getDirectoryName,
  getCachedResponse,
  writeCachedRespone,
  flushCache,
  flushAllCache
}