/* eslint-disable */
const { execSync } = require('child_process');
const { config } = require('dotenv');

config();
execSync(
  `
curl -H "Authorization: token ${process.env.PAT}"
  -H "Accept: application/vnd.github.v3.raw"
  -o "prisma/schema.prisma"
  -L "https://api.github.com/repos/BCTCio/veor-api/contents/prisma/schema.prisma"`.replace(
    /\n/g,
    '',
  ),
);
execSync('npx prisma generate');
