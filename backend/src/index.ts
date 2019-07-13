import * as express from 'express';
import {unlink, mkdirSync, stat} from 'fs';
import {resolve} from 'path';

import {verify_token} from './util';

import * as fileUpload from 'express-fileupload';
import * as bodyParser from 'body-parser';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'Hello there testing';

const {Pool} = require('pg');
const client = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

const PORT = 3000;

const app = express();
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
  }),
);

app.use(bodyParser.json());

app.get('/hello', (req, res) => {
  res.status(200).send('Hello there testing');
});

app.post('/upload', (req, res) => {
  const user_name = verify_token(req.headers.authorization, JWT_SECRET);
  if (!user_name) {
    res.status(401).send('Not authorized');
    return;
  }

  console.log(user_name);

  if (req.files) {
    Object.entries(req.files).forEach(([k, v]) => {
      const path = resolve(__dirname, `../storage/${user_name}`);
      const full_path = `${path}/${k}`;

      mkdirSync(path);

      stat(full_path, function(err, stat) {
        if (err == null) {
          res.status(400).send('File already exists!');
        } else if (err.code === 'ENOENT') {
          if (v instanceof Array) {
            v.forEach(file => {
              file.mv(full_path, err => {
                if (err) {
                  res.status(500).send('Error occurred while writing file');
                } else {
                  res.status(201).send('File created');
                }
              });
            });
          } else {
            v.mv(full_path, err => {
              if (err) {
                res.status(500).send('Error occurred while writing file');
              } else {
                res.status(201).send('File created');
              }
            });
          }
        } else {
          console.log('Some other error: ', err.code);
          res.status(500).send('Internal server error occurred');
        }
      });
    });
  } else {
    res.status(200).send('hello');
  }
});

app.delete('/delete', (req, res) => {
  const user_name = verify_token(req.headers.authorization, JWT_SECRET);
  if (!user_name) {
    res.status(401).send('Not authorized');
    return;
  }

  if (!req.body.file) {
    res.status(400).send('no file provided');
  } else {
    unlink(
      resolve(__dirname, `../storage/${user_name}/${req.body.file}`),
      err => {
        if (err) {
          res.status(500).send(err.toString());
        } else {
          res.status(200).send(`file ${req.body.file} deleted`);
        }
      },
    );
  }
});

app.get('/file/:filename', (req, res) => {
  const user_name = verify_token(req.headers.authorization, JWT_SECRET);
  if (!user_name) {
    res.status(401).send('Not authorized');
    return;
  }

  const path = resolve(
    __dirname,
    `../storage/${user_name}/${req.params.filename}`,
  );

  stat(path, function(err, stat) {
    if (err == null) {
      res.sendFile(path);
    } else if (err.code === 'ENOENT') {
      res.status(400).send('File does not exist');
    } else {
      res.status(500).send('Internal server error occurred');
    }
  });
});

app.post('/login', (req, res) => {
  if (!req.body.user) {
    res.status(400).send('no user');
  } else {
    res
      .status(200)
      .send(jwt.sign(req.body.user.replace(/\s+/g, '_'), JWT_SECRET));
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
