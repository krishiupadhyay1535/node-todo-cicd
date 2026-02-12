pipeline {
    agent any

    environment {
        IMAGE_NAME     = "krishi2210/todo-app"
        CONTAINER_NAME = "todo-app"
        IMAGE_TAG      = "${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Run Tests (CI)') {
            steps {
                sh '''
                echo "Running tests inside Node container..."
                docker run --rm \
                  -v $PWD:/app \
                  -w /app \
                  node:18 \
                  npm install && npm test
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                docker build -t $IMAGE_NAME:$IMAGE_TAG .
                docker tag $IMAGE_NAME:$IMAGE_TAG $IMAGE_NAME:latest
                '''
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
                sh '''
                docker push $IMAGE_NAME:$IMAGE_TAG
                docker push $IMAGE_NAME:latest
                '''
            }
        }

        stage('Deploy Container (CD)') {
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

    post {
        failure {
            mail to: 'krishiupadhyay2@gmail.com',
                 subject: "❌ Jenkins Pipeline FAILED: ${JOB_NAME}",
                 body: """
                 Hello Sir,

                 The CI/CD pipeline has FAILED.

                 Job Name   : ${JOB_NAME}
                 Build No   : ${BUILD_NUMBER}
                 Status     : FAILED

                 Deployment was stopped to protect the running container.

                 Regards,
                 Jenkins
                 """
        }

        success {
            mail to: 'krishiupadhyay2@gmail.com',
                 subject: "✅ Jenkins Pipeline SUCCESS: ${JOB_NAME}",
                 body: """
                 Hello Sir,

                 The CI/CD pipeline completed successfully.

                 Job Name   : ${JOB_NAME}
                 Build No   : ${BUILD_NUMBER}
                 Status     : SUCCESS

                 Application deployed successfully.

                 Regards,
                 Jenkins
                 """
        }
    }
}
