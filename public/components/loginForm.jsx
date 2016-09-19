const React = require('react');
const ReactDOM = require('react-dom')

module.exports = React.createClass({
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
})
