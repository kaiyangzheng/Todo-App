import React, { useState, useEffect } from 'react';


import Login from './Login';
import Register from './Register';
import Todo from './Todo';
import NavBar from './Nav';


function App() {
  const [upcoming, setUpcoming] = useState([]);
  const [token, setToken] = useState(() => {
    const saved = localStorage.getItem("token");
    return saved || "";
  });

  const [name, setName] = useState(() => {
    const saved = localStorage.getItem("name");
    return saved || "";
  })

  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    localStorage.setItem("token", token);
    localStorage.setItem("name", name);
  }, [token, name])

  const logout = () => {
    setToken('');
  }

  return <>
    {token && <NavBar logout={logout} name={name} upcoming={upcoming}></NavBar>}
    {!token && isLogin && <Login setToken={setToken} setName={setName} setIsLogin={setIsLogin} />}
    {!token && !isLogin && <Register setToken={setToken} setIsLogin={setIsLogin} setName={setName} />}
    {token && <Todo token={token} setUpcoming={setUpcoming} />}
  </>
}
export default App;
