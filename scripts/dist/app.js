/** @jsx React.DOM */
window.addEventListener ("DOMContentLoaded", function () {

  var routes = {
    '*': run
  }
  function onclick (e) {
    var href = e.target.getAttribute('href');
    if (!href) return;
    e.preventDefault();
    history.pushState({path:href}, document.title, href);
    show(href);
  }
  function onpopstate (e) {
    var href;
    if (e.state) {
      href = e.state.path;
      show(href);
    }
  }
  function show (path) {
    var fn = routes[path];
    if (!fn) {
      fn = routes['*'];
    }
    fn(path);
  }
  window.addEventListener('click', onclick, false);
  window.addEventListener('popstate', onpopstate, false);

  /**
   * URL Frame
   */
  var UrlFrameUrl = React.createClass({displayName: 'UrlFrameUrl',

    render: function() {

      var originalClassName = 'url-frame__url';
      var activeClassName = ' url-frame__url--active';
      var className = originalClassName;

      (this.props.active === false) || (className += activeClassName);

      return (
        React.DOM.div( {className:className}, 
          React.DOM.a( {href:this.props.href}, this.props.href)
        )
      )
    }
  });

  var UrlFrame = React.createClass({displayName: 'UrlFrame',

    getInitialState: function() {
      return {urls: this.props.urls};
    },

    render: function() {
      var _this = this;

      var urls = this.state.urls.map(function (url) {
        return UrlFrameUrl( {href:url.href, active:url.active} )
      });

      return (
        React.DOM.nav(null, 
          React.DOM.h1(null, "WRITE"),
          urls
        )
      );
    }
  });



  /**
   * Form Frame
   */
  var forms = {
    "create": React.createClass({

      getInitialState: function () {
        return {description: ''}
      },

      serialize: function () {
        return 'description=' +
            this.refs.description.getDOMNode().value.trim();
      },

      handleSubmit: function (e) {
        e.preventDefault();
        var onData = this.props.onData;
        $.post('/create', this.serialize(), function(data) {
          onData(data);
        });
      },

      render: function () {
        return (
          React.DOM.div(null, 
            React.DOM.h1(null, "Create"),
            React.DOM.form( {onSubmit:this.handleSubmit}, 
                React.DOM.input(
                  {className:"text-input",
                  placeholder:"description",
                  ref:"description"} ),
                React.DOM.input( {type:"submit", value:"send", className:"button"} )
            )
          )
        )
      }
    }),

    "remove": React.createClass({
      
      getInitialState: function () {
        return {uuid: ''};
      },

      serialize: function () {
        return 'uuid=' +
            this.refs.uuid.getDOMNode().value.trim();
      },

      handleSubmit: function (e) {
        e.preventDefault();
        var onData = this.props.onData;
        $.post('/remove', this.serialize(), function (data) {
          onData(data || "ok");
        });
      },

      render: function () {

        return (
          React.DOM.div(null, 
            React.DOM.h1(null, "Remove"),
            React.DOM.form( {onSubmit:this.handleSubmit}, 
                React.DOM.input(
                  {className:"text-input",
                  placeholder:"uuid",
                  ref:"uuid"} ),
                React.DOM.input( {type:"submit", value:"send", className:"button"} )
            )
          )
        )
      }
    }),

    "update": React.createClass({
      
      getInitialState: function () {
        return {uuid: '', description: ''};
      },

      serialize: function () {
        return 'uuid=' +
            this.refs.uuid.getDOMNode().value.trim() +
            "&description" + this.refs.description.getDOMNode().value.trim();
      },

      handleSubmit: function (e) {
        e.preventDefault();
        var onData = this.props.onData;
        $.post('/update', this.serialize(), function (data) {
          onData(data || "ok");
        });
      },

      render: function () {

        return (
          React.DOM.div(null, 
            React.DOM.h1(null, "Update"),
            React.DOM.form( {onSubmit:this.handleSubmit}, 
                React.DOM.input(
                  {className:"text-input",
                  placeholder:"uuid",
                  ref:"uuid"} ),
                React.DOM.input(
                  {className:"text-input",
                  placeholder:"description",
                  ref:"description"} ),
                React.DOM.input( {type:"submit", value:"send", className:"button"} )
            )
          )
        )
      }
    }),

    "checkout": React.createClass({
      
      getInitialState: function () {
        return {uuid: ''};
      },

      serialize: function () {
        return 'uuid=' +
            this.refs.uuid.getDOMNode().value.trim();
      },

      handleSubmit: function (e) {
        e.preventDefault();
        var onData = this.props.onData;
        $.post('/checkout', this.serialize(), function (data) {
          onData(data || "ok");
        });
      },

      render: function () {

        return (
          React.DOM.div(null, 
            React.DOM.h1(null, "Checkout"),
            React.DOM.form( {onSubmit:this.handleSubmit}, 
                React.DOM.input(
                  {className:"text-input",
                  placeholder:"uuid",
                  ref:"uuid"} ),
                React.DOM.input( {type:"submit", value:"send", className:"button"} )
            )
          )
        )
      }
    }),

    "checkin": React.createClass({
      
      getInitialState: function () {
        return {uuid: ''};
      },

      serialize: function () {
        return 'uuid=' +
            this.refs.uuid.getDOMNode().value.trim();
      },

      handleSubmit: function (e) {
        e.preventDefault();
        var onData = this.props.onData;
        $.post('/checkin', this.serialize(), function (data) {
          onData(data || "ok");
        });
      },

      render: function () {

        return (
          React.DOM.div(null, 
            React.DOM.h1(null, "Checkin"),
            React.DOM.form( {onSubmit:this.handleSubmit}, 
                React.DOM.input(
                  {className:"text-input",
                  placeholder:"uuid",
                  ref:"uuid"} ),
                React.DOM.input( {type:"submit", value:"send", className:"button"} )
            )
          )
        )
      }
    })
  };

  var Markdown = React.createClass({displayName: 'Markdown',

    fetch: function () {
      var _this = this;
      if (!this.just) {
        $.get('md/' + this.props.doc).done(function (html) {
          _this.just = true;
          _this.setState({html: html}, function () {
            _this.just = false;
          });
        });
      }
    },

    getInitialState: function () {
      this.fetch();
      return {html: ''};
    },

    render: function () {
      this.fetch();

      return (
        React.DOM.div( {className:"markdown", dangerouslySetInnerHTML:{
          __html: this.state.html
        }})
      )
    }
  });

  var FormFrame = React.createClass({displayName: 'FormFrame',

    getInitialState: function () {
      return {form: ''};
    },

    render: function () {

      var Form = forms[this.state.form];
      var form = 'None found.';

      if (Form) form = new Form({onData: this.props.onData});

      return (
        React.DOM.div( {className:"form"}, 
          React.DOM.div(null, form),
          Markdown( {doc:'randl-write/' + this.state.form} )
        )
      )
    }
  });



  /**
   * Response Frame
   */
  var ResponseFrame = React.createClass({displayName: 'ResponseFrame',

    getInitialState: function () {
      return {data: {}};
    },

    render: function () {
      return (
        React.DOM.div( {className:"response"}, 
          React.DOM.h1(null, "Response"),
          React.DOM.div(null, this.state.data)
        )
      )
    }
  });



  var urls = [
    {
      href: "/create",
      active: false
    },
    {
      href: "/remove",
      active: false
    },
    {
      href: "/update",
      active: false
    },
    {
      href: "/checkout",
      active: false
    },
    {
      href: "/checkin",
      active: false
    }
  ];

  function toggleActiveUrl (urls, url) {
    return urls.map(function (_url) {
      if (_url.href == url) _url.active = true;
      return _url;
    })
  }

  var urlFrame;
  urlFrame = React.renderComponent(
    UrlFrame( {urls:urls} ),
    document.getElementsByClassName('#url-frame')[0]
  );

  var responseFrame;
  responseFrame = React.renderComponent(
    ResponseFrame(null ),
    document.getElementsByClassName('#response-frame')[0]
  );

  function handleData (data) {
    responseFrame.setState({data:data});  
  }

  var formFrame;
  formFrame = React.renderComponent(
    FormFrame( {onData:handleData} ),
    document.getElementsByClassName('#form-frame')[0]
  );

  function run (path) {
    var _urls = JSON.parse(JSON.stringify(urls));

    urlFrame.setState({urls:toggleActiveUrl(_urls, path)});

    formFrame.setState({form:path.slice(1)});

    responseFrame.setState({data:''});
  }

  show(location.pathname);
}, false);