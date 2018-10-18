import React from "react";
import {hot} from "react-hot-loader";
import "./App.css";

class App extends React.Component {
    //todo: render menu item by state (use corresponding template)
    constructor() {
        super();
        this.state = {
            'books': []
        }
    }

    componentDidMount() {
        this.getBooks();
    }

    getBooks() {
        fetch('http://localhost:3000/books')
            .then(results => results.json())
            .then(results => this.setState({books: results}))
    }

    render(){
        return(
            <div className="App">
                {this.state.books.map((book, index) => {
                    return (
                        <div className='book'>
                            <div>{book.id}</div>
                            <div>{book.title}</div>
                            <div>{book.author}</div>
                            <div>{book.page_count}</div>
                            <div>{book.year}</div>
                        </div>
                    )
                })}
                <h1> Hello, World!! </h1>
            </div>
        );
    }
}

export default hot(module)(App);