/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs')
const path = require('path')

const seedPath = path.join(__dirname, '..', 'db.seed.json')
const dbPath = path.join(__dirname, '..', 'db.json')

fs.copyFileSync(seedPath, dbPath)
console.log('db.json reset from db.seed.json')
