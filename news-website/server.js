const express = require('express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3');
const cors=require('cors')
const app = express();
const port = 3000;
// Middleware for parsing form data
app.use(bodyParser.urlencoded({ extended: true }));

// Static folder for public files (like CSS)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); 
app.use(cors())

// Set view engine to EJS for rendering HTML
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Connect to SQLite database
const dbPath = path.join(__dirname, 'output.sqlite3');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Middleware for sessions
app.use(
  session({
    secret: '2035d3c0b2d1b8d10f8c184510e97958161c0d65393cc3ec2811f260649870fa',
    resave: false,
    saveUninitialized: false,
  })
);

// Import routes

//app.use("/",require('./routes/root'))
app.use('/admin', require('./routes/admin'));
//new:
const authRoutes = require('./routes/users');
app.use('/auth', authRoutes);
const homeNews=require('./routes/news')
app.use('/home',homeNews)
// Home page route: Fetch and display news and products
/* app.get('/', (req, res) => {
  db.all('SELECT * FROM "New Parts"', (err, rows) => {
    if (err) {
      console.error('Error executing query:', err.message);
      res.status(500).send('Internal Server Error');
    } else {
      res.render('index', { data: rows });
    }
  });
}); */
// 404 handler: Catch all other routes and display "Page Not Found"
app.all('*', (req, res) => {
  console.log("404")
  res.status(404)
  if (req.accepts('html')) {
      res.sendFile(path.join(__dirname, 'views', '404.html'))
  } else if (req.accepts('json')) {
      res.json({ message: '404 Not Found' })
  } else {
      res.type('txt').send('404 Not Found')
  }
})


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
}); 