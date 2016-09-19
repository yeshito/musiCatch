const React = require('react');
const ReactDOM = require('react-dom')

module.exports = React.createClass({
  render: () => {
    return (
      <form onSubmit={this.onFormSubmit} method="post" action="/signup" className="circleForm seaBg">
      <h2 className="black">Signup</h2>
      <div>
        <input name="firstName" type="text" required="" placeholder="First Name"></input>
      </div>
      <div>
        <input name="lastName" type="text" required="" placeholder="Last Name"></input>
      </div>
      <div>
        <input name="newEmail" type="email" required="" placeholder="Email"></input>
      </div>
      <div>
        <input name="newPassword" type="password" required="" placeholder="Password"></input>
      </div>
      <div>
        <button type="submit">
          Signup
        </button>
      </div>
    </form>)
  }
})
