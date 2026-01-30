pipeline {
    agent any

    environment {
        IMAGE_NAME = "krishi2210/todo-app"
        CONTAINER_NAME = "todo-app"
        REPO_URL = "https://github.com/krishiupadhyay1535/node-todo-cicd.git"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git url: "$REPO_URL", branch: "master"
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME:latest .'
            }
        }

        stage('Run Container') {
            steps {
                sh '''
                docker stop $CONTAINER_NAME || true
                docker rm $CONTAINER_NAME || true

                docker run -d \
                -p 8000:8000 \
                --name $CONTAINER_NAME \
                $IMAGE_NAME:latest
                '''
            }
        }
    }
}
