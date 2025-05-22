#!/bin/bash

# ACR配置
ACR_NAME="haxureg"
IMAGE_NAME="sk-docs-app"
TAG="v2"

# 登录到ACR
az acr login --name $ACR_NAME

# 构建镜像
docker build -t $IMAGE_NAME:$TAG .

# 标记镜像
docker tag $IMAGE_NAME:$TAG "$ACR_NAME.azurecr.io/$IMAGE_NAME:$TAG"

# 推送到ACR
docker push "$ACR_NAME.azurecr.io/$IMAGE_NAME:$TAG"
