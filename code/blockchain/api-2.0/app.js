"use strict";
const log4js = require("log4js");
const logger = log4js.getLogger("BasicNetwork");
const bodyParser = require("body-parser");
const http = require("http");
const util = require("util");
const express = require("express");
const app = express();
const expressJWT = require("express-jwt");
const jwt = require("jsonwebtoken");
const bearerToken = require("express-bearer-token");
const cors = require("cors");
const constants = require("./config/constants.json");

const host = process.env.HOST || constants.host;
const port = process.env.PORT || constants.port;

const helper = require("./app/helper");
const invoke = require("./app/invoke");
const query = require("./app/query");

app.options("*", cors());
app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

// set secret variable
app.use(
  expressJWT({
    secret: constants.jwt_secret,
  }).unless({
    path: ["/user/register", "/user/login", "/admin/register", "/api/test"],
  })
);
app.use(bearerToken());
logger.level = "debug";

app.use((req, res, next) => {
  logger.debug("New req for %s", req.originalUrl);
  if (
    req.originalUrl.indexOf("/user/register") >= 0 ||
    req.originalUrl.indexOf("/user/login") >= 0 ||
    req.originalUrl.indexOf("/admin/register") >= 0 ||
    req.originalUrl.indexOf("/api/test") >= 0
  ) {
    return next();
  }

  var token = req.token;
  jwt.verify(token, constants.jwt_secret, (err, decoded) => {
    if (err) {
      console.log(`Error ================:${err}`);
      res.send({
        success: false,
        message:
          "Failed to authenticate token. Make sure to include the " +
          "token returned from /users call in the authorization header " +
          " as a Bearer token",
      });
      return;
    } else {
      req.username = decoded.username;
      req.orgname = decoded.orgName;
      logger.debug(
        util.format(
          "Decoded from JWT token: username - %s, orgname - %s",
          decoded.username,
          decoded.orgName
        )
      );
      return next();
    }
  });
});

var server = http.createServer(app).listen(port, function () {
  console.log(`Server started on ${port}`);
});
logger.info("****************** SERVER STARTED ************************");
logger.info("***************  http://%s:%s  ******************", host, port);
server.timeout = 240000;

function getErrorMessage(field) {
  var response = {
    success: false,
    message: field + " field is missing or Invalid in the request",
  };
  return response;
}
app.get("/api/test", function (req, res) {
  res.status(200).json({ message: "Blockchain sysytem is working" });
});

// Register and enroll user
app.post("/admin/register", async function (req, res) {
  var orgName = req.body.orgName;
  logger.debug("Org name  : " + orgName);
  if (!orgName) {
    res.json(getErrorMessage("'orgName'"));
    return;
  }

  let response = await helper.registerAdmin(orgName);
  logger.debug(
    "-- returned from registering the admin for organization %s",
    orgName
  );
  if (response && typeof response !== "string") {
    logger.debug(
      "Successfully registered the admin %s for organization %s",
      orgName
    );
    res.json(response);
  } else {
    logger.debug(
      "Failed to register the username %s for organization %s with::%s",
      orgName,
      response
    );
    res.json({ success: false, message: response });
  }
});

// Register and enroll user
app.post("/user/register", async function (req, res) {
  var username = req.body.username;
  var orgName = req.body.orgName;
  logger.debug("End point : /users");
  logger.debug("User name : " + username);
  logger.debug("Org name  : " + orgName);
  if (!username) {
    res.json(getErrorMessage("'username'"));
    return;
  }
  if (!orgName) {
    res.json(getErrorMessage("'orgName'"));
    return;
  }

  var token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + parseInt(constants.jwt_expiretime),
      username: username,
      orgName: orgName,
    },
    constants.jwt_secret
  );

  let response = await helper.registerUser(username, orgName);

  logger.debug(
    "-- returned from registering the username %s for organization %s",
    username,
    orgName
  );
  if (response && typeof response !== "string") {
    logger.debug(
      "Successfully registered the username %s for organization %s",
      username,
      orgName
    );
    response.token = token;
    res.json(response);
  } else {
    logger.debug(
      "Failed to register the username %s for organization %s with::%s",
      username,
      orgName,
      response
    );
    res.json({ success: false, message: response });
  }
});

// Login and get jwt
app.post("/user/login", async function (req, res) {
  var username = req.body.username;
  var orgName = req.body.orgName;
  logger.debug("End point : /user/login");
  logger.debug("User name : " + username);
  logger.debug("Org name  : " + orgName);
  if (!username) {
    res.json(getErrorMessage("'username'"));
    return;
  }
  if (!orgName) {
    res.json(getErrorMessage("'orgName'"));
    return;
  }

  var token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + parseInt(constants.jwt_expiretime),
      username: username,
      orgName: orgName,
    },
    constants.jwt_secret
  );

  let isUserRegistered = await helper.isUserRegistered(username, orgName);

  if (isUserRegistered) {
    res.json({ success: true, message: { token: token } });
  } else {
    res.json({
      success: false,
      message: `User with username ${username} is not registered with ${orgName}, Please register first.`,
    });
  }
});

// Invoke transaction on chaincode on target peers
app.post(
  "/channels/:channelName/chaincodes/:chaincodeName",
  async function (req, res) {
    try {
      logger.debug(
        "==================== INVOKE ON CHAINCODE =================="
      );
      var chaincodeName = req.params.chaincodeName;
      var channelName = req.params.channelName;
      var fcn = req.body.fcn;
      var args = req.body.args;
      logger.debug("channelName  : " + channelName);
      logger.debug("chaincodeName : " + chaincodeName);
      logger.debug("fcn  : " + fcn);
      logger.debug("args  : " + args);
      if (!chaincodeName) {
        res.status(400).json(getErrorMessage("'chaincodeName'"));
        return;
      }
      if (!channelName) {
        res.status(400).json(getErrorMessage("'channelName'"));
        return;
      }
      if (!fcn) {
        res.status(400).json(getErrorMessage("'fcn'"));
        return;
      }
      if (!args) {
        res.status(400).json(getErrorMessage("'args'"));
        return;
      }

      let response = await invoke.invokeTransaction(
        channelName,
        chaincodeName,
        fcn,
        args,
        req.username,
        req.orgname
      );

      const response_payload = {
        result: [response.result],
        error: null,
        errorData: null,
      };
      res.status(201).json(response_payload);
    } catch (error) {
      const response_payload = {
        result: null,
        error: error.name,
        errorData: error.message,
      };
      res.status(500).json(response_payload);
    }
  }
);

app.get(
  "/channels/:channelName/chaincodes/:chaincodeName",
  async function (req, res) {
    try {
      logger.debug(
        "==================== QUERY BY CHAINCODE =================="
      );

      var channelName = req.params.channelName;
      var chaincodeName = req.params.chaincodeName;
      console.log(`chaincode name is :${chaincodeName}`);
      let fcn = req.query.fcn;
      let args = req.query.args;

      logger.debug("channelName : " + channelName);
      logger.debug("chaincodeName : " + chaincodeName);
      logger.debug("fcn : " + fcn);
      logger.debug("args : " + args);

      if (!chaincodeName) {
        res.json(getErrorMessage("'chaincodeName'"));
        return;
      }
      if (!channelName) {
        res.json(getErrorMessage("'channelName'"));
        return;
      }
      if (!fcn) {
        res.json(getErrorMessage("'fcn'"));
        return;
      }
      if (!args) {
        res.json(getErrorMessage("'args'"));
        return;
      }
      console.log("args==========", args);
      args = args.replace(/'/g, '"');
      args = JSON.parse(args);
      logger.debug(args);

      let message = await query.query(
        channelName,
        chaincodeName,
        args,
        fcn,
        req.username,
        req.orgname
      );

      const response_payload = {
        result: message,
        error: null,
        errorData: null,
      };
      res.send(response_payload);
    } catch (error) {
      const response_payload = {
        result: null,
        error: error.name,
        errorData: error.message,
      };
      res.send(response_payload);
    }
  }
);
