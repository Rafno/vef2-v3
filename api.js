const express = require('express');
const {
  create,
  readAll,
  readOne,
  update,
  del,
} = require('./notes');
/**
 * Data validator, checks title, text and date.
 * @param {any} data
 * @param {any} res
 * @returns {res.status fail} or, upon success { true }
 */
function validate(data, res) {
  if (data.title.length === 0 || data.title.length > 255) {
    return res.status(400).json({
      field: 'title',
      error: 'Title must be a string of length 1 to 255 characters',
    });
  } else if (typeof (data.text) !== 'string') {
    return res.status(400).json({
      field: 'text',
      error: 'Text must be a of a string type',
    });
  } else if (!Date.parse(data.datetime)) {
    return res.status(400).json({
      field: 'Date',
      error: 'Datetime must be ISO 8601 date',
    });
  }
  return true;
}
const router = express.Router();
router.use(express.json());
/*
function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}
*/
router.post('/', (req, res) => {
  const data = req.body;
  // POST VALIDATE ÞARF AÐ PASSA AÐ FORM ERU RÉTT
  if (validate(data, res) === true) {
    create({
      title: data.title,
      text: data.text,
      datetime: data.datetime,
    });
    res.status(200).json({
      title: data.title,
      text: data.text,
      datetime: data.datetime,
    });
  }
});
// GETID
router.get(
  '/:id',

  async (req, res) => {
    const { id } = req.params;
    const data = await readOne(id);
    if (data.length !== 0) {
      res.status(200).json(data);
    } else {
      res.status(404).json({
        error: 'ID not found',
      });
    }
  },
);
// GETALL
router.get(
  '/',
  async (req, res) => {
    const data = await readAll();
    res.status(200).json(data);
  },
);

// DELETE, skoðar fyrst hvort id er til.
router.delete(
  '/:id',

  async (req, res) => {
    const { id } = req.params;
    const data = await readOne(id);
    if (data.length !== 0) {
      await del(id);
      res.status(200).json({});
    } else {
      res.status(404).json({
        error: 'ID not found',
      });
    }
  },
);
/**
* put skoðar fyrst hvort id er til, eftir það validate-ar það data.
* Síðan uppfærir það það id.
*/
router.put(
  '/:id',
  async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const searcher = await readOne(id);
    if (searcher.length !== 0) {
      if (validate(data, res) === true) {
        await update(id, {
          title: data.title,
          text: data.text,
          datetime: data.datetime,
        });
      }
    } else {
      res.status(404).json({
        error: 'ID not found',
      });
    }
  },
);

module.exports = router;
