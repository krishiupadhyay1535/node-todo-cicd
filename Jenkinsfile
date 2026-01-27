pipeline {
    agent any

    stages {

        stage('checkout code'){
            steps {
                checkout scm
            }
        }

        stage('install Dependencies'){
            steps {
                sh 'npm install'
            }
        }

        stage('Run Test'){
            steps {
                sh 'npm test'
            }
        }

        stage('deploy (pm2)'){
            steps {
                sh '''
                pm2 restart todo-app || \
                pm2 start app.js --name todo-app
                '''
            }
        }
    } 
}