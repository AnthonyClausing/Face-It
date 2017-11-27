import React from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {authorize} from '../store'
import {NavLink} from 'react-router-dom'

//Cannot read property 'error' of undefined 
//the above error occurred in the <Connect(AuthForm)> component:
//crossed out error and state.user.error handler

const AuthForm = (props) => {
  const {name, displayName, handleSubmit, error} = props

  return (
    <div>
      <form onSubmit={handleSubmit} name={name}>
      <div className ='login-authorization' >
        <div>
          <label htmlFor="email"><small>Email</small></label>
          <input className= 'login-authorization-items' name="email" type="text" />
        </div>
        <div>
          <label htmlFor="password"><small>Password</small></label>
          <input className= 'login-authorization-items' name="password" type="password" />
        </div>
        <div>
          <button className= 'login-authorization-items' type="submit">{displayName}</button>
        </div>
        {error && error.response && <div> {error.response.data} </div>}
        </div>
      </form>
    </div>
  )
}

const mapLogin = (state) => {
  return {
    name: 'login',
    displayName: 'Login',
    error: state.user.error
  }
}

const mapSignup = (state) => {
  return {
    name: 'signup',
    displayName: 'Sign Up',
    error: state.user.error
  }
}

const mapDispatch = (dispatch) => {
  return {
    handleSubmit (evt) {
      evt.preventDefault()
      const formName = evt.target.name
      const email = evt.target.email.value
      const password = evt.target.password.value
      dispatch(authorize(email, password, formName))
      evt.target.email.value = ''
      evt.target.password.value = ''
    }
  }
}

export const Loging = connect(mapLogin, mapDispatch)(AuthForm)
export const Signup = connect(mapSignup, mapDispatch)(AuthForm)

AuthForm.propTypes = {
  name: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.object
}
