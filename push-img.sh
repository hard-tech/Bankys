#!/bin/bash

# Définir la version
VERSION=$(git describe --tags --always)

# Activer Buildx si ce n'est pas déjà fait
docker buildx create --use 2>/dev/null || echo "Buildx déjà activé"

# Login au registry GitLab
echo "glpat-rsCL_t8n3bD9ss1nuM_Y" | docker login registry.gitlab.com -u hard-tech --password-stdin

# Définir les plateformes cibles
PLATFORMS="linux/amd64,linux/arm64"

# Build et push frontend
docker buildx build --platform $PLATFORMS \
  -t registry.gitlab.com/hard-tech/bankys/frontend:$VERSION \
  -t registry.gitlab.com/hard-tech/bankys/frontend:latest \
  -f frontend/Dockerfile . --push

# Build et push backend
docker buildx build --platform $PLATFORMS \
  -t registry.gitlab.com/hard-tech/bankys/backend:$VERSION \
  -t registry.gitlab.com/hard-tech/bankys/backend:latest \
  -f backend/Dockerfile . --push