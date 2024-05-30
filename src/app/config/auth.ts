export default {
  jwt: {
    secret: process.env.APP_SECRET || 'app_secret',
    expiresInToken: 7 * 20 * 60 * 60, //7h
  },
};
