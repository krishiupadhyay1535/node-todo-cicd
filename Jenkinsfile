pipeline {
    agent any

    stages {

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
        }

        stage('Deploy (PM2)') {
            steps {
                sh '''
                  pm2 delete node-app || true
                  pm2 start app.js --name node-app
                '''
            }
        }
    }
}
