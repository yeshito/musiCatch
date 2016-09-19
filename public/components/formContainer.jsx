// const React = require('react');
// const ReactDOM = require('react-dom');
// const LoginForm = require('./loginForm.jsx')
// const SignupForm = require('./signupForm.jsx')

module.exports = React.createClass({
  render: () => {
    return (<div className="formContainer">
              {this.props.children}
            </div>)
  }
});

ReactDOM.render(<FormContainer>
                  <SignupForm />
                  <LoginForm />
                </FormContainer>, document.getElementById('outerDiv'))
