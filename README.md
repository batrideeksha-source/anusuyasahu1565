# Anusuya Sahu Official Website

Static author website + browser-based GitHub CMS.

## Deploy
1. Create a GitHub repository and upload the complete contents of this folder to the repository root.
2. In GitHub: Settings → Pages → Deploy from a branch → `main` / root.
3. Open `/admin/` on the deployed website.
4. Create a **fine-grained GitHub Personal Access Token** restricted to this repository with **Contents: Read and write** permission.
5. Enter repository owner, repository name, branch, and PAT in the admin dashboard.
6. Add/edit content. The dashboard writes JSON/images using the GitHub Contents REST API. GitHub Pages then redeploys.

## Security
GitHub Pages is static. The PAT cannot be protected like a server-side secret when it is used by browser JavaScript. This build defaults to sessionStorage. "Remember token" uses localStorage and should only be used on a trusted device. Use a fine-grained token restricted to this repository and revoke/rotate it if compromised.

## Content
Initial biography/poetry is deliberately placeholder text. Replace it with verified information in Admin.

## Contact form
A static host cannot send email itself. Configure Formspree/Web3Forms/serverless endpoint if a real contact form is required.

## Local testing
Because JSON is loaded with fetch(), don't open files using file://. Run a local HTTP server, e.g. `python -m http.server 8000`, then open http://localhost:8000/.
