// ***********************************************
// ***************** 배포 환경 설정 ***************
// ***********************************************
def deploy_shell = "/home/jenkins/deploy.sh" // 배포 환경 설정 파일 경로
def work_shell = "/home/jenkins/restart.sh" // 배포 후속 작업 파일 경로
def deploy_user = "appuser" // appuser 고정
def deploy_target = "10.71.101.155" // 목적지 ip 서버
def rsync_label = "PUBLISH" // 목적지 서버에서 적용된 rsync 라벨 
def default_path = "/data1/publish" // rsync 기본 경로
def base_service_dir = "template_admin"

pipeline {
    agent any

    environment {
        BRANCH = "${env.BRANCH_NAME}"
    }

    stages {

        stage('Set Service Dir') {
            steps {
                script {
                    def branchRaw = env.GIT_BRANCH ?: 'origin/main'
                    def branchName = branchRaw.replace('origin/', '')

                    service_dir = (branchName == 'main')
                        ? base_service_dir
                        : "${base_service_dir}_${branchName}"

                    echo "▶ Deploy Path: ${default_path}/${service_dir}"
                }
            }
        }

        // ✅ Vue Build 추가
        stage('Build') {
            steps {
                echo '=== Vue Build 시작 ==='
                sh 'npm install'
                sh 'npm run build'
                echo '=== dist 생성 완료 ==='
            }
        }

    

        // ✅ dist만 압축 (핵심)
        stage ('Prepare Package') {
            steps {
                echo '=== dist 파일만 압축 ==='
                sh 'tar -cf ROOT.tar -C dist .'
                echo '=== ROOT.tar 생성 완료 ==='
            }
        }

        stage ('Transfer to Server') {
            steps {
                echo '=== ROOT.tar 서버 전송 ==='
                sh "${deploy_shell} ROOT.tar ${deploy_target} ${rsync_label}"
                echo '=== 전송 완료 ==='
            }
        }

        stage ('Extract and Deploy') {
            steps {
                echo '=== 서버 배포 시작 ==='
                sh """
                ${work_shell} ${deploy_user} ${deploy_target} "mkdir -p ${default_path}/${service_dir}"
                ${work_shell} ${deploy_user} ${deploy_target} "cd ${default_path}/${service_dir} && rm -rf *"
                ${work_shell} ${deploy_user} ${deploy_target} "mv ${default_path}/ROOT.tar ${default_path}/${service_dir}/"
                ${work_shell} ${deploy_user} ${deploy_target} "cd ${default_path}/${service_dir} && tar -xvf ROOT.tar && rm -f ROOT.tar"
                """
                echo '=== 배포 완료 ==='
            }
        }
    }
}