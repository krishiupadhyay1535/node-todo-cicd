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

        stage('Debug') {
    steps {
        sh '''
        pwd
        ls -la
        '''
    }
}


        stage('Run Tests') {
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

    //     stage('Deploy Container (CD)') {
    //         steps {
    //             sh '''
    //             docker stop $CONTAINER_NAME || true
    //             docker rm $CONTAINER_NAME || true

    //             docker run -d \
    //               -p 8000:8000 \
    //               --name $CONTAINER_NAME \
    //               $IMAGE_NAME:latest
    //             '''
    //         }
    //     }
    // }


    stage('Deploy with Rollout & Rollback') {
    steps {
        sh '''
        echo "Starting rollout deployment..."

        # Run new container on SAME PORT but different name
        docker run -d \
          --name todo-app-new \
          -p 8001:8000 \
          $IMAGE_NAME:latest

        echo "Waiting for app to start..."
        sleep 10

        echo "Health check..."
        if curl -f http://localhost:8001 > /dev/null; then
            echo "New version is healthy ✅"

            echo "Stopping old container..."
            docker stop todo-app || true
            docker rm todo-app || true

            echo "Switching traffic to new container..."
            docker stop todo-app-new
            docker rm todo-app-new

            docker run -d \
              --name todo-app \
              -p 8000:8000 \
              $IMAGE_NAME:latest

            echo "Deployment successful 🚀"

        else
            echo "Health check failed ❌"
            echo "Rollback initiated..."

            docker stop todo-app-new || true
            docker rm todo-app-new || true

            echo "Old container kept running ✅"
            exit 1
        fi
        '''
    }
}


    post {
        failure {
            emailext(
                to: 'ishumakhiyaviya306@gmail.com',
                subject: "❌ Jenkins FAILED: ${JOB_NAME} #${BUILD_NUMBER}",
                body: """
Hello Sir,

Pipeline FAILED ❌

Job Name : ${JOB_NAME}
Build No : ${BUILD_NUMBER}
Status   : FAILED

Reason:
- npm test failed OR build error
- Old container is still running safely

Regards,
Jenkins
"""
            )
        }

        success {
            emailext(
                to: 'ishumakhiyaviya306@gmail.com',
                subject: "✅ Jenkins SUCCESS: ${JOB_NAME} #${BUILD_NUMBER}",
                body: """
Hello Sir,

Pipeline SUCCESS ✅

Job Name : ${JOB_NAME}
Build No : ${BUILD_NUMBER}
Status   : SUCCESS

Application deployed successfully.

Regards,
Jenkins
"""
            )
        }
    }
}
