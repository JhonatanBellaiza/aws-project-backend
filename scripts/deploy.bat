@echo off
setlocal

set ENV=%1
set BUCKET=%2

if "%BUCKET%"=="" (
  echo Usage: deploy.bat [env] [bucket]
  exit /b 1
)

call scripts\package-lambda.bat %ENV%

echo Uploading packages to S3...
aws s3 sync dist\%ENV%\ s3://%BUCKET%/backend/%ENV%/

echo Deploying CloudFormation stack...
aws cloudformation deploy ^
  --template-file template.yml ^
  --stack-name ecommerce-%ENV% ^
  --parameter-overrides ^
      EnvType=%ENV% ^
      LambdaDeploymentBucket=%BUCKET% ^
  --capabilities CAPABILITY_IAM

echo Deployment complete!
endlocal