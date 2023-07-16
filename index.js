//const http = require('http'); usando express
const express = require('express');
//const request = require('http');
const server = express();
server.use(express.json());
server.use((request, response, next)=>{
  console.log(request.method);
  console.log(request.path);
  console.log(request.body)
  console.log('-------------');
  next();
});

const puerto = 3001;
/* SE EMPIEZA A UTILIZAR EXPRESS
const server = http.createServer((request, response) => {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.end('Hola mundo, desde Node.js - Soy Leo');
});
*/
//fragmento de codigo de Midudev
let notes = [
  {
    "id": 1,
    "content": "Tengo que estudiar NODE JS",
    "date": "2019-05-30T17:30:31.098Z",
    "important": true
  },
  {
    "id": 2,
    "content": "Tengo que estudiar REACT",
    "date": "2019-05-30T17:30:31.098Z",
    "important": true
  },
  {
    "id": 3,
    "content": "Tengo que estudiar ENGLISH",
    "date": "2019-05-30T17:30:31.098Z",
    "important": true
  },
  {
    "id": 4,
    "content": "Tengo que descansar",
    "date": "2019-05-30T17:30:31.098Z",
    "important": false
  }
]
server.get('/', (request, response) => {
  response.send('<h1>Hola mundo, estoy usando express</h1>');
});
//obtener todos el objeto
server.get('/api/notes', (request, response) => {
  response.json(notes);
});
//obtener un fragmento de ese objeto de manera dinamica
//en este caso, obtenemos una nota a partir de un id del JSON
server.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id);
  const nota = notes.find(nota => nota.id == id);
  if (nota) {
    response.json(nota);
  } else {
    response.status(404).end();
  }
});
//en este caso, se desea eliminar una nota del JSON
//con la particularidad de que se elimina de la memoria
//al levantar de nuevo el servidor, las notas vuelven a su estado original
//para que haya persistencia, se debe usar MongoDB
server.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter(nota => nota.id !== id);
  response.status(204).end();
});
//en este caso, vamos a insertar un nuevo recurso dentro de las notas
//para ello se utiliza el comando POST
server.post('/api/notes', (request, response) => {
  const note = request.body;
  if (!note||!note.content) {
    return response.status(400).json({
      error: "note.content is missing"
    });
  }

  const ids = notes.map(note => note.id);
  const maxId = Math.max(...ids);
  const newNote = {
    id: maxId + 1,
    content: note.content,
    important: typeof note.important !== 'undefined' ? note.important : false,
    date: new Date().toISOString()
  }
  //notes= notes(...notes,newNote);
  notes = notes.concat(newNote);
  response.status(201).json(newNote);
});
/**
 * En este código, se define una ruta POST en /api/notes que se utiliza para agregar una nueva nota 
 * a la matriz notes.
request.body se utiliza para acceder al cuerpo de la solicitud, que se espera que contenga los datos
 de la nueva nota.
const ids = notes.map(note => note.id) crea un array ids que contiene todos los IDs de las notas
 existentes en la matriz notes.
const maxId = Math.max(...ids) utiliza el operador de propagación (...) junto con Math.max()
 para encontrar el ID máximo en la matriz ids.
const newNote = { ... } crea un objeto newNote que representa la nueva nota que se va a agregar.
id: maxId + 1 asigna un ID único a la nueva nota agregando 1 al ID máximo existente.
content: note.content asigna el contenido de la nueva nota proporcionado en el cuerpo de la solicitud.
important: typeof note.important !== 'undefined' ? note.important : false verifica si se proporcionó 
una propiedad important en el cuerpo de la solicitud. Si está definida, se asigna su valor, de lo contrario, 
se asigna false por defecto.
date: new Date().toISOString() establece la fecha actual en formato ISO de la nueva nota.
notes = notes.concat(newNote) agrega la nueva nota a la matriz notes utilizando el método concat().
response.json(newNote) envía la nueva nota como respuesta en formato JSON.
 */
server.use((request,response)=>{
response.status(404).json({
error:'Not Found'
});
});

server.listen(puerto, (error) => {
  if (error) {
    console.error('Error al iniciar el servidor:', error);
  } else {
    console.log('El servidor está corriendo en el puerto', puerto);
  }
});
