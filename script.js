const booksDiv = document.querySelector('.books')
const newBook = document.querySelector('#new-book')
const form = document.querySelector('form')

form.addEventListener('submit', function(event) {
    event.preventDefault()
    const formResponse = new FormData(document.querySelector('form'))
    let book = new Book(formResponse)
    lib.add(book)
    form.reset()
    dialog.close()
})

let dialog = {
    modal: document.querySelector('dialog'),
    exitButton: document.querySelector('#close-dialog'),
    setup: function() {
        newBook.addEventListener('click', () => this.modal.showModal())
        this.exitButton.addEventListener('click', () => this.modal.close())
    },
    close: function() {
        this.modal.close()
    }
}

function newElement(elemType, elemContent, elemClass) {
    let elem = document.createElement(elemType)
    elem.textContent = elemContent
    elem.className = elemClass
    return elem
    }

// const exampleBooks =[new Book('Lord of Rings', 200, 1985, 'J.R.R. Tolkien', false),
//                     new Book('Another Book', 10, 2024, 'Someone', true)]

function Library() {
    this.books = []
    this.show = function(book) {
        console.log(book.title)
        let container = newElement('div', '', 'book')
        let title = newElement('h2', book.title, 'book-title')
        let pages = newElement('p', book.pages+' Pages', 'book-pages')
        let year = newElement('p', book.year, 'book-year')
        let author = newElement('p', book.author, 'book-author')
        let readElem = newElement('button', book.read, 'book-read')
        let removeElem = newElement('button', 'Remove', 'book-remove')
        let elements = [title, pages, year, author, readElem, removeElem]
        for (let elem of elements) { container.appendChild(elem) }
    container.dataset.id = book.id
    container.classList.add('add-book')
    booksDiv.appendChild(container)
    addListeners(container)
    // booksDiv.classList.remove('books-animation')
    // booksDiv.classList.add('books-animation')
   }
   this.add = function(book) {
        this.books.push(book)
        this.show(book)
   }
   this.remove = function(book) {
        let index = this.books.indexOf(book)
        console.log(index)
        this.books.splice(index, 1)
        console.log(this.books)
   }
}
let lib = new Library()

function Book(entries) {
    this.title = entries.get('title');
    this.pages = entries.get('pages');
    this.year = entries.get('year');
    this.author = entries.get('author');
    this.read = entries.get('read');
    this.id = lib.books.length+1
    this.updateRead = function() {
        this.read = this.read == 'Read' ? 'Unread' : 'Read'
    }
}

function addListeners(book) {
    let readButton = book.querySelector('.book-read')
    let removeButton = book.querySelector('.book-remove')
    readButton.addEventListener('click', function (e) {
        let bookElem = lib.books.find(book => book.id == getId(e.target))
        bookElem.updateRead()
        e.target.textContent = bookElem.read
    })
    removeButton.addEventListener('click', function (e) {
        let bookElem = lib.books.find(book => book.title == getId(e.target))
        e.target.parentElement.classList.remove('add-book')
        e.target.parentElement.classList.add('remove-book')
        lib.remove(bookElem)
        setTimeout(() => booksDiv.removeChild(e.target.parentElement), 450)
    })
}



// const newB = new Book('lala', 1, 1234, 'lolo', false)
dialog.setup()
// lib.add(newB)

function getId(button) {
    return button.parentElement.dataset.id
}

document.querySelectorAll('.book-read').forEach(elem => elem.addEventListener('click', function (e) {
    console.log(lib.books.find(book => book.title == getTitle(e.target)))}
))

document.querySelectorAll('.book-remove').forEach(button => button.addEventListener('click', function (e) {
    let bookElem = lib.books.find(book => book.title == getTitle(e.target))
    lib.remove(bookElem)
}))




