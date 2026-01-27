pipeline {
    agent any

    stages {

        stage('stage One'){
            steps{
                echo "Hello From stage One "
                sh 'date'
            }
        }

        stage('stage Two'){
            steps{
                echo "Hello From Stage Two"
                sh 'Next stage is file '
            }
        }

        stage('stage Three'){
            steps{
                echo "exit 1"
                sh 'pwd'
            }
        }
    } 
}