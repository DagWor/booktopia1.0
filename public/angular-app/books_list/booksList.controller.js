angular.module('booksApp').controller('BookListController', BookListController);

function BookListController(BookDataFactory, $route, $routeParams) {
    let vm = this;
    vm.page = 'These are the Books'
    vm.next = true;
    if (!$routeParams.offset) vm.offset = 0;
    if (!$routeParams.count) vm.count = 10;
    BookDataFactory.getAllBooks().then(response => vm.books = response).catch(err => console.log(err));
    BookDataFactory.getAllAuthors().then(response => vm.authors = response).catch(err => console.log(err));

    vm.searchBooks = function (author) {
        if(author == "") $route.reload()
        else BookDataFactory.getAllBooksByAuthor(author).then(res => vm.books = res).catch(err => console.log(err));
    }
    vm.addBook = function () {
        const newBook = {
            title: vm.title,
            price: vm.price
        }
        
        if(vm.edition) newBook.edition = vm.edition
        if(vm.rating) newBook.rating = vm.rating
        if(vm.author) newBook.author = vm.author
        if(vm.year) newBook.year = vm.year

        BookDataFactory.addOneBook(newBook).then(() => {
            console.log("success")
            $route.reload()
        }).catch(err => console.log(err));
    }

    vm.nextPage = function () {
        vm.offset += 5;
        BookDataFactory.getAllBooks(vm.offset, vm.count).then(res => {
            if (res % 5 !== 0) vm.next = false
            vm.books = res;
        }).catch(err => console.log(err));
    }

    vm.previousPage = function () {
        vm.offset -= 5;
        BookDataFactory.getAllBooks(vm.offset, vm.count).then(res => {
            vm.next = true
            vm.books = res
        }).catch(err => console.log(err));
    }
}