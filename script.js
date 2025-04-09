const myLibrary = [];

displayBooks(myLibrary);

function generateUUID() {
  // Fallback for environments where crypto.randomUUID() is not supported
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

function Book(title, author, pages, read) {
  this.id = crypto.randomUUID ? crypto.randomUUID() : generateUUID(); // Unique ID
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

Book.prototype.toggleRead = function () {
  this.read = !this.read;
};

function addBookToLibrary(title, author, pages, read) {
  if (!title || !author || isNaN(pages)) {
    alert("Please provide valid book details.");
    return;
  }
  const book = new Book(title, author, pages, read);
  myLibrary.push(book);
  displayBooks(myLibrary);
}

function displayBooks(books) {
  const bookList = document.getElementById("book-list");
  bookList.innerHTML = "";

  if (books.length === 0) {
    bookList.innerHTML = "<p>Your library is empty. Add some books!</p>";
    return;
  }

  books.forEach((book) => {
    const bookItem = document.createElement("div");
    bookItem.classList.add("book-item");
    bookItem.setAttribute("data-id", book.id);

    bookItem.innerHTML = `
        <h3>${book.title}</h3>
        <p>Author: ${book.author}</p>
        <p>Pages: ${book.pages}</p>
        <p>Read: ${book.read ? "Yes" : "No"}</p>
        <button class="toggle-read-button" onclick="toggleReadStatus('${
          book.id
        }')">Toggle Read</button>
        <button class="delete-button" onclick="deleteBook('${
          book.id
        }')">Delete</button>
      `;

    bookList.appendChild(bookItem);
  });
}

function toggleReadStatus(id) {
  const book = myLibrary.find((book) => book.id === id);
  if (book) {
    book.toggleRead();
    displayBooks(myLibrary);
  }
}

function deleteBook(id) {
  const bookIndex = myLibrary.findIndex((book) => book.id === id);
  if (bookIndex > -1) {
    myLibrary.splice(bookIndex, 1);
    displayBooks(myLibrary);
  }
}

document
  .getElementById("add-book-form")
  .addEventListener("submit", function (e) {
    e.preventDefault(); // Stops form from refreshing page

    const title = this.elements["title"].value.trim();
    const author = this.elements["author"].value.trim();
    const pages = parseInt(this.elements["pages"].value);
    const read = this.elements["read"].checked;

    addBookToLibrary(title, author, pages, read);
    this.reset(); // Clear form
  });
