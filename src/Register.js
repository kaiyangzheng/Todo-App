import React, { useState, useEffect } from 'react';

const Register = (props) => {
    const { setIsLogin } = props;
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [resResult, setResResult] = useState('');
    const [alert, setAlert] = useState({ 'msg': '', 'type': '' });
    const [showAlert, setShowAlert] = useState(false);

    const handleRegister = async () => {
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        let raw = JSON.stringify({
            "name": username,
            "password": password
        });
        let requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://todo-api-kz.herokuapp.com/register", requestOptions)
            .then(response => response.text())
            .then(result => setResResult(JSON.parse(result)));

    }

    useEffect(() => {
        if (password !== confirmPass) {
            setAlert({ ...alert, msg: 'Error: Passwords must match', type: 'alert-danger' })
            setShowAlert(true);
            let timer1 = setTimeout(() => {
                setShowAlert(false);
            }, 1000);
            return () => {
                clearTimeout(timer1);
            }
        } else if (Object.keys(resResult)[0] === "message") {
            setAlert({ ...alert, msg: 'Success... Redirecting To Login Page', type: 'alert-success' })
            setShowAlert(true);
            let timer2 = setTimeout(() => {
                setShowAlert(false);
                setIsLogin(true);
            }, 1000);
            return () => {
                clearTimeout(timer2);
            }
        } else if (Object.keys(resResult)[0] === "error") {
            setAlert({ ...alert, msg: `Error: ${resResult['error']}`, type: 'alert-danger' })
            setShowAlert(true);
            let timer2 = setTimeout(() => {
                setShowAlert(false);
            }, 1000);
            return () => {
                clearTimeout(timer2);
            }
        }
    }, [resResult])

    const handleSubmit = async (e) => {
        e.preventDefault();
        handleRegister();
    }

    return <>
        {showAlert && <p className={`alert ${alert.type}`}>{alert.msg}</p>}
        <form className="login-form" style={{ height: "620px" }} onSubmit={handleSubmit}>
            <h3>Sign Up</h3>
            <label htmlFor="username">Username</label>
            <input type="text" placeholder="Username" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <label htmlFor="password">Password</label>
            <input type="password" placeholder="Password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <label htmlFor="confirm-password">Confirm Password</label>
            <input type="password" placeholder="Confirm Password" id="confirm-password" name="confirm-password" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} />
            <button>Sign Up</button>
            <div style={{ textAlign: "center", marginTop: "10px" }}>
                or
                <p><a onClick={() => setIsLogin(true)}>Log In</a></p>
            </div>
        </form>
    </>
}

export default Register;