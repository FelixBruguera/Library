const booksDiv = document.querySelector('.books')
const exampleBooks = document.querySelector('#example-books')

function newElement(elemType, elemContent, elemClass) {
    let elem = document.createElement(elemType)
    elem.textContent = elemContent
    elem.className = elemClass
    return elem
}

function getId(button) {
    return button.parentElement.dataset.id
}

let dialog = {
    modal: document.querySelector('dialog'),
    exitButton: document.querySelector('#close-dialog'),
    form: document.querySelector('form'),
    button: document.querySelector('#new-book'),
    close: function() {
        this.modal.close()
    },
    addListeners: function() {
        this.button.addEventListener('click', () => this.modal.showModal())
        this.exitButton.addEventListener('click', () => this.modal.close())
        this.form.addEventListener('submit', function(event) {
            event.preventDefault()
            let formResponse = new FormData(document.querySelector('form'))
            lib.add( new Book(formResponse) )
            this.reset()
            dialog.close()
        })
    }
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
        this.read = this.read == 'Read' ? 'Not read' : 'Read'
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
    })
}

function googleBooksAPI() {
    this.transformResponse = function (response) {
        let formData = new FormData()
        formData.append('title', response.title)
        formData.append('pages', response.pageCount)
        formData.append('year', new Date(response.publishedDate).getFullYear())
        formData.append('author', response.authors[0])
        formData.append('read', 'Not read')
        formData.append('image', response.imageLinks.thumbnail)
        return formData
    }

    this.getRandomBooks = async function() {
        let response = await fetch('https://www.googleapis.com/books/v1/users/106206099057354638675/bookshelves/0/volumes')
        data = await response.json()
        data.items.forEach(item => lib.add(new Book(this.transformResponse(item.volumeInfo))))
    }
}

let lib = new Library()
let api = new googleBooksAPI()
dialog.addListeners()
exampleBooks.addEventListener("click", () => api.getRandomBooks())



