require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { urlencoded } = require('express');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }))

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ 
    original_url : 'https://freeCodeCamp.org',        short_url : 1
  });
});

const originalURLs = []
const shortURLs = []

app.post('/api/shorturl', function(req, res) {
  const url = req.body.url
  const foundIndex = originalURLs.indexOf(url)

  if (!url.includes('https://') && !url.includes('http://') ) {
    return res.json({ error: 'invalid url' })    
  }
  
  if (foundIndex < 0) {
    originalURLs.push(url)
    shortURLs.push(shortURLs.length)

    return   res.json({ 
      original_url : url,        
      short_url : shortURLs.length - 1
    })
  }

  return res.json({
    original_url : url,        
    short_url : shortURLs[foundIndex]
  })
})

app.get('/api/shorturl/:shorturl', (req, res) =>{
  const shortUrl = parseInt(req.params.shorturl)
  const foundIndex = shortURLs.indexOf(shortUrl)

  if (foundIndex < 0) {
    return res.json({ "error": "No short URL found for the given input"})
  }

  res.redirect(originalURLs[foundIndex])
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
