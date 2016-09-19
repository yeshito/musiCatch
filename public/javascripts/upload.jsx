'use strict';
console.log('loaded!')
var React = require('react');
var Dropzone = require('react-dropzone');
var LoadXML = React.createClass({
    onDrop: function (files) {
      console.log('Received files: ', files);
    },

    render: function () {
      return (
          <div>
            <Dropzone onDrop={this.onDrop} multiple="false">
              <div>Try dropping some files here, or click to select files to upload.</div>
            </Dropzone>
          </div>
      );
    }
});
// export default LoadXML;
React.render(<LoadXML/>, document.body);
