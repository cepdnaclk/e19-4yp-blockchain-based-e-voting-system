/* eslint-disable no-console */

// this file is regular CommonJS

const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

async function createHeliaNode() {
  const { createHelia } = await import('helia');
  const { unixfs } = await import('@helia/unixfs');
  const helia = await createHelia();
  const fs = unixfs(helia);
  return { helia, fs };
}

async function startServer() {
  const { fs } = await createHeliaNode();
  const app = express();
  app.use(express.json({ type: '*/*' }));

  // POST /file - store JSON content, return CID
  app.post('/ipfs/file', async (req, res) => {
    try {
      const encoder = new TextEncoder();
      const content = req.body;
      if (!content || typeof content !== 'object') {
        return res.status(400).json({ error: 'No JSON content provided' });
      }
      const jsonString = JSON.stringify(content);
      const cid = await fs.addBytes(encoder.encode(jsonString));
      res.status(201).json({ cid: cid.toString() });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET /file/:cid - retrieve JSON content by CID
  app.get('/ipfs/file/:cid', async (req, res) => {
    try {
      const { cid } = req.params;
      const decoder = new TextDecoder();
      let text = '';
      for await (const chunk of fs.cat(cid)) {
        text += decoder.decode(chunk, { stream: true });
      }
      try {
        const json = JSON.parse(text);
        res.status(200).json(json);
      } catch (jsonErr) {
        res.status(500).json({ error: 'Stored content is not valid JSON' });
      }
    } catch (err) {
      res.status(404).json({ error: 'File not found or invalid CID' });
    }
  });

  app.get('/ipfs/test', (req, res) => {
    res.status(200).json({ message: 'IPFS API is working' });
  })

  const PORT = process.env.IPFS_PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Helia API server running on port ${PORT}`);
  });
}

startServer().catch(err => {
  console.error(err);
  process.exit(1);
});
