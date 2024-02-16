// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
export const prerender = true;

import { redirect } from '@sveltejs/kit';
	
export function load({}) {
    console.log('Redirecting to /codemania...');
    throw redirect(307, '/codemania');
}
