    (function (root, factory) {
??????????????????????????????????????????????????????????????? supports('amd')
  ??????????????????????????????????????????????????????? (numSupports > 1)
      if (typeof define === 'function' && define.amd) {
  /////////////////////////////////////////////////////////////////////////
  ??????????????????????????????????????????????????????? exports('module')
        define(['exports', 'module'$-- umdDepsAmd --$], factory);
  :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    ???????????????????????????????????????????????? exports('exports')
        define(['exports'$-- umdDepsAmd --$], factory);
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        define([$-- umdDepsAmd --$], factory);
    ///////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////
  ??????????????????????????????????????????????????????? (numSupports > 1)
      }
  /////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
?????????????????????????????????????????????????????????? supports('commonjs')
  ??????????????????????????????????????????????????????? (numSupports > 1)
      if (typeof exports === 'object') {
  /////////////////////////////////////////////////////////////////////////
  ??????????????????????????????????????????????????????? exports('module')
        factory(exports, module$-- umdDepsCommonjs --$);
  :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        factory(exports$-- umdDepsCommonjs --$);
  /////////////////////////////////////////////////////////////////////////
  ??????????????????????????????????????????????????????? (numSupports > 1)
    ???????????????????????????????????????????????? supports('window')
      } else {
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
      }
    ///////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
???????????????????????????????????????????????????????????? supports('window')
  ??????????????????????????????????????????????????????? exports('module')
        var _module = {exports: {}};
  :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    ???????????????????????????????????????????????? exports('exports')
        var _exports = {};
    ///////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////
  ??????????????????????????????????????????????????????? exports('return')
    ???????????????????????????????????????????????? exports('exports')
      ??????????????????????????????????????????? exports('module')
        root.$-- global_name --$ = factory(_module.exports, _module$-- umdDepsWindow --$) || _module.exports;
      :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        root.$-- global_name --$ = factory(_exports$-- umdDepsWindow --$) || _exports;
      /////////////////////////////////////////////////////////////
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        root.$-- global_name --$ = factory($-- umdDepsWindow --$);
    ///////////////////////////////////////////////////////////////////
  :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    ????????????????????????????????????????????????? exports('module')
        factory(_module.exports, _module$-- umdDepsWindow --$);
        root.$-- global_name --$ = _module.exports;
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        factory(_exports$-- umdDepsWindow --$);
        root.$-- global_name --$ = _exports;
    ///////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////
  ???????????????????????????????????????????????????? supports('commonjs')
      }
  /////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
  ??????????????????????????????????????????????????????? exports('module')
    }(this, function (exports, module$-- umdDepsFactory --$) {
  :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    ???????????????????????????????????????????????? exports('exports')
    }(this, function (exports$-- umdDepsFactory --$) {
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    }(this, function ($-- umdDepsFactory --$) {
    ///////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////

      // Code goes here

    }));
