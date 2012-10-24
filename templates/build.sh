    #!/bin/sh
    echo '(function() {##[ USE_STRICT ?? "use strict"; ]##'

?????????????????????????????????????????????????????????????????????? COMMONJS
    # vaccine.js must NOT be in the source list.
    source_dir='$$[ SOURCE_DIR ]$$'


    for file in $(find $source_dir -type f)
    do
      name=$(echo "$file" | sed -e "s#^$source_dir/##" -e 's/\.js//')
      echo "define('$name', function(require, ##[ MODULE_EXPORTS ?? exports, module :: exports ]##) {"
      cat $file
      echo '});'
    done
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: COMMONJS
    cat $(find $$[ SOURCE_DIR ]$$ -type f)   # vaccine.js must NOT be in the source list.
////////////////////////////////////////////////////////////////////// COMMONJS

    cat vaccine.js  # Must be after sources.
    echo '}());'