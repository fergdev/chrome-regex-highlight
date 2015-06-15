echo 'Building....'

echo 'Deleting old build dir'
rm -rf build

mkdir build

zip build/reghi.zip content.js icon128.png icon16.png icon48.png jquery-2.1.4.min.js manifest.json popup.css popup.html popup.js


