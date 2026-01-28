pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                echo "Clone Repo"
                checkout scm
            }
        }

        stage('Install Dependencies (Jenkins Workspace)') {
            steps {
                echo "Installing npm dependencies"
                sh 'npm install || true'
            }
        }

        stage('Deploy Views Only to EC2') {
            steps {
                echo "Deploying ONLY views folder to EC2..."

                sh """
                rsync -avz --delete \
                -e "ssh -i /var/jenkins_home/.ssh/id_rsa -o StrictHostKeyChecking=no" \
                views/ ubuntu@34.240.97.104:/home/ubuntu/node-todo-cicd/views/

                ssh -i /var/jenkins_home/.ssh/id_rsa -o StrictHostKeyChecking=no ubuntu@34.240.97.104 '
                    pm2 restart node-todo-app
                '
                """
            }
        }
    }
}
