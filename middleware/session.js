var session = require('client-sessions');

session({
  cookieName: 'session',
  secret: 'eg[isfd-8yF9adfasdfajlkjl;;to8',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
  httpOnly: true,
  secure: true,
  ephemeral: true
});

module.exports = session;
