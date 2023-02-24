const app = require('./app');
const dbConnection = require('./database/config');
const { jobFeeds } = require('./jobs/job');

const start = async () => {
  await dbConnection();
  jobFeeds.start();
  const port = process.env.PORT || 5000;
  // eslint-disable-next-line no-console
  app.listen(port, () => console.log(`Server is running on port: ${port}`));
};

start();
