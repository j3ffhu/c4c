import express from 'express';
import cors from 'cors';


 import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// const sqlite3 = require('sqlite3').verbose();
 
let _db;

async function getDB() {
  if (_db == null) {
    const conn = await open({
      filename: './urls.db',
      driver: sqlite3.Database,
    });
    _db = conn;
    await _db.run(
      'CREATE TABLE IF NOT EXISTS url (id INTEGER PRIMARY KEY AUTOINCREMENT, original TEXT);'
    );
  }
  return _db;
}

// Mutable Application State

/**
 * A map of Short URL IDs to full original URLs
 * http://localhost/s/123, http://example.com/...
 *
 * { 123 -> 'http://example.com/...' }
 */
const urlmap: Record<number, string> = {};

// Actions

async function shortenUrl(url: string): Promise<string> {
  const db = await getDB();

  const result = await db.run('INSERT INTO url (original) VALUES (?)', url);
  //console.log(result);
  const id = result.lastID;
  const short = `http://localhost:3333/s/${id}`;

  return short;
}


async function lookupUrl(shortenedId: number) {
  const db = await getDB();

  const result = await db.get(
    'SELECT original FROM url WHERE id = (?)',
    shortenedId
  );
  console.log(result);
  return result.original;
}


// App

const app = express();
app.use(express.json());
app.use(cors());

app.post('/api/shorten', async (req, res) => {
  const original = req.body.original;
  const short = await shortenUrl(original);

  // console.log(req);

  res.send({
    short: short,
    original: original,
  });
});

app.get('/s/:id', async (req, res) => {
 const id = Number(req.params.id);
 // const id = 9

   const original = await lookupUrl(id);
  // JSON.parse(input) stringify
 // console.log("db app get " +  JSON.stringify(original));
  console.log("original stringify "  + original);
  // console.log("original stringify "  + JSON.stringify(original, null, 4));
  res.send(original);
});

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);