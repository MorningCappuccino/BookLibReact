import React from "react";
import {hot} from "react-hot-loader";
import "./App.css";
import axios from "axios";
import serialize from 'form-serialize';

class App extends React.Component {
    //todo: render menu item by state (use corresponding template)
    constructor() {
        super();
        this.state = {
            'books': [],
            editedBook: {},
            activeMenuItem: 0,
            renderSuccessMessage: false,
            renderEditModal: false,
            renderOverlay: false
        };

        this.handleMenuItemClick = this.handleMenuItemClick.bind(this);
        this.addBook = this.addBook.bind(this);
        this.showEditModal = this.showEditModal.bind(this);
        this.handleEditBook = this.handleEditBook.bind(this);
        this.handleSuccessMessageUnmount = this.handleSuccessMessageUnmount.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.handleDeleteBook = this.handleDeleteBook.bind(this);
    }

    componentDidMount() {
        this.getBooks();
    }

    getBooks() {
        fetch('http://localhost:3000/books')
            .then(results => results.json())
            .then(results => this.setState({books: results}))
    }

    handleMenuItemClick(e) {
        this.setState({activeMenuItem: +e.target.getAttribute('m-index')});
        this.setState({renderSuccessMessage: false});
    }

    handleSuccessMessageUnmount() {
        this.setState({renderSuccessMessage: true});
    }

    addBook(e) {
        e.preventDefault();

        let form = e.target.parentNode;
        const self = this;

        axios.post('http://localhost:3000/book', serialize(form))
            .then(results => {
                if (results.data.status === 'success') {
                    self.handleSuccessMessageUnmount();
                    self.setState(prevState => ({
                        books: [...prevState.books, results.data.book]
                    }))
                }
            });
    }

    showEditModal(e) {
        let editedBook = e.target.getAttribute('edited-book');

        this.setState({editedBook: JSON.parse(editedBook)});
        this.setState({renderEditModal: true});
        this.setState({renderOverlay: true});
    }

    handleEditBook(e) {
        e.preventDefault();

        let form = e.target.parentNode;
        let bookID = +e.target.getAttribute('book-id');

        let self = this;

        axios.patch('http://localhost:3000/book/' + bookID, serialize(form))
            .then(results => {
                self.setState(prevState => ({
                    books: results.data.data
                }));
                self.handleCloseModal();
            });
    }

    handleDeleteBook(e) {
        let bookID = e.target.getAttribute('book-id');

        let self = this;

        axios.delete('http://localhost:3000/book/' + bookID, serialize({id: bookID}))
            .then(results => {
                self.setState({books: results.data.data})
            });
    }

    handleCloseModal() {
        this.setState({renderEditModal: false});
        this.setState({renderOverlay: false});
    }

    render() {
        let layout;

        if (this.state.activeMenuItem === 0) {
            console.log('render');
            // this.getBooks();
            layout =  <BookList books={this.state.books}
                                showEditModal={this.showEditModal}
                                deleteBook={this.handleDeleteBook}
            />
        } else {
            layout =  <BookAdd handleAddBook={this.addBook}/>
        }

        return(
            <div className="App">
                <Menu items={ ['book list', 'add book'] }
                      active={this.state.activeMenuItem}
                      handleClick={this.handleMenuItemClick}
                />
                {this.state.renderSuccessMessage ? <SuccessMessage /> : null}
                {this.state.renderOverlay ? <RenderOverlay /> : null}
                {this.state.renderEditModal ? <EditModal
                    data={this.state.editedBook}
                    handleEditBook={this.handleEditBook}
                    closeModal={this.handleCloseModal}
                 /> : null}
                {layout}
            </div>
        );
    }
}

class Menu extends React.Component {
    render() {
        return(
            <ul className="menu">
                {this.props.items.map((item, i) => {
                    let style = '';

                    if (this.props.active === i) {
                        style = 'active';
                    }

                    return <li key={i} className={style} onClick={this.props.handleClick} m-index={i}>{item}</li>
                })}
            </ul>
        )
    }
}

class BookList extends React.Component {
    render() {

        if (!this.props.books) {
            return (
                <div>no books</div>
            );
        }

        return(
            <div className="books">
                <h3>Book list</h3>
                <div className="book-list">
                        {this.props.books.map((book, index) => {
                            return (
                                <div className='book' key={index}>
                                    <div>{book.id}</div>
                                    <div>{book.title}</div>
                                    <div>{book.author}</div>
                                    <div>{book.page_count}</div>
                                    <div>{book.year}</div>
                                    <button edited-book={JSON.stringify(book)}
                                            onClick={this.props.showEditModal}>
                                        edit
                                    </button>
                                    <button book-id={book.id}
                                            onClick={this.props.deleteBook}>
                                        delete
                                    </button>
                                </div>
                            )
                        })}
                </div>
            </div>
        )
    }
}

class BookAdd extends React.Component {
    render() {
        return(
            <div>
                <h3>Add book</h3>
                <form>
                    <input type="text" name="title" placeholder="title" required />
                    <input type="text" name="author" placeholder="author" />
                    <input type="text" name="page_count" placeholder="page_count" />
                    <input type="text" name="year" placeholder="year" />
                    <input type="submit" onClick={this.props.handleAddBook} />
                </form>
            </div>
        )
    }
}

class SuccessMessage extends React.Component {

    render() {
        return(
            <div className="message message-success">Успех!</div>
        )
    }

}

function EditModal(props) {
    return (
        <div className="modal">
            <div className="modal-close" onClick={props.closeModal}>&#10060;</div>
            <h3>Edit book</h3>
            <form>
                <input type="text" name="title" placeholder="title" defaultValue={props.data.title} required />
                <input type="text" name="author" placeholder="author" defaultValue={props.data.author} />
                <input type="text" name="page_count" placeholder="page_count" defaultValue={props.data.page_count} />
                <input type="text" name="year" placeholder="year" defaultValue={props.data.year} />
                <input type="submit" book-id={props.data.id} onClick={props.handleEditBook} />
            </form>
        </div>
    )
}

function RenderOverlay() {
    return (
        <div className="overlay">

        </div>
    )
}

export default hot(module)(App);