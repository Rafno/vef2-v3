const { Client } = require('pg');
const xss = require('xss');

const connectionString = process.env.DATABASE_URL || 'postgres://:@localhost/postgres';


/**
 * Create a note asynchronously.
 *
 * @param {Object} note - Note to create
 * @param {string} note.title - Title of note
 * @param {string} note.text - Text of note
 * @param {string} note.datetime - Datetime of note
 *
 * @returns {Promise} Promise representing the object result of creating the note
 */
async function create({ title, text, datetime } = {}) {
  const client = new Client({ connectionString });
  await client.connect();
  await client.query(
    'INSERT INTO notes(title, text, datetime) VALUES ($1, $2, $3);',
    [
      xss(title),
      xss(text),
      xss(datetime),
    ],
  );
  await client.end();
}

/**
 * Read all notes.
 *
 * @returns {Promise} Promise representing an array of all note objects
 */
async function readAll() {
  const client = new Client({ connectionString });
  await client.connect();
  const data = await client.query('SELECT id, datetime, title, text FROM notes;');
  await client.end();
  return data.rows;
}

/**
 * Read a single note.
 *
 * @param {number} id - Id of note
 *
 * @returns {Promise} Promise representing the note object or null if not found
 */
async function readOne(id) {
  const client = new Client({ connectionString });
  await client.connect();
  const data = await client.query(
    'SELECT * FROM notes where id = ($1);',
    [
      xss(id),
    ],
  );
  await client.end();
  return data.rows;
}

/**
 * Update a note asynchronously.
 *
 * @param {number} id - Id of note to update
 * @param {Object} note - Note to create
 * @param {string} note.title - Title of note
 * @param {string} note.text - Text of note
 * @param {string} note.datetime - Datetime of note
 *
 * @returns {Promise} Promise representing the object result of creating the note
 */
async function update(id, { title, text, datetime } = {}) {
  const client = new Client({ connectionString });
  await client.connect();
  const data = await client.query(
    'UPDATE notes SET title = $1, text = $2, datetime = $3 WHERE id = $4;',
    [
      xss(title),
      xss(text),
      xss(datetime),
      xss(id),
    ],
  );
  await client.end();
  return data.rows;
}

/**
 * Delete a note asynchronously.
 *
 * @param {number} id - Id of note to delete
 *
 * @returns {Promise} Promise representing the boolean result of creating the note
 */
async function del(id) {
  const client = new Client({ connectionString });
  await client.connect();
  await client.query(
    'DELETE FROM notes WHERE id = $1;',
    [
      xss(id),
    ],
  );
  await client.end();
  return true;
}

module.exports = {
  create,
  readAll,
  readOne,
  update,
  del,
};
