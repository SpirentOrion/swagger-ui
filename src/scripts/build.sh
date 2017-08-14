#!/bin/sh

REBUILD=true
if [ "$1" = "--no-rebuild" ]; then
    REBUILD=false
fi

cd `dirname $0`/../..
export PATH="$PATH:$PWD/node_modules/.bin/"

# clean files left on nodes from previous build process, the line should eventually be removed
rm -rf dist
rm -rf src/test/artifacts/*

. /etc/profile.d/nvm.sh
nvm install && nvm use

set -x
$REBUILD && npm rebuild
npm run release
