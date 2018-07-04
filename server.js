// Exxon Web Service Access Oracle database

'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var oracledb = require('oracledb');

var app = express();
app.use(bodyParser.json());

var port = 3000;

oracledb.outFormat = oracledb.OBJECT;

/* Get all employees data */
app.get('/employee', function (req, res) {
  doGetConnection(res, function(err, connection) {
    if (err)
      return;
    connection.execute(
      "SELECT b.data FROM scott.employee b",
      function (err, result) {
        if (err) {
          res.set('Content-Type', 'application/json');
          res.status(500).send(JSON.stringify({
            status: 500,
            message: "Error getting the employee's profile",
            detailed_message: err.message
          }));
        } else {
          res.contentType('application/json').status(200);
          res.send(JSON.stringify(result.rows));
        }
        doRelease(connection, "GET /employee");
      });
  });
});

/* Get the employee data by name */
app.get('/employee/:NAME', function (req, res) {
  doGetConnection(res, function(err, connection) {
    if (err)
      return;
    connection.execute(
      "SELECT b.data FROM scott.employee b WHERE b.data.name = :f",
      { f: req.params.NAME },
      function (err, result) {
        if (err) {
          res.set('Content-Type', 'application/json');
          res.status(500).send(JSON.stringify({
            status: 500,
            message: "Error getting the employee's profile",
            detailed_message: err.message
          }));
        } else if (result.rows.length < 1) {
          res.set('Content-Type', 'application/json');
          res.status(404).send(JSON.stringify({
            status: 404,
            message: "Employee doesn't exist",
            detailed_message: ""
          }));
        } else {
          res.contentType('application/json');
          res.status(200).send(JSON.stringify(result.rows));
        }
        doRelease(connection, "GET /employee/" + req.params.NAME);
      });
  });
});

/* POST - Create a new employee */
app.post('/employee', function (req, res) {
  if ("application/json" !== req.get('Content-Type')) {
    res.set('Content-Type', 'application/json').status(415).send(JSON.stringify({
      status: 415,
      message: "Wrong content-type. Only application/json is supported",
      detailed_message: null
    }));
    return;
  }
  doGetConnection(res, function(err, connection) {
    if (err)
      return;
    connection.execute(
      "INSERT INTO scott.employee VALUES (:s)",
      { s: JSON.stringify(req.body) },
      { autoCommit: true },
      function (err) {
        if (err) {
          res.set('Content-Type', 'application/json');
          res.status(400).send(JSON.stringify({
            status: 400,
            message: "Input Error",
            detailed_message: err.message
          }));
        } else {
          // Successfully created the resource
          res.status(201).set('Location', '/employee/' + req.body.NAME).end();
        }
        doRelease(connection, "POST /employee");
      });
  });
});

/* Delete an employee by name */
app.delete('/employee/:NAME', function (req, res) {
  doGetConnection(res, function(err, connection) {
    if (err)
      return;
    connection.execute(
      "DELETE FROM scott.employee b WHERE b.data.name = :f",
      { f: req.params.NAME },
      { autoCommit: true },
      function (err, result) {
        if (err) {
          res.set('Content-Type', 'application/json');
          res.status(400).send(JSON.stringify({
            status: 400,
            message: "Input Error",
            detailed_message: err.message
          }));
        } else if (result.rowsAffected === 0) {
          res.set('Content-Type', 'application/json');
          res.status(400).send(JSON.stringify({
            status: 400,
            message: "Employee doesn't exist",
            detailed_message: ""
          }));
        } else {
          // Resource successfully deleted. Sending an empty response body.
          res.status(204).end();
        }

        doRelease(connection, "DELETE /employee/" + req.params.NAME);
      });
  });
});

/* Get a connection from the pool */
function doGetConnection(res, cb) {
  oracledb.getConnection(function (err, connection) {
    if (err) {
      res.set('Content-Type', 'application/json');
      res.status(500).send(JSON.stringify({
        status: 500,
        message: "Error getting DB connection",
        detailed_message: err.message
      }));
    } else {
      cb(err, connection);
    }
  });
}

/* Release a connection to the pool */
function doRelease(connection, message) {
  connection.close(
    function(err) {
      if (err)
        console.error(err);
      else
        console.log(message + " : Connection released");
    });
}

function run() {
  oracledb.createPool({
      user: process.env.NODE_ORACLEDB_USER,
      password: process.env.NODE_ORACLEDB_PASSWORD,
      connectString: process.env.NODE_ORACLEDB_CONNECTIONSTRING
    },
    function(err) {
      if (err)
        console.error("createPool() error: " + err.message);
      else
        var server = app.listen(port,
          function () {
            console.log('Server is listening on port ' + server.address().port);
          });
    });
}


process
  .on('SIGTERM', function() {
    console.log("\nTerminating");
    process.exit(0);
  })
  .on('SIGINT', function() {
    console.log("\nTerminating");
    process.exit(0);
  });

run();