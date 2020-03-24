module.exports.logger = require("tracer").colorConsole({
  format: [
    "{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})", //default format
    {
      error: "{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})" // error format
    }
  ],
  dateformat: "HH:MM:ss.L",
  preprocess: function(data) {
    data.title = data.title.toUpperCase();
  },
  level: "error"
});

module.exports.mssqlconfig = {
  user: process.env.DB_USERNAME || "progr4",
  password: process.env.DB_PASSWORD || "password123",
  server: process.env.DB_HOSTNAME || "localhost",
  database: process.env.DB_DATABASENAME || "Prog4-Eindopdracht1",
  port: process.env.SQLPORT || 1433,
  driver: "msnodesql",
  connectionTimeout: 1500,
  options: {
    // 'true' if you're on Windows Azure
    encrypt: false
  }
};
