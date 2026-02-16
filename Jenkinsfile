pipeline {
    agent any

    environment {
        IMAGE_NAME = "krishi2210/todo-app"
        IMAGE_TAG  = "${BUILD_NUMBER}"
        CONTAINER_NAME = "todo-app"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install & Test') {
            steps {
                sh '''
                npm install
                npm test
                '''
            }
        }

        stage('Build Image') {
            steps {
                sh '''
                docker build -t $IMAGE_NAME:$IMAGE_TAG .
                docker tag $IMAGE_NAME:$IMAGE_TAG $IMAGE_NAME:latest
                '''
            }
        }

        stage('Push Image') {
            steps {
                sh '''
                docker push $IMAGE_NAME:$IMAGE_TAG
                docker push $IMAGE_NAME:latest
                '''
            }
        }

        stage('Deploy with Rollout & Rollback') {
            steps {
                sh '''
                docker run -d --name todo-app-new -p 8001:8000 $IMAGE_NAME:latest
                sleep 10

                if curl -f http://108.129.208.156:8001 > /dev/null; then
                    docker stop todo-app || true
                    docker rm todo-app || true

                    docker stop todo-app-new
                    docker rm todo-app-new

                    docker run -d --name todo-app -p 8000:8000 $IMAGE_NAME:latest
                else
                    docker stop todo-app-new || true
                    docker rm todo-app-new || true
                    exit 1
                fi
                '''
            }
        }
    }

    post {
        failure {
            mail to: 'krishiupadhyay2@gmail.com',
                 subject: "❌ Jenkins Pipeline FAILED",
                 body: "Rollback triggered. Old version kept running."
        }
    }
}
