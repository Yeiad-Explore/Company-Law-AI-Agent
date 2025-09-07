#!/bin/bash

# Fix Git repository by removing large files from history
echo "Fixing Git repository..."

# Check current status
git status

# Add all files except node_modules
git add .gitignore
git add *.py
git add *.md
git add *.txt
git add *.json
git add *.js
git add *.ts
git add *.tsx
git add *.css
git add *.yml
git add *.yaml
git add *.sh
git add app/
git add components/
git add hooks/
git add lib/
git add company_documents/
git add env.example
git add requirements.txt
git add package.json
git add package-lock.json
git add next.config.js
git add tailwind.config.js
git add postcss.config.js
git add tsconfig.json
git add Dockerfile
git add docker-compose.yml
git add setup.py
git add setup-veridic-ai.sh
git add streamlit_app.py
git add simplified_backend.py

# Commit the clean version
git commit -m "Clean repository without node_modules

- Removed all node_modules files from Git tracking
- Added proper .gitignore for Node.js projects
- Repository is now under GitHub's file size limits
- All source code and configuration files included"

echo "Clean commit created. Now pushing to GitHub..."

# Push to GitHub
git push origin clean-main

echo "Done! The repository should now be pushed successfully."
