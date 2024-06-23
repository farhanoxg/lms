const express = require('express');
const multer = require('multer');
const { check, validationResult } = require('express-validator');
const Book = require('../models/Book');
const auth = require('../middleware/auth');
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

router.get('/books',[auth('admin')], async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.post(
  '/addbook',
  [auth('admin')],
  upload.single('image'),
  [
    check('name', 'Book name is required').not().isEmpty(),
    check('author', 'Book author is required').not().isEmpty(),
    check('qty', 'Book quantity is required').isInt({ min: 1 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, author, qty } = req.body;
    const image = req.file ? req.file.path : null;

    try {
      const newBook = new Book({
        name,
        author,
        qty,
        image
      });

      const book = await newBook.save();
      res.json(book);
    } catch (err) {
      console.error(err.message,);
      res.status(500).send('Server error');
    }
  }
);



router.put(
  '/updatebook/:id',
  [auth('admin')],
  upload.single('image'),
  [
    check('name', 'Book name is required').not().isEmpty(),
    check('author', 'Book author is required').not().isEmpty(),
    check('qty', 'Book quantity is required').isInt({ min: 1 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, author, qty } = req.body;
    const image = req.file ? req.file.path : null;

    try {
      let book = await Book.findById(req.params.id);

      if (!book) {
        return res.status(404).json({ msg: 'Book not found' });
      }

      book.name = name;
      book.author = author;
      book.qty = qty;
      if (image) {
        book.image = image;
      }

      await book.save();
      res.json(book);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

router.delete('/deletebook/:id', [auth('admin')], async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ msg: 'Book not found' });
    }

    await book.deleteOne();
    res.json({ msg: 'Book removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
