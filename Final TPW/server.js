const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const server = http.createServer((req, res) => {
    let filePath = new URL(req.url, `http://${req.headers.host}`).pathname;
    
    // Default to index.html for root request
    if (filePath === '/') {
        filePath = '/form.html';
    }
    
    // Resolve file path
    filePath = path.join(__dirname, filePath);
    
    // Get file extension
    const ext = path.extname(filePath);
    
    // Read and serve the file
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - File Not Found</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end('Sorry, check with the site admin for error: ' + err, 'utf-8');
            }
        } else {
            // Set content type based on file extension
            let contentType = 'text/html';
            if (ext === '.js') {
                contentType = 'application/javascript';
            } else if (ext === '.css') {
                contentType = 'text/css';
            } else if (ext === '.json') {
                contentType = 'application/json';
            } else if (ext === '.txt') {
                contentType = 'text/plain';
            }
            
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`\n✓ Application Form Server Running!`);
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`  Open your browser and go to:`);
    console.log(`  http://localhost:${PORT}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
});
