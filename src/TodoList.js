import React from 'react'
import { FaCheck, FaTrash } from 'react-icons/fa';

const TodoList = ({ todos, removeTodo, completeTodo }) => {
    return <>
        <div className="grocery-list">
            {todos.map((todo) => {
                const { id, text, complete, due_date } = todo;
                if (complete) {
                    return;
                }
                return <article className="grocery-item" key={id}>
                    <p className="title">{text}</p>
                    <div className="btn-container">
                        <button type="button" className="edit-btn" onClick={() => completeTodo(id)}><FaCheck /></button>
                        <button type="button" className="delete-btn" onClick={() => removeTodo(id)}><FaTrash /></button>
                    </div>
                    <break></break>
                    <div className="due-date">Due: {due_date.slice(0, due_date.length - 13)}</div>
                </article>
            })}
        </div>
    </>
}

export default TodoList;