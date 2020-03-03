const championJSON = require('./champions.json');

let currentUser = {};
const users = {};
const champions = championJSON;

const respondJSON = (request, response, status, object) => {
  // Set status code and type
  response.writeHead(status, { 'Content-Type': 'application/json' });
  // Stringify and write response obj
  response.write(JSON.stringify(object));
  // End response
  response.end();
};

const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

const getChamps = (request, response, body) => {
  // Display champs
  const { term } = body;

  let filtered;

  if (term && champions.data[term]) {
    filtered = champions.data[term];
  } else {
    filtered = champions.data;
  }

  const responseJSON = {
    message: 'Loaded searched champs',
    champ: filtered,
  };

  return respondJSON(request, response, 200, responseJSON);
};

const login = (request, response, body) => {
  const responseJSON = {
    message: 'Summoner name is required.',
  };

  if (!body.name) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  let responseCode = 201;

  // Search for user already created
  if (users[body.name]) {
    responseCode = 204;
  } else {
    users[body.name] = {};
  }

  users[body.name].name = body.name;
  users[body.name].favorites = {};
  currentUser = users[body.name];

  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    responseJSON.name = body.name;
    return respondJSON(request, response, responseCode, responseJSON);
  }
  return respondJSONMeta(request, response, responseCode);

  // If user exists get and display favorites
};

const getFavorites = (request, response) => {
  const responseJSON = {
    message: 'Must be logged in',
  };

  if (!currentUser) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  if (!currentUser.favorites) {
    responseJSON.id = 'No Favorites Found';
    return respondJSON(request, response, 400, responseJSON);
  }

  const responseCode = 201;

  responseJSON.message = 'Favorites Found';
  responseJSON.favorites = currentUser.favorites;
  return respondJSON(request, response, responseCode, responseJSON);
};

const notReal = (request, response) => {
  const responseJSON = {
    message: 'Error: Not Real',
  };

  respondJSON(request, response, 404, responseJSON);
};

const notRealMeta = (request, response) => respondJSONMeta(request, response, 404);

const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  respondJSON(request, response, 404, responseJSON);
};

module.exports = {
  notReal,
  notRealMeta,
  notFound,
  login,
  getChamps,
  getFavorites,
};
