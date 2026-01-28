pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                echo "Cloning repository from GitHub..."
                checkout scm
            }
        }

        stage('Install Dependencies (Jenkins)') {
            steps {
                echo "Installing dependencies in Jenkins workspace..."
                sh 'npm install || true'
            }
        }

        stage('Deploy to EC2') {
            steps {
                echo "Deploying application to EC2 server..."

                sh """
                ssh -i /var/jenkins_home/.ssh/id_rsa -o StrictHostKeyChecking=no ubuntu@34.240.97.104 '
                    if [ ! -d ~/node-todo-cicd ]; then
                        git clone https://github.com/krishiupadhyay1535/node-todo-cicd.git ~/node-todo-cicd
                    fi

                    cd ~/node-todo-cicd &&
                    git pull origin master &&
                    npm install &&
                    if pm2 list | grep -q node-todo-app; then
                        pm2 restart node-todo-app
                    else
                        pm2 start app.js --name node-todo-app
                    fi
                '
                """
            }
        }
    }
}
