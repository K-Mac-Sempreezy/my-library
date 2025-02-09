//DOM Elements
const animateBtn = document.getElementById('animate');
const newBookBtn = document.getElementById('new-book-button');
const newBookShadow = document.getElementById('new-book-button-shadow');
const cancelBtn = document.getElementById('cancel-button');
const header = document.querySelector('header');
const form = document.querySelector('.form-container');
const container = document.querySelectorAll('.container');
const titleInput = document.getElementById('book-title');
const authorInput = document.getElementById('book-author');
const pagesInput = document.getElementById('book-pages');
const submitBtn = document.getElementById('submit-button');
const read = document.getElementById('read');
const notRead = document.getElementById('not-read');
const cardContainer = document.getElementById('card-container');
const overlay = document.getElementById('overlay');
const popUp = document.querySelector('.pop-up-container');
const popUpButtons = document.querySelector('.pop-up-button');
const popUpDeleteButton = document.querySelector('.yes-delete');
const popUpCancelButton = document.querySelector('.no-cancel');
const cardShadowContainer = document.querySelector('.card-shadow-container');

//Global Variables
let idx;
let formOpen = false;
let edit = false;
let submit = false;
let myLibrary = JSON.parse(localStorage.getItem('myLibrary') || '[]');

class Book {
  constructor(title, author, pages, hasRead = false) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.hasRead = hasRead;
  }
}

// Form Functions
const addBookToLibrary = () => {
  if (submit === false) {
    return;
  }
  if (edit) {
    newBookBtn.textContent = 'NEW BOOK';
    myLibrary[idx].title = titleInput.value;
    myLibrary[idx].author = authorInput.value;
    myLibrary[idx].pages = pagesInput.value;
    read.checked === true
      ? (myLibrary[idx].hasRead = true)
      : (myLibrary[idx].hasRead = false);

    localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
    hideForm();
    initListOfBooks();
    return;
  }

  read.checked === true ? (hasRead = true) : (hasRead = false);
  const newBook = new Book(
    titleInput.value,
    authorInput.value,
    pagesInput.value,
    hasRead
  );
  myLibrary.push(newBook);
  localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
  hideForm();
  initListOfBooks();
};

const resetForm = () => {
  submitBtn.classList.add('inactive-submit');
  idx = '';
  edit = false;
  submit = false;
  titleInput.value = '';
  authorInput.value = '';
  pagesInput.value = '';
  read.checked = false;
  notRead.checked = false;
};

const showForm = () => {
  formOpen = true;
  if (edit) {
    newBookBtn.innerText = 'EDIT';
  }
  newBookBtn.style.transition = 'transform 0.4s ease-in-out';
  newBookBtn.style.transform = 'translateY(100px)';
  newBookBtn.classList.add('inactive-button');
  newBookShadow.style.transform = 'translateY(100px)';
  newBookShadow.style.visibility = 'hidden';
  form.style.transform = 'translateX(0)';
  cardContainer.style.transform = 'translateX(350px)';
  cardContainer.style.width = 'calc(100vw - 350px)';
  container.forEach(
    (container) => (container.style.transform = 'translateX(0px)')
  );
  container.forEach((container) => (container.style.opacity = '1'));
};

const hideForm = () => {
  formOpen = false;
  newBookBtn.classList.remove('inactive-button');
  newBookBtn.style.transform = 'translateY(0px)';
  newBookBtn.innerText = 'NEW BOOK';

  newBookShadow.style.transform = 'translateY(0px)';
  newBookShadow.style.visibility = 'visible';

  form.style.transform = 'translateX(-350px)';

  cardContainer.style.transform = 'translateX(0px)';
  cardContainer.style.width = '100vw';

  overlay.style.width = '100vw';
  overlay.style.display = '';

  container.forEach(
    (container) =>
      (container.style.transition =
        'transform 0.3s ease-out, opacity 0.3s ease-out')
  );
  container.forEach(
    (container) => (container.style.transform = 'translateX(-350px)')
  );
  container.forEach((container) => (container.style.opacity = '0'));
  resetForm();
  toggleOverlay();
};

const formHandler = () => {
  if (
    titleInput.value.length > 0 &&
    authorInput.value.length > 0 &&
    pagesInput.value.length > 0
  ) {
    submitBtn.classList.remove('inactive-submit');
    submit = true;
  } else {
    return;
  }
};

//Card Functions
const createCard = (book, index) => {
  let card = document.createElement('div');
  card.className = 'card';
  card.id = `card${index}`;

  let image = document.createElement('div');
  image.className = 'img';

  const random = () => {
    return Math.floor(Math.random() * 255);
  };

  let rgba = `rgba(${random()}, ${random()}, ${random()}, 1)`;
  image.style.backgroundColor = rgba;

  let checkBox = document.createElement('div');
  if (book.hasRead) {
    checkBox.innerText = '✓';
  } else {
    checkBox.innerText = '';
  }
  checkBox.classList.add('check-box');
  checkBox.dataset.index = index;
  checkBox.id = 'check-box';
  checkBox.style.backgroundColor = `rgb(255,255,255,1)`;
  checkBox.addEventListener('click', hasReadHandler);

  let checkBoxLabel = document.createElement('div');
  checkBoxLabel.classList.add('check-box-label');
  spanLabel = 'read';
  checkBoxLabel.innerText = 'read';

  // let largeContainer = document.createElement('div');

  let titleAuthorContainer = document.createElement('div');
  titleAuthorContainer.classList.add('title-author-container');

  let title = document.createElement('h3');
  title.innerText = book.title;

  let author = document.createElement('p');
  author.innerText = `by ${book.author}`;

  let buttons = document.createElement('div');
  buttons.classList.add('buttons');

  let removeBtn = document.createElement('button');
  removeBtn.classList.add('card-buttons');
  removeBtn.textContent = 'delete';
  removeBtn.dataset.index = index;
  removeBtn.id = 'delete';
  removeBtn.addEventListener('click', popUpEl);

  let edit = document.createElement('button');
  edit.classList.add('card-buttons');
  edit.dataset.index = index;
  edit.textContent = 'edit';
  edit.id = 'edit';
  edit.addEventListener('click', editHandler);

  card.appendChild(image);
  card.appendChild(checkBoxLabel);
  card.appendChild(checkBox);
  titleAuthorContainer.appendChild(title);
  titleAuthorContainer.appendChild(author);
  buttons.appendChild(edit);
  buttons.appendChild(removeBtn);
  card.appendChild(titleAuthorContainer);
  card.appendChild(buttons);
  cardContainer.appendChild(card);
};

const initListOfBooks = () => {
  while (cardContainer.firstElementChild) {
    cardContainer.firstElementChild.remove();
  }

  myLibrary.forEach((book, index) => {
    createCard(book, index);
  });
};

const hasReadHandler = (e) => {
  //accessed by card checkbox only
  let index = e.target.dataset.index;
  if (e.target.innerText === '') {
    myLibrary[index].hasRead = true;
    localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
    e.target.innerText = '✓';
  } else {
    myLibrary[index].hasRead = false;
    localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
    e.target.innerText = '';
  }
};

const editHandler = (e) => {
  edit = true;
  toggleOverlay();
  overlay.style.width = 'calc(100vw - 350px)';
  idx = e.target.dataset.index;
  console.log(idx);
  titleInput.value = myLibrary[idx].title;
  authorInput.value = myLibrary[idx].author;
  pagesInput.value = myLibrary[idx].pages;
  let hasRead = myLibrary[idx].hasRead;
  if (hasRead) {
    read.checked = true;
    notRead.checked = false;
  } else {
    read.checked = false;
    notRead.checked = true;
  }
  formHandler();
  showForm();
};

const popUpEl = (e) => {
  idx = e.target.dataset.index;
  popUp.style.visibility = 'visible';
  overlay.style.display = 'block';
};

//only accessed by popup window
const deleteBook = (e) => {
  console.log(e, idx);
  if (idx === '') {
    return;
  }
  myLibrary.splice(idx, 1);
  localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
  idx = '';
  popUp.style.visibility = 'hidden';
  overlay.style.display = '';
  initListOfBooks();
};

//only accessed by popup window
const cancelAction = () => {
  idx = '';
  popUp.style.visibility = 'hidden';
  overlay.style.display = '';
};

const toggleOverlay = () => {
  if (edit === false && submit && overlay.style.display === '') {
    submit = false;
    return;
  } else if (
    edit === false &&
    submit === false &&
    overlay.style.display === ''
  ) {
    return;
  }

  overlay.style.display === ''
    ? (overlay.style.display = 'block')
    : (overlay.style.display = ''); //remove option to click on card container elements
};

const buttonHover = (e) => {
  if (formOpen) {
    return;
  }
  if (e.type === 'mouseenter') {
    newBookBtn.style.transition = 'transform 0.1s ease-in-out';
    newBookBtn.style.transform = 'translateX(-7px) translateY(-7px)';
  } else {
    newBookBtn.style.transition = 'transform 0.4s ease-in-out';
    newBookBtn.style.transform = 'translateX(0px) translateY(0px)';
  }
};

//Event Listeners
newBookBtn.addEventListener('click', showForm);
newBookBtn.addEventListener('mouseenter', buttonHover);
newBookBtn.addEventListener('mouseleave', buttonHover);
cancelBtn.addEventListener('click', hideForm);
titleInput.addEventListener('change', formHandler);
authorInput.addEventListener('change', formHandler);
pagesInput.addEventListener('change', formHandler);
submitBtn.addEventListener('click', addBookToLibrary);
popUpDeleteButton.addEventListener('click', deleteBook);
popUpCancelButton.addEventListener('click', cancelAction);
window.addEventListener('load', initListOfBooks);
