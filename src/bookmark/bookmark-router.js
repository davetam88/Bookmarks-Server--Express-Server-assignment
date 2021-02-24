const express = require('express')
const { v4: uuid } = require('uuid')
const logger = require('../logger')
const { bookmarks } = require('../store');

const bookmarkRouter = express.Router()
const bodyParser = express.json()

bookmarkRouter
  .route('/bookmark')
  .get((req, res) => {
    res.json(bookmarks);
  })
  .post(bodyParser, (req, res) => {
    const { bookName, bookContent } = req.body;

    if (!bookName)
    {
      logger.error(`bookName is required`);
      return res
        .status(400)
        .send('Invalid data');
    }

    if (!bookContent)
    {
      logger.error(`bookContent is required`);
      return res
        .status(400)
        .send('Invalid data');
    }
    const id = uuid();


    const bookmark = {
      id,
      bookName,
      bookContent
    };

    bookmarks.push(bookmark);

    logger.info(`bookmark with id ${id} created`);

    res
      .status(201)
      .location(`http://localhost:8000/bookmark/${id}`)
      .json(bookmark);
  })

// get and delete with ID.
bookmarkRouter
  .route('/bookmark/:id')
  .get((req, res) => {
    const { id } = req.params;
    const bookmark = bookmarks.find(c => c.id == id);
    // make sure we found a bookmark
    if (!bookmark)
    {
      logger.error(`bookmark with id ${id} not found.`);
      return res
        .status(404)
        .send('bookmark Not Found');
    }
    res.json(bookmark);
  })
  .delete((req, res) => {
    const { id } = req.params;
    const bookmarkIndex = bookmarks.findIndex(c => c.id == id);

    if (bookmarkIndex === -1)
    {
      logger.error(`bookmark with id ${id} not found.`);
      return res
        .status(404)
        .send('Not found');
    }

    bookmarks.splice(bookmarkIndex, 1);

    logger.info(`bookmark with id ${id} deleted.`);

    res
      .status(204)
      .end();
  })

module.exports = bookmarkRouter

