const fs = require('fs');
const path = require('path');
const p = path.join(__dirname, '..', 'client', 'package-lock.json');
if (!fs.existsSync(p)) { console.error('lockfile not found:', p); process.exit(1); }
const lock = JSON.parse(fs.readFileSync(p,'utf8'));
let removed = false;
if (lock.packages) {
  for (const key of Object.keys(lock.packages)) {
    if (key.includes('node_modules/next') || key.includes('node_modules/@next/')) {
      delete lock.packages[key];
      removed = true;
    }
  }
}
if (lock.dependencies) {
  for (const key of Object.keys(lock.dependencies)) {
    if (key === 'next' || key.startsWith('@next/')) {
      delete lock.dependencies[key];
      removed = true;
    } else {
      const dep = lock.dependencies[key];
      if (dep && dep.requires) {
        for (const r of Object.keys(dep.requires)) {
          if (r === 'next' || r.startsWith('@next/')) {
            delete dep.requires[r];
            removed = true;
          }
        }
      }
    }
  }
}
if (lock.packages && lock.packages['']) {
  const root = lock.packages[''];
  ['dependencies','devDependencies','optionalDependencies','peerDependencies'].forEach(field => {
    if (root[field]) {
      for (const k of Object.keys(root[field])) {
        if (k === 'next' || k.startsWith('@next/')) {
          delete root[field][k];
          removed = true;
        }
      }
    }
  });
}
fs.writeFileSync(p, JSON.stringify(lock, null, 2) + '\n');
console.log('clean-lock-next: removed=', removed);
process.exit(removed ? 0 : 0);
