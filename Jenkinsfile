pipeline {
    agent any

    stages {

        stage('Clone Repo') {
            steps {
                git 'git@github.com:krishiupadhyay1535/node-todo-cicd.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test || true'
            }
        }

        stage('Start App') {
            steps {
                sh 'pm2 restart todo-app || pm2 start app.js --name todo-app'
            }
        }
    }
}
