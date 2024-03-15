export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png","robots.txt"]),
	mimeTypes: {".png":"image/png",".txt":"text/plain"},
	_: {
		client: {"start":"_app/immutable/entry/start.DbZZfKXK.js","app":"_app/immutable/entry/app.CbZ_oHMX.js","imports":["_app/immutable/entry/start.DbZZfKXK.js","_app/immutable/chunks/entry.CuxT2vj6.js","_app/immutable/chunks/runtime.Drpn6UTf.js","_app/immutable/entry/app.CbZ_oHMX.js","_app/immutable/chunks/runtime.Drpn6UTf.js","_app/immutable/chunks/disclose-version.DI4CEFtJ.js","_app/immutable/chunks/main-client.fUw2qwUQ.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
