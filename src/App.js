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
            activeMenuItem: 1
        };

        this.handleMenuItemClick = this.handleMenuItemClick.bind(this);
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
        this.setState({activeMenuItem: +e.target.getAttribute('m-index')})
    }

    render() {
        let layout;

        if (this.state.activeMenuItem === 0) {
            console.log('render');
            // this.getBooks();
            layout =  <BookList books={this.state.books}/>
        } else {
            layout =  <BookAdd />
        }

        return(
            <div className="App">
                <Menu items={ ['book list', 'add book'] }
                      active={this.state.activeMenuItem}
                      handleClick={this.handleMenuItemClick}
                />

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
            <div>
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
                                </div>
                            )
                        })}
                </div>
            </div>
        )
    }
}

class BookAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            renderSuccessMessage: false
        };

        this.addBook = this.addBook.bind(this);
        this.handleSuccessMessageUnmount = this.handleSuccessMessageUnmount.bind(this);
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
                if (results.data === 'success') {
                    self.handleSuccessMessageUnmount();
                }
            });
    }

    render() {
        return(
            <div>
                {this.state.renderSuccessMessage ? <SuccessMessage /> : null}
                <h3>Add book</h3>
                <form>
                    <input type="text" name="title" placeholder="title" required />
                    <input type="text" name="author" placeholder="author" />
                    <input type="text" name="page_count" placeholder="page_count" />
                    <input type="text" name="year" placeholder="year" />
                    <input type="submit" onClick={this.addBook} />
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

export default hot(module)(App);