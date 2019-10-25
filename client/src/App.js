import React from 'react';
import './App.css';
import {
  Button,
  Grid,
  FormControl,
  FormHelperText,
  TextField
} from '@material-ui/core';
import { AccountCircle, Visibility, VisibilityOff } from '@material-ui/icons';
import HttpsIcon from '@material-ui/icons/Https';
import { withStyles } from '@material-ui/core/styles';
import io from 'socket.io-client';

// const socket = io.connect('http://localhost:5000');

const StyledButton = withStyles({
  root: {
    backgroundColor: 'teal'
  }
})(Button);

let socket;
let myTimeout;
function App() {
  if (!socket) {
    socket = io(':5000');
  }
  const [state, setValues] = React.useState({
    showPassword: false,
    loginError: false,
    passwordError: false,
    loginErrorText: '',
    passwordErrorText: ''
  });

  const [buttons, setButtons] = React.useState({
    vydalyty: true,
    dodaty: true
  });

  const [credentials, setCredentials] = React.useState({
    email: '',
    password: ''
  });

  React.useEffect(() => {
    socket.on('user-added', data => {
      setValues({
        ...state,
        passwordErrorText: data.msg,
        passwordError: false,
        loginErrorText: ''
      });
    });
    socket.on('user-removed', data => {
      setValues({
        ...state,
        passwordErrorText: data.msg,
        passwordError: false,
        loginErrorText: ''
      });
    });
    socket.on('email-validation', data => {
      // If password already exists, change disabled buttons
      setButtons({
        vydalyty: data.available,
        dodaty: !data.available
      });
      console.log('data available ' + data.available);
    });
    socket.on('logged-in', data => {
      setValues({
        ...state,
        passwordErrorText: data.msg,
        passwordError: data.errorMsg
      });
    });
  }, []);

  React.useEffect(() => {
    clearTimeout(myTimeout);
    myTimeout = setTimeout(() => {
      if (credentials.email && credentials.password) {
        fetch('/val', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: credentials.email
          })
        })
          .then(res => res.json())
          .then(res => {
            setValues({
              ...state,
              loginErrorText: res.msg,
              passwordErrorText: ''
            });
            console.log(res);
          });
      }
    }, 3000);
  }, [credentials.password, credentials.email]);

  const handleChange = name => event => {
    setCredentials({ ...credentials, [name]: event.target.value });
  };

  const passwordVisisbility = () => {
    setValues({
      ...state,
      showPassword: !state.showPassword
    });
  };

  let icon = null;
  if (state.showPassword) {
    icon = <Visibility id="visibility" onClick={passwordVisisbility} />;
  } else {
    icon = <VisibilityOff id="visibility" onClick={passwordVisisbility} />;
  }

  return (
    <div className="App">
      <form className="login-form">
        <div className="input-fields">
          <Grid
            alignItems="flex-end"
            alignContent="flex-end
          "
          >
            <Grid>
              <FormControl error={state.loginError}>
                <Grid container spacing={1} alignItems="flex-end">
                  <Grid item>
                    <AccountCircle />
                  </Grid>
                  <Grid item>
                    <TextField
                      id="login"
                      label="Телефон, email або логін"
                      onChange={handleChange('email')}
                      value={credentials.email}
                    />
                  </Grid>
                </Grid>
                <FormHelperText id="login-error-text" error={state.loginError}>
                  {state.loginErrorText}
                </FormHelperText>
              </FormControl>
            </Grid>

            <FormControl error={state.passwordError}>
              <Grid container spacing={1} alignItems="flex-end">
                <Grid item>
                  <HttpsIcon />
                </Grid>
                <Grid item>
                  <TextField
                    label="Пароль"
                    type={state.showPassword ? 'text' : 'password'}
                    id="password"
                    onChange={handleChange('password')}
                    value={credentials.password}
                    InputProps={{ endAdornment: icon }}
                  />
                </Grid>
              </Grid>
              <FormHelperText
                id="password-error-text"
                error={state.passwordError}
              >
                {state.passwordErrorText}
              </FormHelperText>
            </FormControl>
          </Grid>
        </div>
        <div className="form-buttons">
          <div className="form-button">
            <StyledButton
              id="uviity"
              onClick={() => {
                const { email, password } = credentials;
                const numberCheck = /^[0-9]*$/.test(password);
                if (email && password && !numberCheck)
                  fetch('/auth', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      email: email,
                      password: password
                    })
                  })
                    .then(res => res.json())
                    // .then(res => console.log(res))
                    .then(res => {
                      if (res.authorized) {
                        setCredentials({
                          ...credentials,
                          email: '',
                          password: ''
                        });
                      }
                    });
              }}
              variant="contained"
            >
              Увійти
            </StyledButton>
          </div>
          <div className="form-button">
            <StyledButton
              variant="contained"
              disabled={buttons.dodaty}
              onClick={() => {
                const { email, password } = credentials;
                const numberCheck = /^[0-9]*$/.test(password);
                if (email && password && !numberCheck) {
                  fetch('/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      email: email,
                      password: password
                    })
                  })
                    .then(res => res.json())
                    .then(res => console.log(res))
                    .then(() => {
                      setCredentials({
                        ...credentials,
                        email: '',
                        password: ''
                      });
                    });
                } else if (numberCheck) {
                  setValues({
                    ...state,
                    passwordErrorText: "Password shouldn't contain only numbers"
                  });
                }
              }}
            >
              Додати
            </StyledButton>
          </div>
          <div className="form-button">
            <StyledButton
              variant="contained"
              disabled={buttons.vydalyty}
              onClick={() => {
                const { email, password } = credentials;
                const numberCheck = /^[0-9]*$/.test(password);
                if (email && password && !numberCheck) {
                  fetch('/users', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      email,
                      password
                    })
                  }).then(res => {
                    if (res.status === 200) {
                      setCredentials({
                        ...credentials,
                        email: '',
                        password: ''
                      });
                    }
                  });
                }
              }}
            >
              Видалити
            </StyledButton>
          </div>
        </div>
      </form>
    </div>
  );
}

export default App;
