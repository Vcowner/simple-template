# base image
FROM node:20.18.0 AS base

RUN npm config set registry https://registry.npmmirror.com/
RUN npm install -g pnpm@9.15.1
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"


# install packages
FROM base AS packages

WORKDIR /app/web

COPY package.json .
COPY pnpm-lock.yaml .

# if you located in China, you can use taobao registry to speed up
# RUN pnpm install --frozen-lockfile --registry https://registry.npmmirror.com/

# RUN pnpm install --frozen-lockfile --registry https://registry.npmmirror.com/
RUN pnpm install  --registry https://registry.npmmirror.com/

# build resources
FROM base AS builder
WORKDIR /app/web
COPY --from=packages /app/web/ .
COPY . .

# set timezone
ENV TZ=Asia/Shanghai
RUN rm -f /etc/localtime \
    && ln -s /usr/share/zoneinfo/${TZ} /etc/localtime \
    && echo ${TZ} > /etc/timezone

ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN pnpm build

FROM nginx:latest AS production

COPY --from=builder /app/web/dist /usr/share/nginx/html

EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]

