import * as ActionTypes from '../../constants/auth/auth.constants';
import fetch from 'isomorphic-fetch';

const baseURL = typeof window === 'undefined' ? process.env.BASE_URL || (`http://localhost:${(process.env.PORT || 8000)}`) : '';

export function loginRequest(creds) {
  return {
    type: ActionTypes.LOGIN_REQUEST,
    isFetching: true,
    isAuthenticated: false,
    creds
  };
}

export function loginSuccess(user) {
  return {
    type: ActionTypes.LOGIN_SUCCESS,
    isFetching: false,
    isAuthenticated: true,
    id_toke: user.id_token
  };
}

export function loginFailure(message) {
  return {
    type: ActionTypes.LOGIN_FAILURE,
    isFetching: false,
    isAuthenticated: false,
    message
  };
}

export function loginUser(creds) {
  const config = {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify({
      user: {
        username: creds.username,
        password: creds.password
      }
    });
  };

  return (dispatch) => {
    dispatch(loginRequest(creds));

    fetch(`${baseURL}/api/login`, config)
    .then((res) => res.json())
    .then(res => {
      if (!res.ok) {
        dispatch(loginFailure(res.message));
      }
      else {
        localStorage.setItem('id_token', res.user.id_token);
        dispatch(loginSuccess(res.user));
      }
    })
    .catch(err => console.log('Error: ', err));
  };
}
