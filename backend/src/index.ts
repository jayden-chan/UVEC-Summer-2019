import * as express from 'express';
import {writeFile, stat} from 'fs';
import {resolve} from 'path';

const PORT = 3000;

const app = express();
import * as fileUpload from 'express-fileupload';
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
  }),
);

app.get('/hello', (req, res) => {
  res.status(200).send('Hello there testing');
});

app.post('/upload', (req, res) => {
  if (req.files) {
    Object.entries(req.files).forEach(([k, v]) => {
      stat(`storage/${k}`, function(err, stat) {
        if (err == null) {
          res.status(400).send('File already exists!');
        } else if (err.code === 'ENOENT') {
          if (v instanceof Array) {
            v.forEach(file => {
              writeFile(`./storage/${k}`, file.data, result => {
                console.log('FORM DATA: ' + file.data.toString());
                console.log(result);
                res.status(201).send('File created');
              });
            });
          } else {
            v.mv(resolve(__dirname, `../storage/${k}`));
          }
        } else {
          console.log('Some other error: ', err.code);
        }
      });
    });
  } else {
    res.status(200).send('hello');
  }

  // res.status(200).send('OK');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
