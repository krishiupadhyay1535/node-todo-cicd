# node-todo-cicd

Run these commands:


`sudo apt install nodejs`


`sudo apt install npm`


`npm install`

`node app.js`

or Run by docker compose

test


#  1.(auto deploy)

#on:
  #workflow_dispatch:

on:
  push:
    branches:
      - master

#  1.(Trigger it manually)

on:
  workflow_dispatch:

#on:
  #push:
    #branches:
      #- master