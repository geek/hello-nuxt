'use strict';

exports.getBooks = async (options, request) => {
  const { payload: books } = await request.wreck.get('/books');
  return books;
};

exports.getBook = async ({ ID }, request) => {
  const { payload: book } = await request.wreck.get(`/books/${ID}`);
  return book;
};

exports.createBook = async (inputBook, request) => {
  const { payload: book } = await request.wreck.post('/books', {
    payload: inputBook
  });

  return book
};

exports.updateBook = async (inputBook, request) => {
  const { payload: book } = await request.wreck.put(`/books/${inputBook.ID}`, {
    payload: inputBook
  });

  return book;
};

exports.deleteBook = async ({ ID }, request) => {
  const { payload: book } = await request.wreck.get(`/books/${ID}`);
  await request.wreck.delete(`/books/${ID}`);

  return book;
};
