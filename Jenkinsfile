pipeline {
  agent any

  stages {

    stage('Checkout Code') {
      steps {
        git branch: 'main',
            url: 'git@github.com:mohitjangra876/E-Commerce_Website.git'
      }
    }

    stage('Build & Deploy') {
      steps {
        sh '''
        docker compose down
        docker compose build
        docker compose up -d
        '''
      }
    }
  }
}
