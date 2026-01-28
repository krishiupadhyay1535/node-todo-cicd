pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Deploy') {
            steps {
                sh """
                ssh -i /var/jenkins_home/.ssh/id_rsa -o StrictHostKeyChecking=no ubuntu@34.240.97.104 "
                    cd ~/node-todo-cicd &&
                    npm install &&
                    if pm2 list | grep -q node-todo-app; then
                        pm2 restart node-todo-app
                    else
                        pm2 start app.js --name node-todo-app
                    fi
                "
                """
            }
        }
    }
}
