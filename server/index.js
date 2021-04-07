const express = require('express');
const app = express();
const port = process.env.PORT || 7777;
const VideoRequestData = require('./data/video-requests.data');
const UserData = require('./data/user.data');
const cors = require('cors');
const mongoose = require('./models/mongo.config');
const multer = require('multer');
if (!Object.keys(mongoose).length) return;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

// Express bellow v4.16.0
// ----------------------
const body = require('body-parser');

app.use(express.urlencoded({
  extended: true
}));

app.get('/', (req, res) =>
  res.send('Welcome to semicolon academy APIs, use /video-request to get data')
);

const upload = multer()
app.post('/video-request', upload.none(), async (req, res, next) => {
  console.log(req.body)
  const response = await VideoRequestData.createRequest(req.body);
  res.send(response);
  next();
});

app.get('/video-request', async (req, res, next) => {
  const { GetBy, SearchTerm, filterBy } = req.query
  let data;
  if (SearchTerm) {
    data = await VideoRequestData.searchRequests(SearchTerm,filterBy)
  }
  else {
    data = await VideoRequestData.getAllVideoRequests(filterBy);
  }
  data = data.sort((prev, next) => {
    if (GetBy === 'TopVotedFisrt') {
      if (prev.votes.ups.length - prev.votes.downs.length > next.votes.ups.length - next.votes.downs.length)
        return -1;
      else
        return 1
    }
  })
  res.send(data);
  next();
});

app.get('/users', async (req, res, next) => {
  const response = await UserData.getAllUsers(req.body);
  res.send(response);
  next();
});

app.post('/users/login', async (req, res, next) => {
  const response = await UserData.createUser(req.body);
  res.redirect(`http://localhost:5500?id=${response._id}`);
  next();
});

app.use(express.json());

app.put('/video-request/vote', async (req, res, next) => {
  const { id, vote_type, user_id } = req.body;
  const response = await VideoRequestData.updateVoteForRequest(id, vote_type, user_id);
  res.send(response.votes);
  next();
});

app.put('/video-request', async (req, res, next) => {
  const { id, status, resVideo } = req.body;

  const response = await VideoRequestData.updateRequest(id, status, resVideo);
  res.send(response);
  next();
});

app.delete('/video-request', async (req, res, next) => {
  const response = await VideoRequestData.deleteRequest(req.body.id);
  res.send(response);
  next();
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
