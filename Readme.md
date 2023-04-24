# CacheMe
Speed up your frontend development efforts by proxying server requests with CacheMe.

CacheMe saves the server's response as a JSON file and serves the same response for identical requests. To refresh the response, simply delete the saved response file.

## Installation
Clone the Repository

using SSH:
```bash
git clone git@github.com:ashwaniarya/cache-me.git
```

using HTTPS:
```bash
git clone https://github.com/ashwaniarya/cache-me.git
```

## Install Dependencies
```bash
npm install
```

## Run the Server
```bash
npm start
```

Alternatively, you can use:

```bash
node index.js
```

Enjoy a faster frontend development experience!

## Limitations
OAuth may not work without whitelisting the server domain.
Based on token expiration, you might need to delete the saved response to allow a new response to be saved.