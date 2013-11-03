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
  var UrlFrameUrl = React.createClass({

    render: function() {

      var originalClassName = 'url-frame__url';
      var activeClassName = ' url-frame__url--active';
      var className = originalClassName;

      (this.props.active === false) || (className += activeClassName);

      return (
        <div className={className}>
          <a href={this.props.href}>{this.props.href}</a>
        </div>
      )
    }
  });

  var UrlFrame = React.createClass({

    getInitialState: function() {
      return {urls: this.props.urls};
    },

    render: function() {
      var _this = this;

      var urls = this.state.urls.map(function (url) {
        return <UrlFrameUrl href={url.href} active={url.active} />
      });

      return (
        <nav>
          <h1>WRITE</h1>
          {urls}
        </nav>
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
          <div>
            <h1>Create</h1>
            <form onSubmit={this.handleSubmit}>
                <input
                  className='text-input'
                  placeholder='description'
                  ref='description' />
                <input type='submit' value='send' className='button' />
            </form>
          </div>
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
          <div>
            <h1>Remove</h1>
            <form onSubmit={this.handleSubmit}>
                <input
                  className='text-input'
                  placeholder='uuid'
                  ref='uuid' />
                <input type='submit' value='send' className='button' />
            </form>
          </div>
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
          <div>
            <h1>Update</h1>
            <form onSubmit={this.handleSubmit}>
                <input
                  className='text-input'
                  placeholder='uuid'
                  ref='uuid' />
                <input
                  className='text-input'
                  placeholder='description'
                  ref='description' />
                <input type='submit' value='send' className='button' />
            </form>
          </div>
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
          <div>
            <h1>Checkout</h1>
            <form onSubmit={this.handleSubmit}>
                <input
                  className='text-input'
                  placeholder='uuid'
                  ref='uuid' />
                <input type='submit' value='send' className='button' />
            </form>
          </div>
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
          <div>
            <h1>Checkin</h1>
            <form onSubmit={this.handleSubmit}>
                <input
                  className='text-input'
                  placeholder='uuid'
                  ref='uuid' />
                <input type='submit' value='send' className='button' />
            </form>
          </div>
        )
      }
    })
  };

  var FormFrame = React.createClass({

    getInitialState: function () {
      return {form:""};
    },

    render: function () {

      var Form = forms[this.state.form];

      var form = "None found.";
      if (Form) form = new Form({onData: this.props.onData});
      
      return (
        <div className='form'>{form}</div>
      )
    }
  });



  /**
   * Response Frame
   */
  var ResponseFrame = React.createClass({

    getInitialState: function () {
      return {data: {}};
    },

    render: function () {
      return (
        <div className='response'>
          <h1>Response</h1>
          <div>{this.state.data}</div>
        </div>
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
    <UrlFrame urls={urls} />,
    document.getElementsByClassName('#url-frame')[0]
  );

  var responseFrame;
  responseFrame = React.renderComponent(
    <ResponseFrame />,
    document.getElementsByClassName('#response-frame')[0]
  );

  function handleData (data) {
    responseFrame.setState({data:data});  
  }

  var formFrame;
  formFrame = React.renderComponent(
    <FormFrame onData={handleData} />,
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