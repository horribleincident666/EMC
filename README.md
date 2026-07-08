# EMC Production Command Center

Open locally while the local server is running:

http://127.0.0.1:8876/index.html

Password:

EMC2016

Recovery email link in the login screen:

subratadutta66666@gmail.com

## Included

- Password-gated login with required user name.
- Shared online user heartbeat through the Railway server endpoint `/api/online`.
- Dashboard with raw material closing stock, low-stock count, machine health count, today's major activities, tomorrow's plan broadcast, and management summary export.
- Separate General Notification page for leave/staff/site messages and read receipts.
- Machinery library with machine category, machine name, profile-style photograph slot, screen setup only for sieving machines, automatic output count from screen count, output names, breakdown history, photo/file note, breakdown summary, fragile-machine detection, ordered spare parts, spare specification, available stock, and minimum stock.
- Daily stock by date from 2026-07-01 to 2036-07-01.
- Closing stock carries forward as the next available opening stock.
- Day and night production plus day and night consumption. Cumulative stock = opening + day production + night production. Closing stock = cumulative stock - day consumption - night consumption.
- Stock cumulative and closing values recalculate live while typing, before saving.
- Editable raw material variants and PSD fields.
- Formulation tab that asks which EMC product to manufacture, keeps the reference Excel structure with smaller font, allows component/mesh add-delete, calculates target production/batch quantities, calculates weighted PSD, and exports the selected formulation to Excel.
- Activity log and tomorrow plan follow the new reference workbook: Date, Shift, Person name, Activity / Planned works.
- Suggestions / approval register with details and file/photo attachments.
- GRN-style incoming/outgoing goods register with optional fields and a PSD update slot.
- Read-only mesh to micron table.
- Master search, audit trail for login/add/save/delete actions, and full-site single-file Excel management report export with separate worksheet tabs.
- EMC logo and creator signature for Subrata Dutta.

## Railway Deployment

This folder is ready to deploy on Railway:

1. Create a new GitHub repository.
2. Upload all files from this folder to the repository.
3. In Railway, create a new project from that GitHub repository.
4. Railway will run `npm start`, which starts `server.js`.
5. Use the Railway-generated public domain as the team link.

Important: this version stores production/formulation/stock records in each browser's localStorage, but the online-user list is shared through the hosted server. The online link will be available when your laptop is off. For shared live stock/activity data across all users, the next upgrade should add a backend database and server-side authentication.
