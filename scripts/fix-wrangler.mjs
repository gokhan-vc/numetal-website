import fs from 'node:fs';
const p = 'dist/server/wrangler.json';
const w = JSON.parse(fs.readFileSync(p, 'utf8'));
w.name = 'numetal-site'; w.topLevelName = 'numetal-site';
delete w.images; delete w.previews; w.kv_namespaces = [];
w.routes = [
  { pattern: 'numetal.xyz', custom_domain: true },
  { pattern: 'www.numetal.xyz', custom_domain: true },
];
fs.writeFileSync(p, JSON.stringify(w));
console.log('postbuild: numetal-site + custom domains; stripped unused bindings');
