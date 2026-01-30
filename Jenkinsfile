pipeline {
    agent any

    environment {

        IMAGE_NAME = "krishi2210/todo-app"
        CONTAINER_NAME = "todo-app"
    }

    stages {

        stage('Checkout') {
            steps {
                echo "Clone Repo"
                checkout scm
            }
        }

        stage('Deploy docker image') {
            steps {
                echo "Docker Build "
                sh '''
                docker build -t $IMAGE_NAME:latest .
                '''
            }
        }

        stage('Deploy Container') {
            steps {
                echo "Container Will Run Here"
                sh '''
                    docker stop $CONTAINER_NAME || true 
                    docker rm $CONTAINER_NAME || true 

                    docker run -d \
                    -p 8000:8000 \
                        --name CONTAINER_NAME \
                        $IMAGE_NAME:latest
                '''
            }
        } 
    }
}