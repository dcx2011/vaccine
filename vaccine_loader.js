
(function() {

  // Replace sourceDir with the directory of your source files relative to the
  // server location.
  var sourceDir = 'src',

      // Replace libraryDir with the directory of your (pre-built) dependencies.
      libraryDir = 'lib',
      appName = 'my_app',
      main = 'index';   // The main (index) file for you app.


  var loading = {};

  function define(id, defn) {

    if (!window.vaccine) {
      // The minimal code required to be vaccine compliant.
      (function() {
        var waiting = {}, modules = {};
        window.vaccine = {
          on: function(id, callback) {
            (waiting[id] = waiting[id] || []).push(callback);
          },
          get: function(id) {
            return modules[id];
          },
          set: function(id, val) {
            modules[id] = val;
            (waiting[id] || []).forEach(function(w) { w(); });
          }
        };
      }());
    }
    // Set your library with vaccine.set('mylib', mylib);

    var parts = id.split('/'),
        globalVaccine = window.vaccine,
        module = {exports: {}};

    function require(reqId) {
      var matching = /(\.?\.\/?)*/.exec(reqId)[0],
          // Some code golf to get the number of "directories" back we want to go
          back = Math.floor(matching.replace(/\//g, '').length / 1.9 + 0.99),
          base;
      if (back) {
        base = parts.slice(0, parts.length - back).join('/');
        if (base) base += '/';
        reqId = base + reqId.slice(matching.length);
      }
      reqId = reqId.replace(/\/$/, '');
      var mod = globalVaccine.get(reqId);
      if (!mod) {
        require.id = reqId;
        throw require;  // Throw require, to ensure correct error gets handled
      }
      return mod;
    }

    try {
      defn(require, module.exports, module);
      globalVaccine.set(id, module.exports);
    } catch (e) {
      if (e != require) throw e;

      var split = require.id.split('/'),
          root = split.shift(),
          src,
          script;
      if (root === appName) {
        if (!split.length) {
          split.push(main);
        }
        src = sourceDir + '/' + split.join('/');
      } else {
        src = libraryDir + '/' + root;
      }
      src += '.js';
      if (!loading[src]) {
        loading[src] = src;
        script = document.createElement('script');
        script.src = src;
        document.head.appendChild(script);
      }

      globalVaccine.on(require.id, function() { define(id, defn); });
    }
  }

  window.define = define;
  define('vaccine_loader', function(require) { require(appName); });

}());

