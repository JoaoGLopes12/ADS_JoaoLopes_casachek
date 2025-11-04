#!/usr/bin/env bash
# Versão simples para inicializar git, commitar e push para o remote fornecido.
# Ajuste REMOTE_URL ou passe como argumento: ./git-push-to-remote.sh <remote-url> <branch>

set -e

REMOTE_URL="${1:-https://github.com/JoaoGLopes12/ADS_JoaoLopes_casachek.git}"
BRANCH="${2:-import-local-code}"

# Inicializa git se necessário
if [ ! -d ".git" ]; then
  git init
fi

# Configura branch principal local (não força nada remoto)
git checkout -B "$BRANCH"

# Adiciona todos os arquivos e comita
git add --all
git commit -m "Import: adição do código local" || echo "Nada para commitar"

# Adiciona remote (substitui se já existir)
if git remote | grep -q "^origin$"; then
  git remote remove origin
fi
git remote add origin "$REMOTE_URL"

# Faz push da branch de importação (não mexe em branches remotas main/master)
git push -u origin "$BRANCH"

echo "Feito. Branch '$BRANCH' enviada para $REMOTE_URL. Crie um PR no GitHub para mesclar se desejar."