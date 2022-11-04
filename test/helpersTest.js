const assert = require('chai').assert;
const { getUserByEmail } = require('../helpers.js');

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
    const user = getUserByEmail("user3@example.com", testUsers);
    const expectedUserID = null;
    assert.equal(user, expectedUserID);
  });

 
});