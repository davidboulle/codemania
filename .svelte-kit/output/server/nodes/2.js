import * as universal from '../entries/pages/_page.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+page.ts";
export const imports = ["_app/immutable/nodes/2.CIHo4x3v.js","_app/immutable/chunks/disclose-version.DI4CEFtJ.js","_app/immutable/chunks/runtime.Drpn6UTf.js","_app/immutable/chunks/main-client.fUw2qwUQ.js","_app/immutable/chunks/lifecycle.DfoQC5PO.js"];
export const stylesheets = ["_app/immutable/assets/2.Bs5BGH5J.css"];
export const fonts = [];
