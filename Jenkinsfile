pipeline {
  agent any

  environment {
    BACKEND_HEALTH_URL = 'http://localhost:5000/api/health'
    FRONTEND_URL = 'http://localhost:5173'
  }

  stages {
    stage('Checkout') {
      steps {
        echo 'Kod deposu alınıyor...'
        checkout scm
      }
    }

    stage('Docker Version Check') {
      steps {
        echo 'Docker ve Docker Compose sürümleri kontrol ediliyor...'
        sh 'docker --version'
        sh 'docker compose version'
      }
    }

        stage('Clean Previous Docker Compose Run') {
      steps {
        echo 'Önceki Docker Compose containerları temizleniyor...'
        sh 'docker compose -f docker-compose.yml down --remove-orphans || true'
        sh 'docker rm -f baristaone-backend baristaone-frontend baristaone-worker baristaone-redis baristaone-rabbitmq || true'
      }
    }

    stage('Compose Config Validate') {
      steps {
        echo 'docker-compose.yml doğrulanıyor...'
        sh 'docker compose -f docker-compose.yml config'
      }
    }

    stage('Build Docker Images') {
      steps {
        echo 'Backend, frontend, worker image build işlemi başlıyor...'
        sh 'docker compose -f docker-compose.yml build'
      }
    }

    stage('Deploy With Docker Compose') {
      steps {
        echo 'BaristaOne servisleri Docker Compose ile başlatılıyor...'
        sh 'docker compose -f docker-compose.yml up -d'
      }
    }

    stage('Wait For Services') {
      steps {
        echo 'Servislerin ayağa kalkması bekleniyor...'
        sh 'sleep 25'
      }
    }

    stage('Backend Health Check') {
      steps {
        echo 'Backend health endpoint kontrol ediliyor...'
        sh '''
          curl -f $BACKEND_HEALTH_URL
        '''
      }
    }

    stage('Frontend Check') {
      steps {
        echo 'Frontend erişim kontrolü yapılıyor...'
        sh '''
          curl -I -f $FRONTEND_URL
        '''
      }
    }

    stage('Show Running Containers') {
      steps {
        echo 'Çalışan containerlar listeleniyor...'
        sh 'docker compose -f docker-compose.yml ps'
      }
    }
  }

  post {
    success {
      echo 'Pipeline başarılı: BaristaOne Docker üzerinde çalışıyor.'
    }

    failure {
      echo 'Pipeline başarısız: Logları kontrol et.'
      sh 'docker compose -f docker-compose.yml logs --tail=100 || true'
    }

    always {
      echo 'Pipeline tamamlandı.'
    }
  }
}