# CareLog — Supabase Email Templates

## How to install

1. Go to your Supabase Dashboard → **Authentication** → **Email Templates**
2. Select the template type (Confirm signup, Reset password, etc.)
3. Copy the HTML from the corresponding file below
4. Paste into the "Body" field in Supabase
5. Set the Subject line as noted below

## Templates

### signup-confirmation.html
**Type:** Confirm signup
**Subject:** `Welcome to CareLog — confirm your account`

### password-reset.html
**Type:** Reset password
**Subject:** `Reset your CareLog password`

## Available variables (Supabase)
- `{{ .ConfirmationURL }}` — full confirmation/reset URL
- `{{ .Token }}` — raw token
- `{{ .TokenHash }}` — hashed token
- `{{ .SiteURL }}` — your app's base URL
- `{{ .Email }}` — user's email address
- `{{ .Data }}` — metadata (e.g., `{{ .Data.first_name }}`)
- `{{ .RedirectTo }}` — redirect URL after action

## Brand colors used
- Background: `#070E17` (outer), `#0B1622` (card)
- Primary CTA: `#00D4AA` (teal)
- Secondary stat: `#FF9F1C` (orange)
- Success stat: `#4CAF50` (green)
- Primary text: `#FFFFFF`
- Secondary text: `#8BA3BE`
- Muted text: `#5A7A9A`
