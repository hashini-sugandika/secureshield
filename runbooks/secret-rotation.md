# Runbook: Secret Rotation in Vault

## Trigger
A secret is suspected to be compromised, or routine rotation is due.

## Steps
1. Generate new secret value
2. Update in Vault: `vault kv put secureshield/database password=NEW_PASSWORD`
3. Rolling restart of pods to pick up new secret
4. Verify app is healthy: `kubectl get pods -n secureshield`
5. Revoke old token if applicable

## Commands
```bash
export VAULT_ADDR=http://localhost:8200
export VAULT_TOKEN=secureshield-root-token

# Rotate DB password
vault kv put secureshield/database \
  host=postgres port=5432 name=secureshield \
  username=appuser password=NEW_PASSWORD

# Rolling restart
kubectl rollout restart deployment/secureshield-api -n secureshield
kubectl rollout status deployment/secureshield-api -n secureshield
```
