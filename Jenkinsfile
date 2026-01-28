pipeline{
    agent any

    stages {
        stage('fisrt stage'){
            steps {
                echo "hello from first stage "
                sh 'pwd'
            }
        }

        stage ('second stage'){
            steps {
                echo "hii from second stage "
                sh 'ls'
            }
        }

        stage('last stage'){
            steps{
                echo "last stage say hii"
                sh 'df -h'
            }
        }
    }
}