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

        stage('Check location'){
            steps{
                echo "my loction on logs "
                sh 'pwd'
                sh 'whoami'
                sh 'ls'
            }
        }

        stage('Deploy') {
            steps {
                sh """
                stage('Deploy') {
    steps {
        sh """
        ssh -i /var/jenkins_home/.ssh/id_rsa -o StrictHostKeyChecking=no ubuntu@34.240.97.104 "
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
        "
        """
    }
}

                """
            }
        }
    }
}
