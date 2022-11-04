const assert = require('chai').assert;
const { getUserByEmail, urlsForUser } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

// terste cases for user emails
describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers)
    const expectedUserID = "userRandomID";
    assert.deepEqual(user.id, expectedUserID);
  });

  it('should return null if email is empty', function() {
    const user = getUserByEmail("", testUsers);
    const expectedUserID = null;
    assert.equal(user, expectedUserID);
  });

  it('should return null if email is invalid', function() {
    const user = getUserByEmail("@example.com", testUsers);
    const expectedUserID = null;
    assert.equal(user, expectedUserID);
  });

  const testshortID = {
    b6UTxQ: {
      longURL: "https://www.tsn.ca",
      userID: "userRandomID",
    },
    i3BoGr: {
      longURL: "https://www.google.ca",
      userID: "user2RandomID",
    },
  
  };

  describe('urlsForUser', function() {

    it('should return b6UTxQ for user userRandomID', function() {
      const urlObject = urlsForUser("userRandomID", testshortID);
      const expectedObject = {
        b6UTxQ: {
          longURL: "https://www.tsn.ca",
          userID: "userRandomID",
        }
      };
      assert.deepEqual(urlObject, expectedObject);
    });

    it('should return i3BoGr for user user2RandomID', function() {
      const urlObject = urlsForUser("user2RandomID", testshortID);
      const expectedObject = {
        i3BoGr: {
          longURL: "https://www.google.ca",
          userID: "user2RandomID",
        }
      };
      assert.deepEqual(urlObject, expectedObject);
    });
  
    it('should return empty for a non existant users', function() {
      const urlObject = urlsForUser("@example.com", testshortID);
      const expectedResult = {};
      assert.deepEqual(urlObject, expectedResult);
    });
  
  });





 
});