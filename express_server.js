const express = require("express");
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

//////////////////////////////////////////////////////////////////////
/// Configuration/SETUP
//////////////////////////////////////////////////////////////////////

const app = express();
const PORT = 8080; // default port 8080

//////////////////////////////////////////////////////////////////////
/// MIDDLEWARE
//////////////////////////////////////////////////////////////////////

// make it readable for errors, and Get/Post in terminal
app.use(morgan('dev')); 
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//////////////////////////////////////////////////////////////////////
/// DATABASE
//////////////////////////////////////////////////////////////////////

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "userRandomID",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "user2RandomID",
  },

};

// example users according to compass
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

//////////////////////////////////////////////////////////////////////
/// Functions
//////////////////////////////////////////////////////////////////////

//for random string for short URL
const  generateRandomString = function() {
  const randoms = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const ranlength = 6;
  let ranString = "";

  for (let i = 0; i < ranlength; i++) {
    const ranNumber = Math.floor(Math.random() * randoms.length);
    ranString += randoms[ranNumber];
  }
  return ranString;
};

//Will search the email if it already exist, Return null if found
const getUserByEmail = function(email) {
  for (const id of Object.keys(users)) {
    if (users[id]['email'] === email) {
      return users[id];
    }
  }
  return null;
};

// Returns urlDatabe for each user id matching
const urlsForUser = function(id) {
  const userUrls = {};
  for (const shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === id) {
      userUrls[shortURL] = urlDatabase[shortURL].longURL;
    }
  }
  return userUrls;
};

//////////////////////////////////////////////////////////////////////
/// Routes - GET
//////////////////////////////////////////////////////////////////////

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/hello", (req, res) => {
  res.send("<html><body></b>Hello World</b></body></html>\n");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {

  if (!req.cookies.user_id) {  // if the user is not login, give 401 error
    return res.status(401).render('urls_no-access', { user: undefined });
  }
  const templateVars = {
    urls: urlsForUser(req.cookies.user_id),
    user: users[req.cookies.user_id]
  };
  res.render("urls_index", templateVars);
});

app.get("/login", (req, res) => {
  const user = users[req.cookies.user_id];

  if (user) { //if the user is already login return to urls page
    res.redirect("/urls");
    return;
  }
  res.render("urls_login", {user});
});

app.get("/urls/new", (req, res) => {
  if (!req.cookies.user_id) {  // if the user is not login, render no access page, redirects to register or login
    return res.status(401).render('urls_no-access', { user: undefined });
  }
  const templateVars = {
    user: users[req.cookies["user_id"]]
  };
  res.render("urls_new", templateVars);
});

app.get("/u/:id", (req, res) => {
  const shortURL = req.params.id; // retrieve the shortURL
  const longURL = urlDatabase[shortURL].longURL; // sends user to the webpage

  if (!longURL) {  // Short url does not exist in the database
    return res.status(404).render('urls_no-shortUrl', { user: undefined } );
  }
  res.redirect(longURL);
});

app.get("/urls/:id", (req, res) => {

  if (!req.cookies.user_id) {  // if the user is not login, give 401 error
    return res.status(401).render('urls_no-access', { user: undefined });
  }

  if (!urlDatabase[req.params.id]) {
    return res.status(404).send('404 error: URL requested not found. Please go \n<button onclick="history.back()">Back</button>');
  }

  if (urlDatabase[req.params.id].userID !== req.cookies.user_id) {
    return res.status(401).send(`401 error: Unable to access ${req.params.id} because its not yours. Please kindly get your own \n<button onclick="history.back()">Sorry</button>`);
  }

  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id].longURL,
    user: users[req.cookies.user_id]
  };
  res.render("urls_show", templateVars);
});

app.get("/register",(req, res) => {
  const user = users[req.cookies.user_id];

  if (user) { //if the user is already registered return to urls page
    res.redirect("/urls");
    return;
  }
  res.render("urls_register", {user});
});

//////////////////////////////////////////////////////////////////////
/// Routes - POST
//////////////////////////////////////////////////////////////////////

app.post("/urls", (req, res) => {

  if (!req.cookies.user_id) {
    return res.status(403).send('Only users logged in can create shortened URLs. Please go \n<button onclick="history.back()">Back</button>');
  }
  
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = { 
    longURL: req.body.longURL, 
    userID: req.cookies.user_id, 
  }
  res.redirect(`/urls/${shortURL}`);
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = getUserByEmail(email);

  //error handles for both password and email that dont match
  if (!user) {
    return res.status(403).send(`403 code error: ${email} does not exist. Please go \n<button onclick="history.back()">Back</button>`);
  }

  if (user.password !== password) {
    return res.status(403).send('403 code error: Incorrect password. Please go \n<button onclick="history.back()">Back</button>');
  }
  // set cookie for the user that is logged in
  res.cookie('user_id', user.id);
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/login");
});

app.post("/register", (req, res) => {
  const id = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;

  if (email === "" || password === "") {
    return res.status(400).send('400 code error: Email and/or Password field(s) are empty. Please go \n<button onclick="history.back()">Back</button>');
  }
  // If the user email already exist
  const user = getUserByEmail(email);
  if (user) {
    return res.status(400).send(`400 code error: ${email} already exists. Please go \n<button onclick="history.back()">Back</button>`);
  }

  users[id] = {
    id,
    email,
    password,
  };
  res.cookie("user_id", id);
  res.redirect("/urls");
});

app.post("/urls/:id/edit", (req, res) => {
  urlDatabase[req.params.id].longURL = req.body.longURL;
  res.redirect('/urls');
});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect('/urls');
});


//////////////////////////////////////////////////////////////////////
/// LISTENER
//////////////////////////////////////////////////////////////////////

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


