function validateBook({ name, pageCount, readPage }) {
  if (!name) {
    return { isValid: false, message: 'Gagal menambahkan buku. Mohon isi nama buku' };
  }

  if (readPage > pageCount) {
    return { isValid: false, message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount' };
  }

  return { isValid: true };
}

module.exports = validateBook;
