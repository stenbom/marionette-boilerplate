
/**
 * Module dependencies.
 */

var express = require('express')
  , mongoose = require('mongoose')
  , paginate = require('mongoose-pagination')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
});


var API_KEY = 'ae18db326857fb180f582d6fccf39f75ab266177';

var PostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    created: { type: Date, default: Date.now() },
    edited: { type: Date, default: Date.now() }
});

mongoose.connect('localhost', 'blog');
var Post = mongoose.model('Post', PostSchema);


function validateApiKey (req, res, next) {
    if (req.query.key && req.query.key === API_KEY) {
        console.log("=> valid api key")
        next();
    } else {
        console.log("- invalid api key")
        res.end(JSON.stringify({
            error: "invalid api key"
        }));
        next("- invalid api key");
    }
};

app.get('/api/posts', function (req, res) {
    var limit = (req.query.limit && req.query.limit <= 50) ? req.query.limit : 20;
    var page = Number(req.query.page) || 1;

    Post.find()
        .sort({date: 'desc'})
        .paginate(page, limit, function(err, posts, total) {
            if (err) return res.send(200, JSON.stringify(err));
            return res.send(200, {
                total: total,
                prev: 'http://localhost:3000/api/posts?limit=' + limit + '&page=' + (page-1),
                next: 'http://localhost:3000/api/posts?limit=' + limit + '&page=' + (page+1),
                result: posts
            });
        }
    );
});


app.get('/api/posts/:id', function (req, res) {
    var id = req.params.id || null;
    if (!id) return res.send(200, JSON.stringify({error : "Must pass an ID"}))
    Post.findById(id, function (err, post) {
        if (err) return res.send(200, JSON.stringify(err));
        return res.send(200, {
            result: JSON.stringify(post)
        });
    });
});

app.post('/api/posts', validateApiKey, function (req, res) {
   var post = new Post(req.body);
   post.save(function (err, post) {
       if (err) return res.send(200, JSON.stringify(err));
       return res.send(200, JSON.stringify(post));
   });
});

app.use(express.static('./app', {
    //maxAge: oneDay
}));

app.configure('development', function(){
  app.use(express.errorHandler());
});

exports.post = Post;

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});


