#!/usr/bin/env python3
"""
Company Law AI Agent - Setup Script
This script helps you set up the environment securely.
"""

import os
import shutil
import sys
from pathlib import Path

def create_env_file():
    """Create .env file from template if it doesn't exist"""
    env_file = Path(".env")
    env_example = Path("env.example")
    
    if env_file.exists():
        print("✅ .env file already exists")
        return
    
    if not env_example.exists():
        print("❌ env.example file not found")
        return
    
    try:
        # Read the template with proper encoding
        content = None
        for encoding in ['utf-8', 'cp1252', 'latin-1']:
            try:
                with open(env_example, 'r', encoding=encoding) as f:
                    content = f.read()
                break
            except UnicodeDecodeError:
                continue
        
        if content is None:
            print("❌ Could not read env.example file")
            return
        
        # Write the .env file with UTF-8 encoding
        with open(env_file, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print("✅ Created .env file from template")
        print("📝 Please edit .env file with your actual API keys")
    except Exception as e:
        print(f"❌ Error creating .env file: {e}")

def check_gitignore():
    """Check if .gitignore includes .env"""
    gitignore_file = Path(".gitignore")
    
    if not gitignore_file.exists():
        print("❌ .gitignore file not found")
        return False
    
    with open(gitignore_file, 'r') as f:
        content = f.read()
    
    if '.env' in content:
        print("✅ .env is properly ignored in .gitignore")
        return True
    else:
        print("❌ .env is not in .gitignore - this is a security risk!")
        return False

def check_for_hardcoded_keys():
    """Check for hardcoded API keys in source files"""
    print("🔍 Checking for hardcoded API keys...")
    
    # Common API key patterns
    patterns = [
        'sk-proj-',
        'gsk_',
        'AIza',
        'tvly-',
        'sk-',
        'pk_'
    ]
    
    source_files = ['main.py', 'streamlit_app.py', 'simplified_backend.py']
    found_keys = False
    
    for file_path in source_files:
        if not Path(file_path).exists():
            continue
        
        try:
            # Try different encodings to handle Windows files
            content = None
            for encoding in ['utf-8', 'cp1252', 'latin-1']:
                try:
                    with open(file_path, 'r', encoding=encoding) as f:
                        content = f.read()
                    break
                except UnicodeDecodeError:
                    continue
            
            if content is None:
                print(f"⚠️  Could not read {file_path} - skipping")
                continue
                
            for pattern in patterns:
                if pattern in content:
                    print(f"⚠️  Potential API key found in {file_path}: {pattern}...")
                    found_keys = True
                    
        except Exception as e:
            print(f"⚠️  Error reading {file_path}: {e}")
            continue
    
    if not found_keys:
        print("✅ No hardcoded API keys found in source files")
    else:
        print("❌ Please remove hardcoded API keys from source files")
    
    return not found_keys

def create_directories():
    """Create necessary directories"""
    directories = ['company_documents', 'pdfs']
    
    for directory in directories:
        Path(directory).mkdir(exist_ok=True)
        print(f"✅ Created directory: {directory}")

def main():
    """Main setup function"""
    print("🚀 Company Law AI Agent - Security Setup")
    print("=" * 50)
    
    # Check if we're in the right directory
    if not Path("main.py").exists():
        print("❌ Please run this script from the project root directory")
        sys.exit(1)
    
    # Create necessary directories
    create_directories()
    
    # Check .gitignore
    gitignore_ok = check_gitignore()
    
    # Check for hardcoded keys
    keys_ok = check_for_hardcoded_keys()
    
    # Create .env file
    create_env_file()
    
    print("\n" + "=" * 50)
    print("📋 Setup Summary:")
    print(f"   .gitignore: {'✅ OK' if gitignore_ok else '❌ Needs attention'}")
    print(f"   API Keys: {'✅ OK' if keys_ok else '❌ Needs attention'}")
    print(f"   .env file: {'✅ Created' if Path('.env').exists() else '❌ Not created'}")
    
    if gitignore_ok and keys_ok:
        print("\n🎉 Setup complete! You can now safely push to GitHub.")
        print("\n📝 Next steps:")
        print("   1. Edit .env file with your actual API keys")
        print("   2. Test the application: python main.py")
        print("   3. Push to GitHub: git add . && git commit -m 'Initial commit' && git push")
    else:
        print("\n⚠️  Please fix the issues above before pushing to GitHub.")
        print("📖 See SECURITY.md for detailed instructions.")

if __name__ == "__main__":
    main()
