# EMC Production Management - GitHub and Railway Deploy

## What to Upload to GitHub

Upload the CONTENTS of this folder as one GitHub repository:

`emc-production-app-github-railway`

Important:

`package.json`, `server.js`, `index.html`, and `railway.json` must be visible in the TOP LEVEL / ROOT of the GitHub repository.

Do not upload a parent folder that contains `emc-production-app-github-railway` as a subfolder. If Railway cannot see `package.json` at the repo root, it may deploy incorrectly and show `Not Found`.

Required files are already included:

- `package.json`
- `server.js`
- `railway.json`
- `index.html`
- `app.js`
- `styles.css`
- image assets
- `data/` folder for initial app data

## Railway Deploy

1. Create a new GitHub repository.
2. Upload/push all files from this folder.
3. In Railway, choose **New Project**.
4. Choose **Deploy from GitHub repo**.
5. Select this repository.
6. Confirm Railway detects a Node app.
7. Railway should run:

   `npm start`

8. Open the generated Railway public URL.

## If Railway Shows "Not Found"

Check these items in order:

1. GitHub repo root must directly contain `package.json`.
2. Railway service must deploy from the repo root, not from a subfolder.
3. Railway start command should be `npm start`.
4. Railway logs should show:

   `EMC Production Management running on 0.0.0.0:<PORT>`

5. Open the Railway domain ending with `/`, for example:

   `https://your-app.up.railway.app/`

## Login

Password:

`EMC2016`

## Important Data Note

The app stores shared data in JSON files under `data/`.

For permanent production use on Railway, attach a Railway Volume and set:

`DATA_DIR=/data`

Without a volume, Railway can lose JSON file data during redeploy/rebuild.

## Local Test

From this folder:

```bash
npm start
```

Then open:

`http://127.0.0.1:3000/`
