#!/bin/bash

`rm -rf ./character/*`
`cp -rf ~/Downloads/www.mortalkombatwarehouse.com/mk2/* ./character/`

`find ./character -iname *.gif | xargs rm -rf`
`find ./character -iname *.html | xargs rm -rf`
`find ./character -iname moves | xargs rm -rf`
echo "Clean dir done"
for i in `find . | grep -E "*.png"`
do
    path=${i%/*}
    file=${i##*/}
    dirname=${path##*/}
    to="$path/$dirname$file"
    mv $i $to
done

echo "Move done"

for j in `find ./character -type d -d 1`
do
    directory=${j##*/}
    `zip -r ./character/$directory ./character/$directory`
    `rm -rf ./character/$directory`
done
