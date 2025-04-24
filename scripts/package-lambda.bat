@echo off
setlocal enabledelayedexpansion

set ENV=%1
if "%ENV%"=="" set ENV=dev

set LAMBDA_SOURCE_DIR=src
set DIST_DIR=dist\%ENV%

echo Packaging lambdas for environment: %ENV%
rmdir /s /q %DIST_DIR% 2>nul
mkdir %DIST_DIR%

for %%d in (auth products orders) do (
  echo Packaging %%d lambda...
  cd %LAMBDA_SOURCE_DIR%\%%d
  call npm install --production
  cd ..\..
  powershell Compress-Archive -Path %LAMBDA_SOURCE_DIR%\%%d\* -DestinationPath %DIST_DIR%\%%d.zip -Force
)

echo Lambda packaging complete. Files saved to %DIST_DIR%
endlocal