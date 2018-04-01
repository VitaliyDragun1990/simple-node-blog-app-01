const express = require('express'),
    app = express(),
    expressSanitizer = require('express-sanitizer'),
    methodOverride = require('method-override'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');

// APP CONFIG
mongoose.connect('mongodb://localhost/restful_blog_app');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(methodOverride('_method'));


// MONGOOSE/MODEL CONFIG
const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now() }
});
const Blog = mongoose.model('Blog', blogSchema);

// RESTFUL ROUTES

/*GET Index route*/
app.get('/', (req, res) => {
    res.redirect('/blogs');
});

/*GET all blogs*/
app.get('/blogs', (req, res) => {
    Blog.find({})
        .then(blogs => res.render('index', { blogs }))
        .catch(err => console.log(err));
});

/*GET page with form for creating new blog*/
app.get('/blogs/new', (req, res) => {
    res.render('new');
});

/*GET page with form for editing particular blog*/
app.get('/blogs/:id/edit', (req, res) => {
    Blog.findById(req.params.id)
        .then(blog => res.render('edit', { blog }))
        .catch(err => res.redirect('/blogs'));
});

/*GET Show particular blog*/
app.get('/blogs/:id', (req, res) => {
    Blog.findById(req.params.id)
        .then(blog => res.render('show', { blog }))
        .catch(err => res.redirect('/blogs'))
});

/*POST create new blog*/
app.post('/blogs', (req, res) => {
    // sanitize blog.body to prevent malicious code appearance in body content
    req.body['blog']['body'] = req.sanitize(req.body['blog']['body']);

    Blog.create(req.body['blog'])
        .then(blog => res.redirect('/blogs'))
        .catch(err => res.render('new'));
});

/*PUT Edit particular blog*/
app.put('/blogs/:id', (req, res) => {
    // sanitize blog.body to prevent malicious code appearance in body content
    req.body['blog']['body'] = req.sanitize(req.body['blog']['body']);

    Blog.findByIdAndUpdate(req.params.id, req.body.blog)
        .then(blog => res.redirect(`/blogs/${req.params.id}`))
        .catch(err => res.redirect('/blogs'));
});

/*DELETE Delete particular blog*/
app.delete('/blogs/:id', (req, res) => {
   Blog.findByIdAndRemove(req.params.id)
       .then(blog => res.redirect('/blogs'))
       .catch(err => res.redirect('/blogs'))
});

app.listen(3000, 'localhost', () => console.log('Server is running'));