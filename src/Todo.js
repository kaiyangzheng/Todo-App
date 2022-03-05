import React, { useState, useEffect } from 'react';

import TodoList from './TodoList';
import ClipLoader from "react-spinners/ClipLoader";

const Todo = (props) => {
    const [todos, setTodos] = useState([]);
    const [formValue, setFormValue] = useState('');
    const [dateValue, setDateValue] = useState('');
    const [timeValue, setTimeValue] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [showAlert, setShowAlert] = useState(false);
    const [alert, setAlert] = useState({ 'msg': '', 'type': '' })

    const { token } = props;

    function convertTZ(date, tzString) {
        return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", { timeZone: tzString }));
    }

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
        console.log(responseTodos['todos'])
        setTodos(responseTodos['todos']);
    }

    const postTodos = async () => {
        let myHeaders = new Headers()
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('x-access-token', token);
        let formattedDateValue = dateValue.split('-')
        formattedDateValue = formattedDateValue[1] + '-' + formattedDateValue[2] + '-' + formattedDateValue[0];
        let formattedDate = new Date(formattedDateValue);
        console.log(formattedDate);
        formattedDate = formattedDate.toDateString().slice(4, formattedDate.length);
        let hour = parseInt(timeValue.slice(0, 2));
        let minutes = timeValue.slice(3, 5);
        let AMPM = 'AM'
        if (hour > 12) {
            hour = hour - 12;
            AMPM = 'PM';
        }
        let formattedTime = hour + ':' + minutes + AMPM;
        let formattedDateTime = formattedDate + '  ' + formattedTime;
        let raw = JSON.stringify({
            "text": formValue,
            "due_date": formattedDateTime
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
        } else if (!dateValue || !timeValue) {
            setShowAlert(true);
            setAlert({ ...alert, 'msg': 'Error: Invalid Date or Time', 'type': 'alert-danger' })
        } else {
            postTodos();
            setShowAlert(true);
            setAlert({ ...alert, 'msg': 'Added Todo', 'type': 'alert-success' })
            setFormValue('');
            setDateValue('');
            setTimeValue('');
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

    return <>
        <section className="section-center">
            <form action="" className="grocery-form" onSubmit={handleSubmit}>
                {showAlert && <p className={`alert ${alert.type}`}>{alert.msg}</p>}
                <h3>Todo List</h3>
                <div className="form-control">
                    <input type="text" className="grocery" placeholder="e.g. cry" value={formValue} onChange={(e) => setFormValue(e.target.value)} />
                    <input type="date" className="date-input center" name="date-form" id="date-form" value={dateValue} onChange={(e) => setDateValue(e.target.value)}></input>
                    <input type="time" className="time-input center" value={timeValue} onChange={(e) => setTimeValue(e.target.value)}></input>
                </div>
                <div className="date-form-control">
                    <button className="submit-btn" type="submit">Add Item</button>
                </div>
                <TodoList todos={todos} removeTodo={removeTodo} completeTodo={completeTodo} />
                {todos && todos.filter((todo) => { return todo.complete != true }).length > 0 && <button className="clear-btn" onClick={handleRemoveAllTodos}>clear items</button>}
                <ClipLoader color={"#1ad9d6"} loading={isLoading} css={"display: block; margin: 0 auto;"} />
            </form>
        </section>
    </>
}


export default Todo;