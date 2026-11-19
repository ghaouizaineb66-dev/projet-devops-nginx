pipeline {
    agent any

    environment {
        IMAGE_NAME = 'projet-devops-nginx'
        DOCKERHUB_USER = 'zainebgh'
        KUBECONFIG = '/var/lib/jenkins/.kube/config'
    }
    stages {
        stage('Checkout') {
            steps {
                echo 'Recuperation du projet'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t zainebgh/projet-devops-nginx:$BUILD_NUMBER .'
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
                    docker push zainebgh/projet-devops-nginx:$BUILD_NUMBER
                    docker logout
                    '''
                 }
            }
        }
        stage('Deploy kubernetes') {
            steps {
                sh 'kubectl set image deployment/nginx-deployment nginx=zainebgh/projet-devops-nginx:$BUILD_NUMBER'
                sh 'kubectl rollout status deployment/nginx-deployment'
            }
        }
   }
}
