#!/bin/bash
mkdir build
zip -r build/hnstack-$1.zip manifest.json background.html popup.html js/ images/ -x .DS_Store .gitignore \*/.DS_Store
