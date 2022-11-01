const express = require("express");
const cookieParser = require('cookie-parser');

//////////////////////////////////////////////////////////////////////
/// Configuration/SETUP
//////////////////////////////////////////////////////////////////////

const app = express();
const PORT = 8080; // default port 8080

//////////////////////////////////////////////////////////////////////
/// MIDDLEWARE
//////////////////////////////////////////////////////////////////////

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//////////////////////////////////////////////////////////////////////
/// DATABASE 
//////////////////////////////////////////////////////////////////////

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
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
function generateRandomString() {
  const randoms = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const ranlength = 6;
  let ranString = "";

  for (let i = 0; i < ranlength; i++) {
    
    const ranNumber = Math.floor(Math.random() * randoms.length);
    ranString += randoms[ranNumber];
  }
  return ranString;
}

//Will search the email if it already exist, Return null if found
const getUserByEmail = function(email) {
  for (const id of Object.keys(users)) {
    if (users[id]['email'] === email) {
      return users[id];
    }
  }
  return null;
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
  const templateVars = { 
    urls: urlDatabase, 
    username: users[req.cookies["user_id"]] 
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = { 
    user: users[req.cookies["user_id"]] 
  };
  res.render("urls_new", templateVars);
});

app.get("/u/:id", (req, res) => {
  const shortURL = req.params.id;
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});

app.get("/urls/:id", (req, res) => {
  const templateVars = { 
    id: req.params.id, 
    longURL: urlDatabase[req.params.id], 
    user: users[req.cookies["user_id"]] 
  };
  res.render("urls_show", templateVars);
});

app.get("/register",(req, res) => {
  const templateVars = {
    user: users[req.cookies["user_id"]]
  };
  res.render("urls_register", templateVars);
});

//////////////////////////////////////////////////////////////////////
/// Routes - POST
//////////////////////////////////////////////////////////////////////

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  res.render("urls_show", templateVars);
});

app.post("/login", (req, res) => {
  res.cookie('username', req.body.username);
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
})

app.post("/urls/:id/edit", (req, res) => {
  urlDatabase[req.params.id] = req.body.longURL;
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


