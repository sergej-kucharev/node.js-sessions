// Create a server to demo/mockup the session management API
var http = require('http'),
    sys = require('sys'),
    Sessions = require('./Sessions');

    
var SessionManager = new Sessions.manager({
    lifetime: 10
});

SessionManager.addListener("create", function(sid){
    sys.puts("<<< Created Session "+sid);
});
    
SessionManager.addListener("change", function(sid, data){
    sys.puts("<<< "+sid+"\t"+sys.inspect(data));
});

SessionManager.addListener("destroy", function(sid){
    sys.puts("<<< Destroyed Session "+sid);
});

http.createServer(function(req, resp) {
    var session = SessionManager.lookupOrCreate(req, resp);
    
    var history = session.data("history");
    history = history ? history : [];
    
    history.push(req.uri.path);
    
    var ret = "<p> Hi there, here is your browsing history: </p><ul>";
    for(var i=0;i<history.length; ++i){
        ret += '<li><a href="'+history[i]+'">'+history[i]+'</a></li>';
    }
    ret += "</ul><p> Here are some other fascinating pages you can visit on our lovely site: </p><ul><li><a href=foo>foo</a><li><a href=bar>bar</a><li><a href=quux>quux</a></ul>";

    session.data("history", history);
    resp.sendHeader(200, {
        'Content-Type': 'text/html'
        // How awesome am I? no need to set-cookie here!
    });
    
    
    
    resp.sendBody(ret);
    resp.finish();
    
}).listen("8080", "");
