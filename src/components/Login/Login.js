import React, {
  useState,
  useEffect,
  useReducer,
  useContext,
  useRef,
} from 'react';

import AuthContext from '../../store/auth-context';

import Card from '../UI/Card/Card';
import styles from './Login.module.css';
import Button from '../UI/Button/Button';
import Input from '../UI/Input/Input';

// reducers are written outside the component
// the "state" is guaranteed to be the latest state snapshot
// could refactor to use one reducer for both email and password
const emailReducer = (state, action) => {
  if (action.type === 'USER_INPUT') {
    return { value: action.value, isValid: action.value.includes('@') };
  }
  if (action.type === 'INPUT_BLUR') {
    return { value: state.value, isValid: state.value.includes('@') };
  }

  // default state (when no matching action.type was found)
  return { value: '', isValid: false };
};

const passwordReducer = (state, action) => {
  if (action.type === 'USER_INPUT') {
    return { value: action.value, isValid: action.value.trim().length > 6 };
  }
  if (action.type === 'INPUT_BLUR') {
    return { value: state.value, isValid: state.value.trim().length > 6 };
  }

  // default state (when no matching action.type was found)
  return { value: '', isValid: false };
};

const Login = () => {
  const [formIsValid, setFormIsValid] = useState(false);

  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: '',
    isValid: null,
  });

  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: '',
    isValid: null,
  });

  const { isValid: emailIsValid } = emailState; // object destructuring with an alias
  // const { isValid: passwordIsValid } = passwordState; // we don't have to use object destructing to get the same result

  const authCtx = useContext(AuthContext);

  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  useEffect(() => {
    const timeoutID = setTimeout(() => {
      console.log('Checking form validity');
      setFormIsValid(emailIsValid && passwordState.isValid);
    }, 2000); // 500 would be a better delay IRL

    return () => {
      console.log('Inside cleanup function');
      clearTimeout(timeoutID);
    }; // useEffect can return a cleanup function. This function runs before every execution of the useEffect function (except for the first execution), and when the component that contains this useEffect unmounts (is removed) from the DOM
  }, [emailIsValid, passwordState.isValid]); // we don't have to use object destructuring to get the same result

  const handleEmailChange = (event) => {
    dispatchEmail({ type: 'USER_INPUT', value: event.target.value });
  };

  const handlePasswordChange = (event) => {
    dispatchPassword({ type: 'USER_INPUT', value: event.target.value });
  };

  const handleValidateEmail = () => {
    dispatchEmail({ type: 'INPUT_BLUR' });
  };

  const handleValidatePassword = () => {
    dispatchPassword({ type: 'INPUT_BLUR' });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (formIsValid) {
      authCtx.onLogin(emailState.value, passwordState.value);
    } else if (!emailIsValid) {
      emailInputRef.current.customFocus();
    } else {
      passwordInputRef.current.customFocus();
    }
  };

  return (
    <Card className={styles.login}>
      <form onSubmit={handleSubmit}>
        <Input
          ref={emailInputRef}
          id="email"
          label="E-Mail"
          type="email"
          isValid={emailIsValid}
          value={emailState.value}
          onChange={handleEmailChange}
          onBlur={handleValidateEmail}
        />
        <Input
          ref={passwordInputRef}
          id="password"
          label="Password"
          type="password"
          isValid={passwordState.isValid}
          value={passwordState.value}
          onChange={handlePasswordChange}
          onBlur={handleValidatePassword}
        />
        <div className={styles.actions}>
          <Button type="submit" className={styles.btn}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
