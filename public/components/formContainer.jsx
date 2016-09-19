import React from 'react';
import ReactDom from 'react-dom';


const FormContainer = React.createClass({
  render: () => {
    return (<div className="formContainer">
              <SignupForm />
              <LoginForm />
            </div>
    )

  }
});

const SignupForm = React.createClass({

  onFormSubmit(evt) {
    evt.preventDefault();
    console.log(this.refs)
  },

  render: () => {
    return (
      <form onSubmit={this.onFormSubmit} method="post" action="/signup" className="circleForm seaBg">
      <h2 className="black">Signup</h2>
      <div>
        <input ref="firstName" type="text" required="" placeholder="First Name"/>
      </div>
      <div>
        <input ref="lastName" type="text" required="" placeholder="Last Name"/>
      </div>
      <div>
        <input ref="newEmail" type="email" required="" placeholder="Email"/>
      </div>
      <div>
        <input ref="newPassword" type="password" required="" placeholder="Password"/>
      </div>
      <div>
        <button type="submit">
          Signup
        </button>
      </div>
    </form>)
  }
});

const LoginForm = React.createClass({

  onFormSubmit(evt) {
    evt.preventDefault();
    console.log(this.refs)
  },

  render: () => {
    return (
      <form onSubmit={this.onFormSubmit} method="post" action="/login" className="circleForm saffronBg">
        <h2 className="black">Login</h2>
        <div>
          <input name="email" type="email" required="" placeholder="Email"></input>
        </div>
        <div>
          <input name="password" type="password" required="" placeholder="Password"></input>
        </div>
        <div>
          <button type="submit">Log In</button>
        </div>
      </form>)
  }
});


ReactDOM.render(<FormContainer />
                  , document.getElementById('outerDiv'))
