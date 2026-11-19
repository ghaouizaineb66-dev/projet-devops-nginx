pipeline {
    agent any

    environment {
        IMAGE_NAME = 'projet-devops-nginx'
        DOCKERHUB_USER = 'zainebgh'
    }
    stages {
        stage('Checkout') {
            steps {
                echo 'Recuperation du projet'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $DOCKERHUB-USER/$IMAGES_NAME:$BUILD_NUMBER .'
            }
        }
        stage('Push Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                    echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                    docker push $DOCKERHUB_USER/$IMAGE_NAME:$BUILD_NUMBER
                    docker logout
                    '''
                 }
            }
        }
        stage('Deploy kubernetes') {
            steps {
                sh 'kubectl set image deployment/nginx-deployment nginx=$DOCKERHUB_USER/$IMAGE_NAME:$BUILD_NUMBER'
                sh 'kubectl rollout status deployment/nginx-deployment'
            }
        }
   }
}
