const { nanoid } = require('nanoid');
const books = require('../data/books');
const validateBook = require('../utils/validateBook');

const addBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  const validation = validateBook({ name, pageCount, readPage });
  if (!validation.isValid) {
    return h.response({
      status: 'fail',
      message: validation.message,
    }).code(400);
  }

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id, name, year, author, summary, publisher, pageCount, readPage, reading, finished, insertedAt, updatedAt,
  };

  books.push(newBook);

  return h.response({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: {
      bookId: id,
    },
  }).code(201);
};

const getAllBooksHandler = () => ({
  status: 'success',
  data: {
    books: books.map(({ id, name, publisher }) => ({ id, name, publisher })),
  },
});

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const book = books.find((b) => b.id === bookId);

  if (!book) {
    return h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    }).code(404);
  }

  return {
    status: 'success',
    data: {
      book,
    },
  };
};

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const {
      name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  // Validasi input
  const validation = validateBook({ name, pageCount, readPage });
  if (!validation.isValid) {
      // Sesuaikan pesan error dengan konteks update
      const message = validation.message
          .replace('menambahkan', 'memperbarui'); // Ganti konteks pesan
      return h.response({
          status: 'fail',
          message,
      }).code(400);
  }

  const index = books.findIndex((b) => b.id === bookId);
  if (index === -1) {
      return h.response({
          status: 'fail',
          message: 'Gagal memperbarui buku. Id tidak ditemukan',
      }).code(404);
  }

  books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt: new Date().toISOString(),
  };

  return {
      status: 'success',
      message: 'Buku berhasil diperbarui',
  };
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const index = books.findIndex((b) => b.id === bookId);

  if (index === -1) {
    return h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    }).code(404);
  }

  books.splice(index, 1);

  return {
    status: 'success',
    message: 'Buku berhasil dihapus',
  };
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
