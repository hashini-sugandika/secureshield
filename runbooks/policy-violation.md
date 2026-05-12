# Runbook: OPA Policy Violation Response

## Trigger
A deployment is rejected by OPA Gatekeeper.

## Steps
1. Read the violation message carefully — it tells you exactly what failed
2. Fix the manifest to comply with the policy
3. Common fixes:
   - Add `securityContext.runAsNonRoot: true`
   - Add `resources.limits.cpu` and `resources.limits.memory`
   - Add `readinessProbe`
   - Use image from `ghcr.io/hashini-sugandika/`
4. Re-apply the manifest

## Commands
```bash
# See all current violations
kubectl get constraints

# Describe a specific constraint
kubectl describe norootcontainer no-root-container

# Check audit violations
kubectl get norootcontainer no-root-container -o yaml
```
