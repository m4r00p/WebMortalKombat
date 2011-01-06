for f in `find . -iname "*.js"`; do mv $f $f.old; sed 's/super/uper/g' $f.old > $f; rm -f $f.old; done
