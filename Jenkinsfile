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
                echo "Next stage is file"
                sh 'pm2 ls'
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