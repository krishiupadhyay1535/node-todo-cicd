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

        stage('Debug Workspace') {
    steps {
        sh '''
        echo "PWD is:"
        pwd

        echo "Listing files:"
        ls -la
        '''
    }
}


        stage('Install Dependencies & Run Tests (CI)') {
    steps {
        sh '''
        node -v
        npm -v
        npm install
        npm test
        '''
    }
}



        // stage('Install Dependencies & Run Tests (CI)') {
        //     steps {
        //         sh '''
        //         echo "Running npm install & npm test..."
        //         npm install
        //         npm test
        //         '''
        //     }
        // }

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
