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
const getUserByEmail = function(email, database) {
  for (const id of Object.keys(database)) {
    if (database[id]['email'] === email) {
      return database[id];
    }
  }
  return null;
};

// Returns urlDatabe for each user id matching
const urlsForUser = function(id, urlDatabase) {
  const userUrls = {};
  for (const shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === id) {
      userUrls[shortURL] = urlDatabase[shortURL].longURL;
    }
  }
  return userUrls;
};

module.exports = {
  generateRandomString,
  getUserByEmail,
  urlsForUser
};