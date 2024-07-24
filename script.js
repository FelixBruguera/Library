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

function Library() {
    this.books = []
    this.show = function(book) {
        let container = newElement('div', '', 'book')
        let elements = book.makeElements()
        for (let elem of elements) { container.appendChild(elem) }
        container.dataset.id = book.id
        container.classList.add('add-book')
        booksDiv.appendChild(container)
        addListeners(container)
   }
   this.add = function(book) {
        this.books.push(book)
        this.show(book)
   }
   this.remove = function(book) {
        let index = this.books.indexOf(book)
        this.books.splice(index, 1)
   }
}

function Book(entries) {
    this.title = entries.get('title');
    this.pages = entries.get('pages');
    this.year = entries.get('year');
    this.author = entries.get('author');
    this.read = entries.get('read');
    this.image = entries.get('image')
    this.id = lib.books.length+1
    this.updateRead = function() {
        this.read = this.read == 'Read' ? 'Not read yet' : 'Read'
    }
    this.makeElements = function() {
        let title = newElement('h2', this.title, 'book-title')
        let pages = newElement('p', this.pages+' Pages', 'book-pages')
        let year = newElement('p', this.year, 'book-year')
        let author = newElement('p', this.author, 'book-author')
        let readElem = newElement('button', this.read, 'book-read')
        let removeElem = newElement('button', 'Remove', 'book-remove')
        let image = newElement('img', '' , 'book-img')
        if (this.image != undefined) { image.src = this.image}
        else {image.src = "images/book-cover-placeholder.png"}
        let elements = [image, title, author, pages, year, readElem, removeElem]
        return elements
    }
}   

function addListeners(book) {
    let readButton = book.querySelector('.book-read')
    readButton.addEventListener('click', function (e) {
        let bookElem = lib.books.find(book => book.id == getId(e.target))
        bookElem.updateRead()
        e.target.textContent = bookElem.read
    })
    let removeButton = book.querySelector('.book-remove')
    removeButton.addEventListener('click', function (e) {
        let bookElem = lib.books.find(book => book.id == getId(e.target))
        e.target.parentElement.classList.remove('add-book')
        e.target.parentElement.classList.add('remove-book')
        lib.remove(bookElem)
        setTimeout(() => booksDiv.removeChild(e.target.parentElement), 450)
        console.log(lib.books)
    })
}


dialog.setup()

function getId(button) {
    return button.parentElement.dataset.id
}

function transformResponse(response) {
    let formData = new FormData()
    formData.append('title', response.title)
    formData.append('pages', response.pageCount)
    formData.append('year', new Date(response.publishedDate).getFullYear())
    formData.append('author', response.authors[0])
    formData.append('read', 'Not read yet')
    formData.append('image', response.imageLinks.thumbnail)
    return formData
}

async function getRandomBooks() {
    let response = await fetch('https://www.googleapis.com/books/v1/users/118196310033155438839/bookshelves/0/volumes')
    data = await response.json()
    data.items.forEach(item => lib.add(new Book(transformResponse(item.volumeInfo))))
    }
let lib = new Library()
getRandomBooks()



