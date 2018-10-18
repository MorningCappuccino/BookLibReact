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
                <Menu items={ ['book list', 'add book'] }/>
                <h3>Book list</h3>
                <div className="book-list">
                    {this.state.books.map((book, index) => {
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
        );
    }
}

class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: 0
        };

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        this.setState({active: +e.target.getAttribute('m-index')})
    }

    render() {
        return(
            <ul className="menu">
                {this.props.items.map((item, i) => {
                    let style = '';

                    if (this.state.active === i) {
                        style = 'active';
                    }

                    return <li key={i} className={style} onClick={this.handleClick} m-index={i}>{item}</li>
                })}
            </ul>
        )
    }
}

export default hot(module)(App);