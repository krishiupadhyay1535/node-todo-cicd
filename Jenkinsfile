pipeline {
    agent any

    environment {
        IMAGE_NAME = "krishi2210/todo-app"
        IMAGE_TAG  = "${BUILD_NUMBER}"
        CONTAINER_NAME = "todo-app"

        SMTP_CREDS = credentials('gmail-smtp')
        MAGIC_LINK_SECRET = credentials('magic-secret')
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
            when {
                branch 'test'
            }
            steps {
                sh '''
                    docker run -d --name todo-app-new \
                    -e SMTP_USER=$SMTP_CREDS_USR \
                    -e SMTP_PASS=$SMTP_CREDS_PSW \
                    -e MAGIC_LINK_SECRET=$MAGIC_LINK_SECRET \
                    -p 8001:8000 \
                    $IMAGE_NAME:latest


                sleep 10

                if curl -f http://108.131.0.221:8001 > /dev/null; then
                    docker stop todo-app || true
                    docker rm todo-app || true

                    docker stop todo-app-new
                    docker rm todo-app-new

                    docker run -d --name todo-app \
                    docker run -d --name todo-app-new \
                    -e SMTP_USER=$SMTP_CREDS_USR \
                    -e SMTP_PASS=$SMTP_CREDS_PSW \
                    -e MAGIC_LINK_SECRET=$MAGIC_LINK_SECRET \
                    -p 8001:8000 \
                    $IMAGE_NAME:latest
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
        success {
            emailext(
                to: 'krishiupadhyay2@gmail.com',
                subject: "✅ Jenkins SUCCESS: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """
Build Status: SUCCESS ✅

Job Name   : ${env.JOB_NAME}
Build No   : ${env.BUILD_NUMBER}

Deployment completed successfully.
New version is live in production.

Docker Image:
- ${env.IMAGE_NAME}:${env.BUILD_NUMBER}

Thank You
"""
            )
        }

        failure {
            emailext(
                to: 'krishiupadhyay2@gmail.com',
                subject: "❌ Jenkins FAILED: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: '''
Build Status: FAILED ❌

Job Name   : ${JOB_NAME}
Build No   : ${BUILD_NUMBER}

Failure occurred during pipeline execution.
If deployment started, rollback was triggered automatically.

Last 50 lines of console output:
--------------------------------
${BUILD_LOG, maxLines=50}
--------------------------------

Please check Jenkins for full logs.
'''
            )
        }
    }
}



//     post {
//         failure {
//             mail to: 'krishiupadhyay2@gmail.com',
//                  subject: "❌ Jenkins Pipeline FAILED",
//                  body: "Rollback triggered. Old version kept running."
//         }
//     }
// }
