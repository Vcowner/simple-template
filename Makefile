# =============================================================================
# Docker 镜像构建和推送 Makefile
# 用于自动化前端项目的 Docker 镜像构建、标记和推送到 Harbor 私有仓库
# =============================================================================

# Docker 镜像仓库配置
DOCKER_REGISTRY := harbor.base.motanni.com:5000/template
UI_IMAGE := $(DOCKER_REGISTRY)/frontend
VERSION ?= dev-v1.0.0
PLATFORM := linux/amd64

# =============================================================================
# 构建 Docker 镜像
# 功能：构建前端应用的 Docker 镜像并创建版本标签和测试标签
# =============================================================================
build-ui:
	@echo "Building web Docker image: $(UI_IMAGE):$(VERSION)..."
	
	# 构建镜像并打版本标签
	docker build -t $(UI_IMAGE):$(VERSION) ./ --platform $(PLATFORM) 
	
	# 创建 dev 标签用于开发环境
	docker tag $(UI_IMAGE):$(VERSION) $(UI_IMAGE):dev-v1.0.0               
	@echo "Web Docker image built successfully: $(UI_IMAGE):$(VERSION)"

# =============================================================================
# 推送 Docker 镜像到仓库
# 功能：将构建好的镜像推送到 Harbor 私有仓库
# =============================================================================
push-ui:
	@echo "Pushing web Docker image: $(UI_IMAGE):$(VERSION)..."
	docker push $(UI_IMAGE):$(VERSION)
	docker push $(UI_IMAGE):dev-v1.0.0    
	@echo "Web Docker image pushed successfully: $(UI_IMAGE):$(VERSION)"

# =============================================================================
# 构建并推送镜像（完整 CI/CD 流程）
# 功能：依次执行构建和推送操作，完成整个部署流程
# =============================================================================
build-push-ui: build-ui push-ui
	@echo "Web Docker image built and pushed successfully: $(UI_IMAGE):$(VERSION)"

# =============================================================================
# 使用说明：
# make build-ui          - 仅构建镜像
# make push-ui           - 仅推送镜像
# make build-push-ui     - 构建并推送镜像
# make build-push-ui VERSION=2.0.0  - 指定版本号构建并推送
# =============================================================================

