# syntax=docker/dockerfile:1.4
# 全局配置
FROM registry.cn-beijing.aliyuncs.com/zaoqiganfan/ganfan-web-base:0.0.3

ADD package.json /ganfan-web/package.json
ADD package-lock.json /ganfan-web/package-lock.json

WORKDIR /ganfan-web
RUN npm install

# 项目目录
ADD . /ganfan-web
# WORKDIR /ganfan-web

# 上传OSS的构建（ossutil 配置通过 BuildKit secret 传入，不写入镜像层）
# 构建命令：DOCKER_BUILDKIT=1 docker build --secret id=ossutilconfig,src=$HOME/.ossutilconfig .
RUN --mount=type=secret,id=ossutilconfig,target=/root/.ossutilconfig \
    CDN_ROOT="https://ganfan-tech.oss-cn-beijing.aliyuncs.com/web/game/main" \
    npm run build:prod && \
    ossutil64 cp -r dist oss://ganfan-tech/web/game/main/ --force && \
    ossutil64 cp dist/index.html oss://ganfan-tech/web-html/game/main/index.html --force && \
    curl -X POST -H "Refresh-OSS: immediately" https://game.ganfan.tech/html/refresh
