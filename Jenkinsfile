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
                sh 'abcdefg'
            }
        }

        stage('stage Three'){
            steps{
                echo "Hello From Stage Three"
                sh 'pwd'
            }
        }
    } 
}