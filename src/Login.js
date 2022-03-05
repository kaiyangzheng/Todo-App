import React, { useState, useEffect } from 'react';
import ClipLoader from "react-spinners/ClipLoader";

const Login = ({ setToken, setName, setIsLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [resResult, setResResult] = useState('');
    const [alert, setAlert] = useState({ 'msg': '', 'type': '' });
    const [showAlert, setShowAlert] = useState(false);
    const handleLogin = () => {
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        let encoded = window.btoa(`${username}:${password}`)
        myHeaders.append("Authorization", "Basic " + encoded);
        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        }
        fetch('https://todo-api-kz.herokuapp.com/login', requestOptions)
            .then(response => {
                if (response.ok) return response.json();
            })
            .then(json => {
                setResResult(json);
            })
        if (resResult === undefined) {
            setAlert({ ...alert, msg: 'Error: Invalid Login', type: 'alert-danger' })
            setShowAlert(true);
            let timer = setTimeout(() => {
                setShowAlert(false);
            }, 1000)
            return () => {
                clearTimeout(timer);
            }
        }
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        handleLogin();
    }

    useEffect(() => {
        if (resResult) {
            setAlert({ ...alert, msg: 'Success... Redirecting To Dashboard', type: 'alert-success' })
            setShowAlert(true);
            let timer1 = setTimeout(() => {
                setShowAlert(false);
                setToken(resResult['token']);
                setName(resResult['name']);
            }, 1000)
            return () => {
                clearTimeout(timer1);
            }
        }
    }, [resResult])

    return <>
        {showAlert && <p className={`alert ${alert.type}`}>{alert.msg}</p>}
        <form action="" className="login-form" onSubmit={handleSubmit}>
            <h3>Login</h3>
            <label htmlFor="username">Username</label>
            <input type="text" placeholder="Username" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />

            <label htmlFor="password">Password</label>
            <input type="password" placeholder="Password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {!showAlert && <button>Log In</button>}
            {!showAlert && <div style={{ textAlign: "center", marginTop: "10px" }}>
                or
                <p><a onClick={() => setIsLogin(false)}>Sign up</a></p>
            </div>}
            <ClipLoader color={"#1ad9d6"} loading={showAlert} css={"display: block; margin: 0 auto; margin-top: 3rem;"} />
        </form>
    </>
}

export default Login;