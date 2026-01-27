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
    } 
}