## 1. Infra Domain Spec

- [x] 1.1 Create `packages/openspec/specs/infra/spec.md` with full spec content (Purpose, Requirements, Entities, Dependencies)
- [x] 1.2 Verify spec follows existing format by comparing with `integrations/spec.md`

## 2. WhatsApp Agent Domain Spec

- [x] 2.1 Create `packages/openspec/specs/whatsapp-agent/spec.md` with full spec content (Purpose, Requirements, Entities, Dependencies)
- [x] 2.2 Verify spec follows existing format by comparing with `integrations/spec.md`

## 3. Config Update

- [x] 3.1 Add `infra` and `whatsapp-agent` to the domains list in `packages/openspec/config.yaml` with one-line descriptions

## 4. Validation

- [x] 4.1 Run `openspec status` to verify specs are recognized
- [x] 4.2 Run `pnpm lint` to ensure no formatting issues
