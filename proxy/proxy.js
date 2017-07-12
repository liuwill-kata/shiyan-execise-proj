var http = require('http');
var https = require('https');
var path = require('path');

// Create HTTP Server
http.createServer(function(req, res) {

    var uri = 'https://github.com/' + req.url;
    var file = req.url.replace(/\?.*/ig, '');
    var ext = path.extname(file);
    var type = getContentType(ext);

    res.writeHead(200, {
        'Content-Type': type
    });

    https.get(uri, function(response) {
        // TODO
	response.pipe(res)
    });
}).listen(3000);

// Get content-type
var getContentType = function(ext) {
    var contentType = '';
    switch (ext) {
        case "":
            contentType = "text/html";
            break;
        case ".html":
            contentType = "text/html";
            break;
        case ".js":
            contentType = "text/javascriptss";
            break;
        case ".css":
            contentType = "text/css";
            break;
        case ".gif":
            contentType = "image/gif";
            break;
        case ".jpg":
            contentType = "image/jpeg";
            break;
        case ".png":
            contentType = "image/png";
            break;
        case ".ico":
            contentType = "image/icon";
            break;
        default:
            contentType = "application/octet-stream";
    }

    return contentType;
};

