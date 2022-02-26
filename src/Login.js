import React, { useState, useEffect } from 'react';

const Login = ({ setToken }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
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
        fetch('http://localhost:5000/login', requestOptions)
            .then(response => {
                if (response.ok) return response.json();
            })
            .then(json => {
                setToken(json['token']);
            })
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        handleLogin();
    }
    return <>
        <form action="" className="login-form" onSubmit={handleSubmit}>
            <h3>Login</h3>

            <label htmlFor="username">Username</label>
            <input type="text" placeholder="Username" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />

            <label htmlFor="password">Password</label>
            <input type="password" placeholder="Password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button>Log In</button>
        </form>
        {/*<div className="card login-form mt-5">
            <div className="card-body">
                <h3 className="card-title text-center">Log In</h3>
                <div className="card-text">
                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input type="text" className="form-control form-control-sm" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        <br></br>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input type="password" className="form-control form-control-sm" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <button type="submit" className="btn btn-primary btn-block w-100">Sign in</button>
                        <div className="sign-up">
                            Don't have an account? <a href="#">Sign Up</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>*/}
    </>
}

export default Login;