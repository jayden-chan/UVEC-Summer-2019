import * as express from 'express';
import {unlink, mkdirSync, stat} from 'fs';
import {resolve} from 'path';

import {verify_token} from './util';

import * as fileUpload from 'express-fileupload';
import * as bodyParser from 'body-parser';
import * as jwt from 'jsonwebtoken';
import * as sqlstring from 'sqlstring';

const JWT_SECRET = process.env.JWT_SECRET || 'Hello there testing';

const {Pool} = require('pg');
const client = new Pool({
  connectionString: 'postgres://jayden@localhost/users',
  ssl: false,
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

      try {
        mkdirSync(path);
      } catch (e) {
        if (e.code !== 'EEXIST') {
          res.status(500).send('Error occurred while created directory');
          return;
        }
      }

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

app.delete('/delete/:filename', (req, res) => {
  const user_name = verify_token(req.headers.authorization, JWT_SECRET);
  if (!user_name) {
    res.status(401).send('Not authorized');
    return;
  }

  unlink(
    resolve(__dirname, `../storage/${user_name}/${req.params.filename}`),
    err => {
      if (err) {
        res.status(500).send(err.toString());
      } else {
        res.status(200).send(`file ${req.body.file} deleted`);
      }
    },
  );
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

app.post('/signup', (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.status(400).send('Missing username or password');
    return;
  }
  const check_query = sqlstring.format(
    'SELECT * FROM data WHERE username = ?',
    [req.body.username],
  );

  const insert_query = sqlstring.format(
    `INSERT INTO data(username, password) VALUES(?, crypt(?, gen_salt('bf', 8)))`,
    [req.body.username, req.body.password],
  );

  client.query(check_query, (err, response) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error occurred with db check');
      return;
    }

    if (response.rows.length === 0) {
      client.query(insert_query, (err, response) => {
        if (err) {
          console.log(err);
          res.status(500).send('Error occurred with db check');
        } else {
          res.status(201).send('user created');
        }
      });
    } else {
      res.status(400).send('user already exists');
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
