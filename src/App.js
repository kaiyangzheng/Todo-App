import React, { useState, useEffect } from 'react';

import Login from './Login';
import Todo from './Todo';

function App() {
  const [token, setToken] = useState(() => {
    const saved = localStorage.getItem("token");
    return saved || "";
  });

  useEffect(() => {
    localStorage.setItem("token", token)
  }, [token])

  return <>
    {!token && <Login setToken={setToken} />}
    {token && <Todo token={token} />}

  </>
}
export default App;
