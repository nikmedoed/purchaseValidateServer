var forever = require("forever-monitor");

var child = new forever.Monitor("index.js", {
  spinSleepTime: 1000,
  killTree: true,
  logFile: "logs/logMain", // Path to log output from forever process (when daemonized)
  outFile: "logs/logChild", // Path to log output from child stdout
  errFile: "logs/logChildErr", // Path to log output from child stderr
});

child.on("watch:restart", function (info) {
  console.error("Restarting script because " + info.file + " changed");
});

child.on("restart", function () {
  console.error("Forever restarting script for " + child.times + " time");
});

child.on("exit:code", function (code) {
  console.error("Forever detected script exited with code " + code);
});

child.start();
