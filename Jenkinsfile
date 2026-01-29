pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                echo "Clone Repo"
                checkout scm
            }
        }

        stage('Deploy docker image') {
            steps {
                echo "Installing npm dependencies"
                sh '''
                docker build -t krishi2210/todo-app:latest .
                '''
            }
        }

        stage('Deploy Container') {
            steps {
                echo "Container Will Run Here"
                sh '''
                    docker stop todo-container || true 
                    docker rm todo-container || true 

                    docker run -d \
                    -p 8000:8000 \
                        --name todo-container \
                        krishi2210/todo-container:app-latest
                '''
            }
        } 
    }
}