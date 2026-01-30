pipeline {
    agent any

    environment {
        IMAGE_NAME = "krishi2210/todo-app"
    }

    stages {

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Build Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME:latest .'
            }
        }

        stage('DockerHub Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                }
            }
        }

        stage('Push Image') {
            steps {
                sh 'docker push $IMAGE_NAME:latest'
            }
        }

        stage('Remove Local Image') {
            steps {
                sh 'docker rmi $IMAGE_NAME:latest || true'
            }
        }

        stage('Pull Image') {
            steps {
                sh 'docker pull $IMAGE_NAME:latest'
            }
        }
    }
}
