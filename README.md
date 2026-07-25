# Anusuya Sahu website package

This package gives you:

1. A GitHub Pages-ready public website.
2. A separate event data layer.
3. A Google Form + Google Sheets + Apps Script workflow for create / edit / delete event management.
4. Support for event images through a direct image URL, or a Google Form file upload question named `Image File`.

## Public site files

Upload these to GitHub Pages:

- `index.html`
- `styles.css`
- `config.js`
- `app.js`
- `data/events.json`

## How to make events editable

GitHub Pages is a static host, so the site itself cannot save changes back to a database. GitHub Pages serves HTML/CSS/JavaScript files straight from the repo, so live editing needs a separate data layer. Google Apps Script can publish a browser-based web app and work with Google Forms and Sheets.  

This package uses that pattern:

- Google Form = the edit/create/delete submission form
- Google Sheet = event database
- Apps Script web app = JSON API used by the public site

## Setup steps

### 1) Create the Google Sheet + Apps Script
1. Make a new Google Sheet.
2. Open **Extensions → Apps Script**.
3. Paste `apps-script/Code.gs` into the editor.
4. Save.
5. Run `setup()` once.
6. Authorize the script.

The script will:
- create an `Events` sheet,
- create a Google Form called **Anusuya Sahu Event Manager**,
- store the form URLs in Script Properties,
- install the submit trigger.

### 2) Get the form link and API link
After `setup()` runs, open **Project Settings → Script Properties** or use the Apps Script logs.  
You need:
- the form published URL for editing events,
- the web app URL for the JSON feed.

Deploy the script as a **Web app** and set:
- Execute as: **Me**
- Who has access: **Anyone**

Then copy the web app URL into `config.js` as `apiBaseUrl`.

Copy the form URL into `config.js` as `formUrl`.

### 3) Add image upload
There are two easy options:

- Paste a direct image URL into the form’s **Image URL** field.
- Add a Google Form file upload question titled **Image File** if you want users to upload a picture directly. The Apps Script handler already looks for that field and converts the uploaded Drive file into a usable link.

### 4) Publish on GitHub Pages
1. Put the public files into your GitHub repo.
2. Commit and push.
3. In GitHub, open **Settings → Pages**.
4. Publish from the branch/folder you want.

GitHub Pages will serve the static files from the repository.

## What to edit later

### Public website copy
Edit `config.js` for:
- hero text
- bio text
- YouTube link
- contact email
- buttons
- static work cards

### Events
Use the Google Form to create, edit, or delete event records.  
The public site reads the latest data from the web app.

### Fallback file
If the web app is not connected yet, the site will use `data/events.json` as a fallback.

## Event fields

The form and sheet use these fields:

- `Action` → Create / Edit / Delete
- `Section` → upcoming / gallery
- `Event ID`
- `Title`
- `Date`
- `Description`
- `Image URL`
- `Link URL`
- `Notes`

## Optional improvement
If you want the form itself to look closer to the reference site, I can turn the Google Form into a branded version with the same color theme and field order.
