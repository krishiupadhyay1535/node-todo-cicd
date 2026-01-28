pipeline{
    agent any

    environment {
        APP_NAME = "node-todo-app"
        APP_FILE = "app.js"
    }

    stages {

        stage ('Checkout code'){
            steps {
                    checkout scm 
            }
        }

        stage ('Install Dependencies'){
            steps {
                sh 'npm install'
            }
        }

        stage ('Start app with pm2'){
            steps {
                sh '''
                ssh -o StrictHostKeyChecking=no ubuntu@localhost "
                  cd ~/node-todo-cicd &&
                  npm install &&
                  if pm2 list | grep -q node-todo-app; then 
                  pm2 restart node-todo-app 
                  else 
                    pm2 start app.js --name node-todo-app
                    fi

                    "
                '''
            }
        }
    }
}