const express = require('express');
const app = express();
const http = require('http').createServer(app);
const bodyParser = require('body-parser');
const mysql = require('mysql');
const TableName = "agent_profile";

app.use(bodyParser.json());
app.use(express.json());

const connection = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : '',
  database : 'node_js_tutorial'
});

connection.connect((error) => {
  if(error){
    console.log("Error in connecting the My SQL Server", error);
    return;
  }

  console.log("Successfully connected to the MySql Server")
});

app.post('/api/create/table', (request, response) => {
  const query = `CREATE TABLE ${TableName} (Name varchar(255), Location varchar(255), Age int(3), Id int NOT NULL AUTO_INCREMENT, PRIMARY KEY(Id))`;

  connection.query(query, (error, result) => {
      if(error){
        response.status(500).send({
          message : "Problem connecting to the Server",
          error
        });
        return;
      }

    response.status(200).send({
      message : "Successfully created a New Table",
      result
    })
  });
});

app.get('/api/list/agent', (request, response) => {

});

app.post('/api/agent/create', (request, response) => {
   const agent_name = request.body.name;
   if(!agent_name){
     response.status(400).send({
       message : "Missing Agent Name"
     });
     return;
   }

   const agent_location = request.body.location;
   if(!agent_location){
    response.status(400).send({
      message : "Missing Agent Location"
    });
    return;
   }

   const agent_age = request.body.age;
   if(!agent_age){
     response.status(400).send({
       message : "Missing Agent Age"
     });
     return;
   }

  const query = `INSERT INTO ${TableName} (Name, Location, Age) VALUES ('${agent_name}', '${agent_location}', ${agent_age})`;

  connection.query(query, (error, result) => {
    if(error){
      response.status(500).send({
        message : "Error occured while inerting the record to table",
        error
      });
      return;
    }

    response.status(200).send({
      message : "Successfully created a new record in the Table",
      result
    })
  })
});

app.put('/api/agent/edit/:id', (request, response) => {
 
});

app.delete('/api/agent/delete/:id', (request, response) => {
  
})


const port = process.env.port || 8080;
http.listen(port, () => {
  console.log('Server is running on port 8080');
})