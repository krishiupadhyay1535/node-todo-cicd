pipeline {
    agent any

    environment {
        IMAGE_NAME     = "krishi2210/todo-app"
        IMAGE_TAG      = "${BUILD_NUMBER}"
        CONTAINER_NAME = "todo-app"

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

        stage('Build Docker Image') {
            steps {
                sh '''
                  docker build -t $IMAGE_NAME:$IMAGE_TAG .
                  docker tag $IMAGE_NAME:$IMAGE_TAG $IMAGE_NAME:latest
                '''
            }
        }

        stage('Push Docker Image') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-creds',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )
                ]) {
                    sh '''
                      echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                      docker push $IMAGE_NAME:$IMAGE_TAG
                      docker push $IMAGE_NAME:latest
                    '''
                }
            }
        }

        stage('Deploy with Rollout & Rollback') {
            when {
                branch 'v1.1'
            }
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'gmail-smtp',
                        usernameVariable: 'SMTP_USER',
                        passwordVariable: 'SMTP_PASS'
                    )
                ]) {
                    sh '''
                      echo "Starting rollout deployment..."

                      docker run -d --name todo-app-new \
                        -e SMTP_USER=$SMTP_USER \
                        -e SMTP_PASS=$SMTP_PASS \
                        -e MAGIC_LINK_SECRET=$MAGIC_LINK_SECRET \
                        -p 8001:8000 \
                        $IMAGE_NAME:latest

                      sleep 10

                      echo "Verifying SMTP env inside container"
                      docker exec todo-app-new env | grep SMTP || true

                      echo "Running health check..."
                      if curl -f http://108.131.0.221:8001 > /dev/null; then
                          echo "Health check passed. Promoting container."

                          docker stop todo-app || true
                          docker rm todo-app || true

                          docker stop todo-app-new
                          docker rm todo-app-new

                          docker run -d --name todo-app \
                            -e SMTP_USER=$SMTP_USER \
                            -e SMTP_PASS=$SMTP_PASS \
                            -e MAGIC_LINK_SECRET=$MAGIC_LINK_SECRET \
                            -p 8000:8000 \
                            $IMAGE_NAME:latest
                      else
                          echo "Health check failed. Rolling back."
                          docker stop todo-app-new || true
                          docker rm todo-app-new || true
                          exit 1
                      fi
                    '''
                }
            }
        }
    }

    post {
        success {
            emailext(
                to: 'krishiupadhyay1535@gmail.com',
                subject: "✅ Jenkins SUCCESS: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """
Build Status: SUCCESS ✅

Job Name : ${env.JOB_NAME}
Build No : ${env.BUILD_NUMBER}

Deployment completed successfully.
New version is live.

Docker Image:
- ${env.IMAGE_NAME}:${env.BUILD_NUMBER}

Good job 🚀
"""
            )
        }

        failure {
            emailext(
                to: 'krishiupadhyay1535@gmail.com',
                subject: "❌ Jenkins FAILED: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """
Build Status: FAILED ❌

Job Name : ${env.JOB_NAME}
Build No : ${env.BUILD_NUMBER}

Pipeline failed.
Rollback executed if deployment started.

Please check Jenkins console logs.

– Jenkins
"""
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
