const { initializeAgenda } = require("../config/database");

const startJobs = () => {
  const agenda = initializeAgenda();

  (async () => {
    agenda.on("ready", () => {
      console.log("Agenda connected to the database successfully");

      require("./checkStatus")(agenda);
      require("./dataCleanup")(agenda);

      agenda.every("1 minute", "checkStatus");
      agenda.every("10 days", "dataCleanup");
    });

    await agenda.start();

    (await agenda.jobs()).forEach((job) => {
      console.log(`Job ${job.attrs.name} started`);
    });
  })();

  agenda.on("error", (error) => {
    console.error("Agenda error:", error);
  });
};

module.exports = startJobs;
