# stellar-fighter
## Development guide for Windows
- Install git (https://git-scm.com/)
- Install nodejs (https://nodejs.org/)
- Open git bash
- git clone -b dev https://github.com/stellar-fighter/stellar-fighter
- cd stellar-fighter
- npm install --development
- After setup:
   - Write some code with nano or vim command
   - npm start
   - Open http://localhost:8080 in your browser
   
## Using VS Code instead of Vim or Nano
- Install VS Code (https://code.visualstudio.com/download)
- Install 'Terminal Here' plugin (https://marketplace.visualstudio.com/items?itemName=Tyriar.vscode-terminal-here)
- File -> Open Folder
- File -> Save Workspace As
- File -> Open Workspace later

## How to send a pull request
Please create a new branch from dev branch
- Fork this repository
- git clone 'YOUR FORKED REPOSITORY'
- git checkout dev
- git checkout -b 'NEW BRANCH NAME'
- Make changes to the code
- git commit -m 'COMMIT MESSAGE'
- git push (git push -u origin 'NEW BRANCH NAME' for initial push)
- Click 'New pull request' from github.com
- Send pull request to https://github.com/stellar-fighter/stellar-fighter dev branch
- Delete forked respository
- For more information: https://help.github.com/en/articles/creating-a-pull-request-from-a-fork


