var application = require("application");

application.mainModule = "main-page";
application.cssFile = "./app.css";

global.connectedState = "true";

application.start();