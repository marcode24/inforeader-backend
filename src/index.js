const app = require("./app");
const path = require("path");
const dbConnection = require("./database/config");
const { jobFeeds } = require("./jobs/job");

(async function () {
  await dbConnection();
  jobFeeds.start();
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`Server is running on port: ${port}`));
})();
