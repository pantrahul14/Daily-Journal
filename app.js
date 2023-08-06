const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://pantrahul14:j34wsGh6RF8lJ4xy@cluster0.2pl1dtf.mongodb.net/?retryWrites=true&w=majority");

const blogSchema = mongoose.Schema({ title: String, body: String });

const Blog = mongoose.model("Blog", blogSchema);

const homeStartingContent = "Welcome to Your Daily Journal, your personal haven for self-discovery, introspection, and personal growth. We believe that each day offers us an opportunity to learn, evolve, and embrace the beauty of life. Our mission is to empower you to embark on a journey of self-awareness, mindfulness, and positive transformation through the power of daily journaling. Start Your Journaling Journey Today Carve out a few minutes each day to nurture your inner world and embrace the fullness of life. Your Daily Journal is your ally, offering a space for self-expression and growth, free from judgment or constraint. Begin your transformative journey of journaling today. Sign up now and awaken the power of introspection within you.  ";
const aboutContent = "At Daily Journal, we believe in the power of stories to inspire, educate, and connect people from all walks of life. Our blog is dedicated to curating a diverse range of content that sparks curiosity, ignites creativity, and fosters a sense of community among our readers.";
const contactContent = "We would love to hear from you! Whether you have a question, feedback, collaboration ideas, or just want to say hello, feel free to get in touch with us. At Daily Journal, we value our readers and community, and your input is essential to us.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get('/', function (req, res) {
  Blog.find((err, blogs) => {
    if (err) {
      console.log(err);
    } else {
      res.render("home", { homeStartingContent: homeStartingContent, posts: blogs });
    }
  });
});

app.get('/about', function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

app.get('/contact', function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

app.get('/compose', function (req, res) {
  res.render("compose");
});

app.get("/posts/:topic", function (req, res) {
  const urlParameter = _.startCase(_.toLower(req.params.topic));
  Blog.findOne({ title: urlParameter }, (err, blog) => {
    if (err) {
      console.log(err);
    } else {
      res.render("post", { post: blog });
    }
  });
});

app.post('/compose', function (req, res) {
  const post = new Blog({
    title: _.startCase(_.toLower(req.body.headin)),
    body: req.body.postText
  });
  post.save((err) => {
    if (!err) {
      res.redirect("/");
    }
  });
});

app.post('/delete', (req, res) => {
  const postTitle = req.body.button;
  Blog.deleteOne({ title: postTitle }, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Successfully deleted!");
      res.redirect("/");
    }
  });
});

const port = 8000; // Change to the desired port number
app.listen(port, function () {
  console.log("Server started on port " + port);
});
