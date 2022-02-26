import React, { useState, useEffect } from 'react';

import TodoList from './TodoList';
import ClipLoader from "react-spinners/ClipLoader";

const Todo = (props) => {
    const [todos, setTodos] = useState([]);
    const [formValue, setFormValue] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const { token } = props;

    const getTodos = async () => {
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("x-access-token", token)
        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        }
        setIsLoading(true);
        const response = await fetch('http://localhost:5000/todo', requestOptions)
        const responseTodos = await response.json();
        setIsLoading(false)

        setTodos(responseTodos['todos']);
    }

    const postTodos = async () => {
        let myHeaders = new Headers()
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('x-access-token', token);
        let raw = JSON.stringify({
            "text": formValue
        });

        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        }
        setIsLoading(true);
        const response = await fetch('http://localhost:5000/todo', requestOptions)
            .then(response => response.text)
            .then(result => console.log(result))
            .catch(error => console.log('error', error))
        getTodos();
    }

    const putTodo = async (id) => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("x-access-token", token);
        let requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            redirect: 'follow'
        };

        const response = await fetch(`http://localhost:5000/todo/${id}`, requestOptions)
            .then(response => response.text)
            .then(result => console.log(result))
            .catch(error => console.log('error', error))
        getTodos();
    }

    const deleteTodo = async (id) => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("x-access-token", token);
        let requestOptions = {
            method: 'DELETE',
            headers: myHeaders,
            redirect: 'follow'
        };

        const response = await fetch(`http://localhost:5000/todo/${id}`, requestOptions)
            .then(response => response.text)
            .then(result => console.log(result))
            .catch(error => console.log('error', error))
        getTodos();
    }


    const removeTodo = (id) => {
        deleteTodo(id);
        getTodos();
    }

    const completeTodo = (id) => {
        putTodo(id);
        getTodos();
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formValue) {
            postTodos();
        }
        setFormValue('');
    }

    useEffect(() => {
        getTodos();
    }, [])

    return <>
        <section className="section-center">
            <form action="" className="grocery-form" onSubmit={handleSubmit}>
                <h3>Todo List</h3>
                <div className="form-control">
                    <input type="text" className="grocery" placeholder="e.g. cry" value={formValue} onChange={(e) => setFormValue(e.target.value)} />
                    <button className="submit-btn" type="submit">Submit</button>
                </div>
                <TodoList todos={todos} removeTodo={removeTodo} completeTodo={completeTodo} />
                {todos.filter((todo) => { return todo.complete != true }).length > 0 && <button className="clear-btn">clear items</button>}
                <ClipLoader color={"#1ad9d6"} loading={isLoading} css={"display: block; margin: 0 auto;"} />
            </form>
        </section>
    </>
}


export default Todo;