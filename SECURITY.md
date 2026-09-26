# Public-link security

The public ACNOCTEM site must not embed private Telegram invite links.

Rules:
- Public HTML / JSON-LD may reference only public handles or backend-controlled public routes.
- Private membership invite links are issued dynamically by the backend after deterministic
  entitlement checks and must be short-lived/revocable.
- Historical private invite URLs found in Git history/provider state require provider-side
  revocation/reissue; deleting the current HTML does not invalidate an already-issued invite.
- Do not commit Telegram bot tokens, private invite URLs, payment credentials or customer data.
