const React = require('react');
const ReactDOM = require('react-dom')
import {SignupForm} from 'signupForm.jsx'
import {LoginForm} from 'loginForm.jsx'

const FormContainer = React.createClass({
  render: () => {
    return (<div className="formContainer">{this.props.children}</div>)
              /* <SignupForm />
              <LoginForm /> */
  }
});
// const SignupForm = React.createClass({
//   render: () => {
//     return (
//       <form method="post" action="/signup" className="circleForm seaBg">
//       <h2 className="black">Signup</h2>
//       <div>
//         <input name="firstName" type="text" required="" placeholder="First Name"></input>
//       </div>
//       <div>
//         <input name="lastName" type="text" required="" placeholder="Last Name"></input>
//       </div>
//       <div>
//         <input name="newEmail" type="email" required="" placeholder="Email"></input>
//       </div>
//       <div>
//         <input name="newPassword" type="password" required="" placeholder="Password"></input>
//       </div>
//       <div>
//         <button type="submit">
//           Signup
//         </button>
//       </div>
//     </form>)
//   }
// });
//
// const LoginForm = React.createClass({
//   render: () => {
//     return (
//       <form method="post" action="/login" className="circleForm saffronBg">
//         <h2 className="black">Login</h2>
//         <div>
//           <input name="email" type="email" required="" placeholder="Email"></input>
//         </div>
//         <div>
//           <input name="password" type="password" required="" placeholder="Password"></input>
//         </div>
//         <div>
//           <button type="submit">Log In</button>
//         </div>
//       </form>)
//   }
// });


ReactDOM.render(<FormContainer>
                  <SignupForm />
                  <LoginForm />
                </FormContainer>
                  , document.getElementById('outerDiv'))
