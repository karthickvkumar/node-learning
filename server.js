const express = require('express');
const app = express();
const http = require('http').createServer(app);
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcrypt = require('bcrypt');

const TableName = "agent_profile";
const LoginTable = "login_info";

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
  const query = `SELECT * FROM ${TableName}`;
  
  connection.query(query, (error, result) => {
    if(error){
      response.status(500).send({
        message : "Error in listing the record from database",
        error
      });
      return;
    }

    response.status(200).send(result);
  });
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
  const Id = request.params.id;

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

   const query = `UPDATE ${TableName} SET Name='${agent_name}', Location='${agent_location}', Age=${agent_age} WHERE Id=${Id}`;

   connection.query(query, (error, result) => {
      if(error){
        response.status(500).send({
          message : "Error in updatating the values into Database",
          error
        });
        return;
      }

      response.status(200).send({
        message : 'Successfully updated the record',
        result
      })
   })

});

app.delete('/api/agent/delete/:id', (request, response) => {
  const Id = request.params.id;

  const query = `DELETE FROM ${TableName} WHERE Id=${Id}`;
  
  connection.query(query, (error, result) => {
    if(error){
      response.status(500).send({
        messsage : "Error in deleting a record from database",
        error
      });
      return;
    }

    response.status(200).send({
      message : "Successfully deteted the record",
      result
    })
  })
})

app.post('/api/register', async (request, response) => {
  const name = request.body.name;
  const email = request.body.email;
  const password = request.body.password;
  const curretDate = new Date();

  let hashPassword = await bcrypt.hash(password, 10);

  const query = `INSERT INTO ${LoginTable} (Name, Email, Password, Created_at) VALUES ('${name}', '${email}', '${hashPassword}', '${curretDate}')`;

  connection.query(query, (error, result) => {
    if(error){
      response.status(500).send({
        message : "Error while registering User account",
        error
      })
    }

    response.status(200).send({
      message : "Successfully created the user account",
      result
    })
  })

})


const port = process.env.port || 8080;
http.listen(port, () => {
  console.log('Server is running on port 8080');
})