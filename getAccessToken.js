import fs from 'fs';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';

const privateKey = fs.readFileSync('./private.key'); // Path to your saved RSA key
const integrationKey = 'e35a5f52-af92-4566-8c0e-f21157f6abde';
const userId = '86cf8884-8c2b-4522-a731-0fd1abe491c3'; // 🔁 Replace this after Step 5
const accountId = 'bcf7e85f-1809-4814-8f96-c74b47f327c7';

const jwtPayload = {
  iss: integrationKey,
  sub: userId,
  aud: 'account-d.docusign.com',
  scope: 'signature',
};

const token = jwt.sign(jwtPayload, privateKey, { algorithm: 'RS256', expiresIn: '10m' });

fetch('https://account-d.docusign.com/oauth/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion: token
  })
})
.then(res => res.json())
.then(data => {
  if (data.access_token) {
    console.log('✅ ACCESS TOKEN:', data.access_token);
  } else {
    console.error('❌ Failed to retrieve token. Full response:\n', data);
  }
})