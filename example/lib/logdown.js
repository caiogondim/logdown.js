(function () {
  var __captured_scopes = Array(1);

  var _$0 = this;

  function _0(prefix, opts) {
    if (!(this instanceof _0)) {
      return new _0(prefix, opts);
    }

    if (_0._isPrefixAlreadyInUse(prefix)) {
      return _0._getInstanceByPrefix(prefix);
    }

    this.opts = _0._normalizeOpts(prefix, opts);
    this.state = _0._getInitialState(this.opts);

    _0._instances.push(this);

    return this;
  }

  var _d = _0.prototype;

  function _3(str) {
    return new _$0.RegExp('^' + str.replace(/\*/g, '.*?') + '$');
  }

  function _4(prefix) {
    return _0._instances.some(function (instance) {
      return instance.opts.prefix === prefix;
    });
  }

  function _5(prefix) {
    return _0._instances.filter(function (instanceCur) {
      return instanceCur.opts.prefix === prefix;
    })[0];
  }

  function _6(prefix, opts) {
    if (typeof prefix !== 'string') {
      throw new _$0.TypeError('prefix must be a string');
    }

    opts = opts || {};
    var markdown = opts.markdown === void 0 ? true : _$0.Boolean(opts.markdown);

    var prefixColor = opts.prefixColor || _0._getNextPrefixColor();

    return {
      prefix: prefix,
      prefixColor: prefixColor,
      markdown: markdown
    };
  }

  function _7(opts) {
    return {
      isEnabled: _0._getEnableState(opts)
    };
  }

  function _8(opts) {
    var isEnabled = false;

    _0._prefixRegExps.forEach(function (filter) {
      if (filter.type === 'enable' && filter.regExp.test(opts.prefix)) {
        isEnabled = true;
      } else if (filter.type === 'disable' && filter.regExp.test(opts.prefix)) {
        isEnabled = false;
      }
    });

    return isEnabled;
  }

  function _a() {
    try {
      if (_b.localStorage && typeof _b.localStorage.getItem('debug') === 'string') {
        _0._prefixRegExps = [];

        _b.localStorage.getItem('debug').split(',').forEach(function (str) {
          str = str.trim();
          var type = 'enable';

          if (str[0] === '-') {
            str = str.substr(1);
            type = 'disable';
          }

          var regExp = _0._prepareRegExpForPrefixSearch(str);

          _0._prefixRegExps.push({
            type: type,
            regExp: regExp
          });
        });
      }
    } catch (error) {}
  }

  function _c() {
    var __scope_0 = 0;
    if (!__captured_scopes[__scope_0]) __captured_scopes[__scope_0] = {
      lastUsed: 0
    };
    __captured_scopes[__scope_0].lastUsed += 1;
    return _0.prefixColors[__captured_scopes[__scope_0].lastUsed % _0.prefixColors.length];
  }

  function _f(arg) {
    return _$0.Array.prototype.slice.call(arg, 0);
  }

  function _e() {
    if (!this.state.isEnabled) {
      return;
    }

    var args = _f(arguments);

    var preparedOutput = this._prepareOutput(args, "debug");

    (_$0.console["debug"] || _$0.console.log).apply(_$0.console, preparedOutput);
  }

  function _g() {
    if (!this.state.isEnabled) {
      return;
    }

    var args = _f(arguments);

    var preparedOutput = this._prepareOutput(args, "log");

    (_$0.console["log"] || _$0.console.log).apply(_$0.console, preparedOutput);
  }

  function _h() {
    if (!this.state.isEnabled) {
      return;
    }

    var args = _f(arguments);

    var preparedOutput = this._prepareOutput(args, "info");

    (_$0.console["info"] || _$0.console.log).apply(_$0.console, preparedOutput);
  }

  function _i() {
    if (!this.state.isEnabled) {
      return;
    }

    var args = _f(arguments);

    var preparedOutput = this._prepareOutput(args, "warn");

    (_$0.console["warn"] || _$0.console.log).apply(_$0.console, preparedOutput);
  }

  function _j() {
    if (!this.state.isEnabled) {
      return;
    }

    var args = _f(arguments);

    var preparedOutput = this._prepareOutput(args, "error");

    (_$0.console["error"] || _$0.console.log).apply(_$0.console, preparedOutput);
  }

  function _m() {
    try {
      return 'WebkitAppearance' in _$0.document.documentElement.style;
    } catch (error) {
      return false;
    }
  }

  function _n() {
    try {
      return navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/);
    } catch (error) {
      return false;
    }
  }

  function _l() {
    return _m() || _n();
  }

  function _k() {
    var decoratedPrefix = [];

    if (_l()) {
      decoratedPrefix.push('%c' + this.opts.prefix + '%c ');
      decoratedPrefix.push('color:' + this.opts.prefixColor + '; font-weight:bold;', '' // Empty string resets style.
      );
    } else {
      decoratedPrefix.push('[' + this.opts.prefix + '] ');
    }

    return decoratedPrefix;
  }

  function _r(text, rules) {
    var matches = [];
    rules.forEach(function (rule) {
      var match = text.match(rule.regexp);

      if (match) {
        matches.push({
          rule: rule,
          match: match
        });
      }
    });

    if (matches.length === 0) {
      return null;
    }

    matches.sort(function (a, b) {
      return a.match.index - b.match.index;
    });
    return matches[0];
  }

  function _v(match, submatch1) {
    return '%c' + submatch1 + '%c';
  }

  function _y(match, submatch1) {
    return '%c' + submatch1 + '%c';
  }

  function _B(match, submatch1) {
    return '%c' + submatch1 + '%c';
  }

  function _q(text) {
    var styles = [];

    var match = _r(text, _s);

    while (match) {
      styles.push(match.rule.style);
      styles.push(''); // Empty string resets style.

      text = text.replace(match.rule.regexp, match.rule.replacer);
      match = _r(text, _s);
    }

    return {
      text: text,
      styles: styles
    };
  }

  function _o(args) {
    var preparedOutput = this._getDecoratedPrefix();

    var parsedMarkdown; // Only first argument on `console` can have style.

    if (typeof args[0] === 'string') {
      if (this.opts.markdown && _l()) {
        parsedMarkdown = _p.parse(args[0]);
        preparedOutput[0] = preparedOutput[0] + parsedMarkdown.text;
        preparedOutput = preparedOutput.concat(parsedMarkdown.styles);
      } else {
        preparedOutput[0] = preparedOutput[0] + args[0];
      }
    } else {
      preparedOutput.push(args[0]);
    }

    if (args.length > 1) {
      preparedOutput = preparedOutput.concat(args.slice(1));
    }

    return preparedOutput;
  }

  _0._instances = [];
  _0._prefixRegExps = [];
  _0._prepareRegExpForPrefixSearch = _3;
  _0._isPrefixAlreadyInUse = _4;
  _0._getInstanceByPrefix = _5;
  _0._normalizeOpts = _6;
  _0._getInitialState = _7;
  _0._getEnableState = _8;
  _0.prefixColors = ["#F2777A", "#F99157", "#FFCC66", "#99CC99", "#66CCCC", "#6699CC", "#CC99CC"];

  var _b = this;

  _0._setPrefixRegExps = _a;
  _0._getNextPrefixColor = _c;
  var _s = [{
    regexp: /\*([^*]+)\*/,
    replacer: _v,
    style: "font-weight:bold;"
  }, {
    regexp: /_([^_]+)_/,
    replacer: _y,
    style: "font-style:italic;"
  }, {
    regexp: /`([^`]+)`/,
    replacer: _B,
    style: "background-color:rgba(255,204,102, 0.1);color:#FFCC66;padding:2px 5px;border-radius:2px;"
  }];
  var _p = {
    parse: _q
  };
  _d._prepareOutput = _o;
  _d._getDecoratedPrefix = _k;
  _d.error = _j;
  _d.warn = _i;
  _d.info = _h;
  _d.log = _g;
  _d.debug = _e;
  logdown = _0;
}).call(this);