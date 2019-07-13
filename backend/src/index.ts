import * as express from 'express';

const PORT = 3000;

const app = express();

app.get('/hello', (req, res) => {
  res.status(200).send('Hello there testing');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
