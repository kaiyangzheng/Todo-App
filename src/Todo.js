import React, { useState, useEffect } from 'react';

import TodoList from './TodoList';
import ClipLoader from "react-spinners/ClipLoader";

const Todo = (props) => {
    const [todos, setTodos] = useState([]);
    const [formValue, setFormValue] = useState('');
    const [dateValue, setDateValue] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [showAlert, setShowAlert] = useState(false);
    const [alert, setAlert] = useState({ 'msg': '', 'type': '' })
    const [tick, setTick] = useState(0);
    const daysToAlert = 3;

    const { token, setUpcoming } = props;

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
        const response = await fetch('https://todo-api-kz.herokuapp.com/todo', requestOptions)
        const responseTodos = await response.json();
        setIsLoading(false)
        setTodos(responseTodos['todos']);
    }

    const postTodos = async () => {
        let myHeaders = new Headers()
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('x-access-token', token);
        let date = new Date(dateValue);
        date.setDate(date.getDate() + 1)
        date = date.toDateString().split(' ');
        let formattedDate = date[1] + ' ' + date[2] + ' ' + date[3] + '   12:00AM';
        let raw = JSON.stringify({
            "text": formValue,
            "due_date": formattedDate
        });

        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        }
        setIsLoading(true);
        const response = await fetch('https://todo-api-kz.herokuapp.com/todo', requestOptions)
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

        const response = await fetch(`https://todo-api-kz.herokuapp.com/todo/${id}`, requestOptions)
            .then(response => response.text)
            .then(result => console.log(result))
            .catch(error => console.log('error', error))
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

        const response = await fetch(`https://todo-api-kz.herokuapp.com/todo/${id}`, requestOptions)
            .then(response => response.text)
            .then(result => console.log(result))
            .catch(error => console.log('error', error))
    }


    const removeTodo = async (id) => {
        await deleteTodo(id);
        getTodos();
    }

    const completeTodo = async (id) => {
        await putTodo(id);
        getTodos();
    }

    const removeAllTodos = () => {
        for (let i = 0; i < todos.length; i++) {
            if (!todos[i].complete) {
                removeTodo(todos[i].id);
            }

        }
    }

    const handleRemoveAllTodos = async () => {
        await removeAllTodos();
        getTodos();
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formValue) {
            setShowAlert(true);
            setAlert({ ...alert, 'msg': 'Error: Invalid Input', 'type': 'alert-danger' })
        } else if (!dateValue) {
            setShowAlert(true);
            setAlert({ ...alert, 'msg': 'Error: Invalid Date', 'type': 'alert-danger' })
        } else {
            postTodos();
            setShowAlert(true);
            setAlert({ ...alert, 'msg': 'Added Todo', 'type': 'alert-success' })
            setFormValue('');
            setDateValue('');
        }

    }

    const getUpcoming = () => {
        setUpcoming([]);
        let today = new Date();
        for (let i = 0; i < todos.length; i++) {
            if (!todos[i].complete) {
                let todoDueDate = new Date(todos[i]['due_date']);
                todoDueDate.setDate(todoDueDate.getDate() + 1);
                let diffTime = (todoDueDate.getDate() - today.getDate());
                if (diffTime <= daysToAlert) {
                    setUpcoming((upcoming) => {
                        return [...upcoming, { 'text': todos[i]['text'], 'diffDays': diffTime }]
                    })
                }
            }

        }
    }

    useEffect(() => {
        let timer1 = setTimeout(() => {
            setShowAlert(false);
        }, 3000)
        return () => {
            clearTimeout(timer1);
        }

    }, [alert])

    useEffect(() => {
        getTodos();
    }, [])

    useEffect(() => {
        getUpcoming();
        const interval = setInterval(() => setTick(tick + 1), 360000);
        return () => clearInterval(interval);
    }, [tick, todos])

    return <>
        <section className="section-center">
            <form action="" className="grocery-form" onSubmit={handleSubmit}>
                {showAlert && <p className={`alert ${alert.type}`}>{alert.msg}</p>}
                <h3>Todo List</h3>
                <div className="form-control">
                    <input type="text" className="grocery" placeholder="e.g. cry" value={formValue} onChange={(e) => setFormValue(e.target.value)} />
                    <input type="date" className="date-input center" name="date-form" id="date-form" value={dateValue} onChange={(e) => setDateValue(e.target.value)}></input>
                    <button className="submit-btn" type="submit">Add</button>
                </div>
            </form>
            <TodoList todos={todos} removeTodo={removeTodo} completeTodo={completeTodo} />
            {todos && todos.filter((todo) => { return todo.complete != true }).length > 0 && <button className="clear-btn" onClick={handleRemoveAllTodos}>clear items</button>}
            <ClipLoader color={"#1ad9d6"} loading={isLoading} css={"display: block; margin: 0 auto;"} />

        </section>
    </>
}


export default Todo;