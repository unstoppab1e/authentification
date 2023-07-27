import express from 'express'
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import * as url from 'url';
import bcrypt from 'bcryptjs';
import * as jwtJsDecode from 'jwt-js-decode';
import base64url from "base64url";
import SimpleWebAuthnServer from '@simplewebauthn/server';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const app = express()
app.use(express.json())

const adapter = new JSONFile(__dirname + '/auth.json');
const db = new Low(adapter);
await db.read();
db.data = db.data || { users: [] }

const rpID = "localhost";
const protocol = "http";
const port = 5050;
const expectedOrigin = `${protocol}://${rpID}:${port}`;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

const findUser = (email) => {
  const result = db.data.users.find(user => user.email === email);
  if (result.length === 0) return undefined;
  return result[0];
}

// ADD HERE THE REST OF THE ENDPOINTS
app.post('/auth/login', async (req, res) => {
  const userFound = findUser(req.body.email);
  if(userFound) {
    if(bcrypt.compareSync(req.body.password, userFound.password)){
      res.send({ok: true, name: userFound.name, email: userFound.email});
    }
    else{
      res.send({ok: false, message: 'User or password is not found'});
    }
  }
  else{
    res.send({ok: false, message: 'User or password is not found'});
  }
});

app.post('auth/register', async (req, res) => {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(req.body.password, salt);

  const user = {
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  }
  const userExists = findUser(user.email);
  if (userExists) {
    return res.send({ok: false, message: 'User already exists'});
  }
  else{
    db.data.users.push(user);
    db.write();
    res.send({ok: true, message: 'User created'});
  }
});


app.get("*", (req, res) => {
    res.sendFile(__dirname + "public/index.html"); 
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});

