#!/bin/sh

PREVIOUS_BRANCH=$(git rev-parse --abbrev-ref HEAD)

if [ -z "$(git status --porcelain)" ]; then 
  # Working directory clean
  echo "Bumping version"
  VERSION=$(npm version patch)
  echo "Deploying gh-pages..."
  if git show-ref --verify --quiet "refs/heads/gh-pages"; then
    git checkout gh-pages
  else
    echo "Creating branch gh-pages..."
    git checkout -b gh-pages
  fi
  git merge main --no-edit
  if [[ $* == *-i* ]]; then
    echo "Modifying .gitignores..."
<<<<<<< HEAD
    ./ignore.js
=======
    node ./ignore.js
>>>>>>> main
  fi
  npm run benchmark
  npm run build
  git add .
  git commit -m "v$VERSION"
  git tag $VERSION
  git push origin gh-pages
  git checkout $PREVIOUS_BRANCH
else 
  # Uncommitted changes
  echo "Uncommitted git changes! Deploy failed."
fi