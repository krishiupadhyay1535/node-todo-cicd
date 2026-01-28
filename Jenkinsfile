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
                if pm2 list | grep -q ${APP_NAME}; then
                   pm2 restart ${APP_FILE}
                else 
                   pm2 start ${APP_FILE} --name ${APP_NAME}
                fi      
                '''
            }
        }
    }
}