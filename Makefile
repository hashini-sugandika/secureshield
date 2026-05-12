.PHONY: help up down test scan-secrets scan-code scan-image scan-dast deploy-local vault-setup

help:
	@echo "SecureShield DevSecOps Platform"
	@echo ""
	@echo "Commands:"
	@echo "  make up              Start all services locally"
	@echo "  make down            Stop all services"
	@echo "  make test            Run unit tests with coverage"
	@echo "  make scan-secrets    Run Gitleaks secret scan"
	@echo "  make scan-image      Run Trivy CVE scan"
	@echo "  make scan-dast       Run OWASP ZAP DAST scan"
	@echo "  make vault-setup     Configure Vault with app secrets"
	@echo "  make deploy-local    Deploy to local kind cluster"
	@echo "  make all-gates       Run all security gates locally"

up:
	docker compose up -d
	@echo "✅ Services started"
	@echo "   API:        http://localhost:3000"
	@echo "   SonarQube:  http://localhost:9000"
	@echo "   Vault:      http://localhost:8200"

down:
	docker compose down
	@echo "✅ Services stopped"

test:
	cd app && npm test

scan-secrets:
	@echo "🔍 Running Gitleaks secret scan..."
	gitleaks detect --source . --verbose
	@echo "✅ Secret scan complete"

scan-image:
	@echo "🔍 Running Trivy CVE scan..."
	trivy image --exit-code 1 --severity CRITICAL --ignore-unfixed secureshield-api:latest
	@echo "✅ Image scan complete"

scan-dast:
	@echo "🔍 Running OWASP ZAP DAST scan..."
	docker run --rm --network host \
		-v $(PWD)/zap/reports:/zap/reports:rw \
		ghcr.io/zaproxy/zaproxy:stable \
		zap-baseline.py -t http://localhost:3000 \
		-r zap-report.html -I
	@echo "✅ DAST scan complete — see zap/reports/zap-report.html"

vault-setup:
	@echo "🔐 Setting up Vault..."
	VAULT_ADDR=http://localhost:8200 VAULT_TOKEN=secureshield-root-token \
		vault secrets enable -path=secureshield kv-v2 || true
	VAULT_ADDR=http://localhost:8200 VAULT_TOKEN=secureshield-root-token \
		vault kv put secureshield/database host=postgres port=5432 name=secureshield username=appuser password=apppassword
	@echo "✅ Vault configured"

deploy-local:
	@echo "🚀 Deploying to kind cluster..."
	kubectl apply -f k8s/app/namespace.yaml
	kubectl apply -f k8s/app/deployment.yaml
	kubectl get pods -n secureshield
	@echo "✅ Deployed"

all-gates: scan-secrets test scan-image
	@echo ""
	@echo "✅ All local security gates passed"
	@echo "   Gate 1: Gitleaks ✅"
	@echo "   Gate 2: Tests + Coverage ✅"
	@echo "   Gate 3: Trivy ✅"
	@echo "   Run 'make scan-dast' for ZAP (requires running app)"
