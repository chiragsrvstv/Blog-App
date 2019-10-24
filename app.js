var express   = require("express"),
    app       = express(),
    mongoose  = require("mongoose"),
    bodyParser = require("body-parser");
    methodOverride = require("method-override");
    expressSanitizer = require("express-sanitizer");

// App config
  mongoose.connect("mongodb://localhost/blog_app", {useNewUrlParser: true});
  app.use(express.static("public"));
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(expressSanitizer());
  app.use(methodOverride("_method"));


//server setup
  app.listen(3000, function(){
  console.log("serving BlogApp on localhost port: 3000");
  });

// mongoose schema
  var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
  });

// Mongoose model Config
  var Blog = mongoose.model("Blog", blogSchema);
// depreciation handling for mongoose
  mongoose.set('useFindAndModify', false);

// RESTFUL ROUTES

app.get("/", function (req, res) {
  res.redirect("/blogs");
});

// INDEX
app.get("/blogs", function (req, res){
  Blog.find({}, function(err, blogs){
    if(err){
      console.log("error");
    }
    else{
      res.render("index.ejs", {blogs: blogs})
    }
  })
});

// NEW ROUTE
app.get("/blogs/new", function(req, res){
  res.render("new.ejs");
});

// CREATE ROUTE


app.post("/blogs", function(req, res){
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.create(req.body.blog, function(err, newBlog){
    if(err){
      console.log("error");
      res.render("new.ejs");
    }
    else{
      console.log(newBlog);
      res.redirect("/");

    }
  });
});

// SHOW ROUTE
app.get("/blogs/:id", function(req, res) {
  Blog.findById(req.params.id, function(err, foundBlog){
    if(err){
      res.redirect("/");
      console.log("error in finding");
    }
    else{
      res.render("show.ejs", {blog: foundBlog});
    }
  });
});

// EDIT ROUTES
app.get("/blogs/:id/edit", function(req, res) {
  Blog.findById(req.params.id, function(err, foundBlog){
    if(err){
      res.render("/")
    }
    else{
      res.render("edit.ejs", {blog: foundBlog});
    }
  });
});

// UPDATE
app.put("/blogs/:id", function(req, res) {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
    if(err){
      return res.status(500).send("error error !");
      res.redirect("/blogs");
    }
    else{
      console.log("updated");
      res.redirect("/blogs/" + req.params.id);
    }
  });
});

// DELETE ROUTE
app.delete("/blogs/:id", function(req, res) {
  Blog.findByIdAndRemove(req.params.id, function(err) {
    if(err){
      res.redirect("/blogs");
    }
    else{
      res.redirect("/blogs");
    }
  });
});








