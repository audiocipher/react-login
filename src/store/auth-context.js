import React, { useState, useEffect } from 'react';

// AuthContext is an object that contains a component called Provider, and other properties
const AuthContext = React.createContext({
  isLoggedIn: false,
  onLogin: (email, password) => {}, // best practice: dummy function added for IDE autocompletion
  onLogout: () => {}, // best practice: dummy function added for IDE autocompletion
});

// managing the login state using a component
export const AuthContextProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  /* 
    executes after render
    executes after render again if dependencies change
    only executes once if dependencies are empty
    executes after every render if no dependencies array is passed
    great for side effects like data fetching, external apis, timers, general side effects, etc.
  */
  useEffect(() => {
    if (localStorage.getItem('isLoggedIn') === 'LOGGED_IN') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    // We should of course check email and password, but it's just a dummy/demo
    localStorage.setItem('isLoggedIn', 'LOGGED_IN');
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, onLogin: handleLogin, onLogout: handleLogout }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
