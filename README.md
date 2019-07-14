# Installation
First install node package manager from the provided link here:
https://www.npmjs.com/get-npm

Next, clone the respository to get the source code onto your computer 
`git clone https://github.com/jayden-chan/UVEC-Summer-2019.git`

## Run frontend
```
cd frontend && npm instal
npm run
```
##Set up database
It is strongly recommended to use a Cloud-Based solution for your Postgres database.
However, if you wish to install postgres locally, instructions can be found here:
http://postgresguide.com/setup/install.html

### Configuring Postgres

```sql
CREATE TABLE data (
    username TEXT,
    password TEXT
);
```

## Run backend
```
cd ../backend && npm install
npm run
```

![ER Diagram](https://github.com/jayden-chan/UVEC-Summer-2019/blob/master/ERDiagram.png)
