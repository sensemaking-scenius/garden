#!/bin/bash

# Update all submodules to their latest versions
echo "Updating all submodules..."
git submodule foreach git pull origin main

# Return to root directory (in case we were in a submodule)
cd "$(git rev-parse --show-toplevel)"

# Stage all submodule changes
echo "Staging submodule updates..."
git add .

# Only commit and push if there are changes
if git diff --staged --quiet; then
    echo "No submodule updates to commit."
else
    echo "Committing and pushing submodule updates..."
    git commit -m "Update submodules to latest versions"
    git push
fi

echo "Done!" 