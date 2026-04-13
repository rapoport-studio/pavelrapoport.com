## Why

The studio runs on Cloudflare infrastructure and communicates with clients via WhatsApp, but neither system is documented. When something breaks — secrets lost after deploy, n8n expressions not resolving — the fix lives in someone's head, not in a spec. These two domain specs capture operational knowledge so any agent (human or AI) can diagnose and maintain these systems.

## What Changes

- Add `infra` domain spec documenting Cloudflare account topology, Workers, KV, DNS, secrets pipeline, CI/CD, and known operational issues
- Add `whatsapp-agent` domain spec documenting the WhatsApp → n8n → studio → Claude → Linear → WhatsApp reply pipeline, Meta Business config, agent behavior, and known integration quirks

## Capabilities

### New Capabilities
- `infra`: Cloudflare infrastructure — account, Workers, KV, DNS, secrets pipeline, CI/CD, API token permissions, known operational issues
- `whatsapp-agent`: WhatsApp agent pipeline — Meta Cloud API, n8n workflow, studio endpoint, Claude integration, Linear task creation, agent personality and constraints

### Modified Capabilities

None — these are net-new domain specs with no changes to existing capabilities.

## Impact

- `packages/openspec/specs/infra/spec.md` — new file
- `packages/openspec/specs/whatsapp-agent/spec.md` — new file
- `packages/openspec/config.yaml` — may need `infra` and `whatsapp-agent` added to domains list
- No code changes — these are documentation/spec-only additions
