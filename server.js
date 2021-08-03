const express = require('express');
const app = express();
const http = require('http').createServer(app);
const bodyParser = require('body-parser');
const { runInNewContext } = require('vm');

app.use(bodyParser.json());
app.use(express.json());

const agentList = [
  {
    name : "John Scott",
    age : 45,
    location: 'Seatle',
    id : 1
  },
  {
    name : "Laura",
    location: 'Calgury',
    age : 29,
    id : 2
  },
  {
    name : "Peter",
    location: 'New York',
    age : 22,
    id : 3
  }
];

app.get('/api/list/agent', (request, response) => {
  response.status(200).send(agentList);
});


app.post('/api/agent/create', (request, response) => {
  if(!request.body.name || request.body.name == ''){
    response.status(400).send("Missing or Invalid Name");
    return;
  }

  if(!request.body.location || request.body.location == ''){
    response.status(400).send("Missing or Invalid Location");
    return;
  }

  if(!request.body.age || request.body.age == ''){
    response.status(400).send("Missing or Invalid Age");
    return;
  }
  
  const newAgent = {
    name : request.body.name,
    location : request.body.location,
    age : request.body.age,
    id : agentList.length + 1
  }

  agentList.push(newAgent);

  response.status(200).send("New Agent profile has been created")
});

app.put('/api/agent/edit/:id', (request, response) => {
  const id = request.params.id;
  const index = agentList.findIndex((value) => {
    return value.id == id;
  });

  if(request.body.name){
    agentList[index].name = request.body.name;
  }

  if(request.body.location){
    agentList[index].location = request.body.location
  }

  if(request.body.age){
    agentList[index].age = request.body.age;
  }

  response.status(200).send("Agent Profile has been updated successfully");
});

app.delete('/api/agent/delete/:id', (request, response) => {
  var id = request.params.id;
  var index = agentList.findIndex((value) => {
    return value.id == id;
  });

  agentList.splice(index, 1);

  response.status(200).send("Agent profile has been deleted successfully");
})


const port = process.env.port || 8080;
http.listen(port, () => {
  console.log('Server is running on port 8080');
})