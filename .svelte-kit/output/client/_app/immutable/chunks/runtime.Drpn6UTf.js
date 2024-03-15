var Pe=Array.isArray,Be=Array.from,Ke=Object.isFrozen,Ue=Object.defineProperty,Ye=Object.getOwnPropertyDescriptor,ke=Object.getOwnPropertyDescriptors,He=Object.prototype,Ve=Array.prototype,ze=Object.getPrototypeOf;const V=2,z=4,q=8,B=16,O=64,C=128,m=256,E=512,P=1024,X=2048,K=4096,Ge=0,Oe=1,me=2,We=3,Ze=6,Je=7,Qe=Symbol(),ce=Symbol("$state");function se(e){return e===this.v}function Te(e,t){return e!=e?t==t:e!==t||e!==null&&typeof e=="object"||typeof e=="function"}function Ae(e){return!Te(e,this.v)}function ue(e){return{f:0,reactions:null,equals:se,v:e,version:0}}function Xe(e){const t=ue(e);return t.equals=Ae,u&&(u.d??(u.d=[])).push(t),t}function $e(e,t){return ne(e,Ee(()=>Z(e))),t}function ne(e,t){if(!b&&!g&&p!==null&&ee()&&p.f&V)throw new Error("ERR_SVELTE_UNSAFE_MUTATION");return e.equals(t)||(e.v=t,e.version++,ee()&&!g&&c!==null&&c.f&m&&!(c.f&O)&&(h!==null&&h.includes(e)?(k(c,E),L(c,!1)):w===null?xe([e]):w.push(e)),re(e,E,!0)),t}function x(e,t,n,f=R,r=!0){const o={block:f,deps:null,f:e|E,l:0,fn:t,effects:null,deriveds:null,teardown:null,ctx:u,ondestroy:null};return c!==null&&(o.l=c.l+1),e&O||p!==null&&(p.effects===null?p.effects=[o]:p.effects.push(o)),r&&L(o,n),o}function ge(){return c?(c.f&O)===0:!1}function et(e){if(c===null)throw new Error("ERR_SVELTE_ORPHAN_EFFECT");const t=c.f&B&&u!==null&&!u.m,n=x(z,e,!1,R,!t);if(t){const f=u;(f.e??(f.e=[])).push(n)}return n}function tt(e){return x(z,e,!1)}function nt(e){return x(z|O,e,!1)}function ft(e){return x(q|O,e,!1)}function rt(e){if(c===null)throw new Error("ERR_SVELTE_ORPHAN_EFFECT");const t=c!==null&&(c.f&B)!==0;return x(q,()=>{const n=e();return De(),n},t)}function ot(e,t){const n=u,f={};return x(q,()=>{if(e(),!n.l1.includes(f))return n.l1.push(f),ne(n.l2,!0),Ee(t)},!0)}function ct(){const e=u;return we(()=>{Z(e.l2)&&(e.l1.length=0,e.l2.v=!1)})}function we(e,t=R,n=!1,f=!0){let r=B;return n&&(r|=O),x(r,e,f,t)}function be(e){var t,n;W(e),G(e,0),k(e,K),(t=e.teardown)==null||t.call(e),(n=e.ondestroy)==null||n.call(e),e.fn=e.effects=e.ondestroy=e.ctx=e.block=e.deps=null}let Q=!1;function st(e){let t=V|E;c===null&&(t|=C);const n={reactions:null,deps:null,equals:se,f:t,fn:e,effects:null,deriveds:null,v:null,version:0};return p!==null&&(p.deriveds===null?p.deriveds=[n]:p.deriveds.push(n)),n}function le(e,t){var n=Q;Q=!0,W(e);var f=ae(e);Q=n;var r=(I||e.f&C)&&e.deps!==null?P:m;k(e,r),e.equals(f)||(e.v=f,re(e,E,t))}function Se(e){W(e),G(e,0),k(e,K),e.effects=e.deps=e.reactions=e.fn=null}const ut=()=>{};function Re(e){for(var t=0;t<e.length;t++)e[t]()}function lt(e){return e()}let Y=!1,$=[];function _e(){Y=!1;const e=$.slice();$=[],Re(e)}function _t(e){Y||(Y=!0,setTimeout(_e,0)),$.push(e)}function qe(){Y&&_e()}const ie=0,Ce=1;let U=ie,H=!1,S=!1,a=[],N=[],D=0,p=null,c=null,h=null,i=0,w=null;function xe(e){w=e}let b=!1,g=!1;function it(e){g=e}let I=!1,R=null,u=null;function ee(){return u!==null&&u.r}function fe(e){var t=e.f;if(t&E)return!0;if(t&P){var n=e.deps;if(n!==null)for(var f=n.length,r=0;r<f;r++){var o=n[r];if(fe(o)&&(le(o,!0),e.f&E))return!0;var _=(t&C)!==0,s=o.version;if(_&&s>e.version)return e.version=s,!0}k(e,m)}return!1}function ae(e){const t=e.fn,n=e.f,f=(n&B)!==0,r=h,o=i,_=w,s=p,d=I,v=b;h=null,i=0,w=null,p=e,I=!S&&(n&C)!==0,b=!1;try{let T;f?T=t(e.block,e):T=t();let l=e.deps;if(h!==null){let y;if(l!==null){const j=l.length,A=i===0?h:l.slice(0,i).concat(h),oe=A.length>16&&j-i>1?new Set(A):null;for(y=i;y<j;y++){const J=l[y];(oe!==null?!oe.has(J):!A.includes(J))&&pe(e,J)}}if(l!==null&&i>0)for(l.length=i+h.length,y=0;y<h.length;y++)l[i+y]=h[y];else e.deps=l=h;if(!I)for(y=i;y<l.length;y++){const j=l[y],A=j.reactions;A===null?j.reactions=[e]:A[A.length-1]!==e&&A.push(e)}}else l!==null&&i<l.length&&(G(e,i),l.length=i);return T}finally{h=r,i=o,w=_,p=s,I=d,b=v}}function pe(e,t){const n=t.reactions;let f=0;if(n!==null){f=n.length-1;const r=n.indexOf(e);r!==-1&&(f===0?t.reactions=null:(n[r]=n[f],n.pop()))}f===0&&t.f&C&&(k(t,E),G(t,0))}function G(e,t){const n=e.deps;if(n!==null){const f=t===0?null:n.slice(0,t);let r;for(r=t;r<n.length;r++){const o=n[r];(f===null||!f.includes(o))&&pe(e,o)}}}function W(e){if(e.effects){for(var t=0;t<e.effects.length;t+=1)be(e.effects[t]);e.effects=null}if(e.deriveds){for(t=0;t<e.deriveds.length;t+=1)Se(e.deriveds[t]);e.deriveds=null}}function de(e){var o;if(e.f&K)return;const t=c,n=u,f=R,r=e.ctx;c=e,u=r,R=e.block;try{W(e),(o=e.teardown)==null||o.call(e);const _=ae(e);e.teardown=typeof _=="function"?_:null}finally{c=t,u=n,R=f}e.f&q&&a.length>0&&Fe(r)}function he(){if(D>100)throw D=0,new Error("ERR_SVELTE_TOO_MANY_UPDATES");D++}function F(e){var t=e.length;if(t!==0){he();var n=S;S=!0;try{for(var f=0;f<t;f++){var r=e[f];r.f&(K|X)||fe(r)&&(k(r,m),de(r))}}finally{S=n}e.length=0}}function Ne(){if(H=!1,D>101)return;const e=a,t=N;a=[],N=[],F(e),F(t),H||(D=0)}function L(e,t){const n=e.f;if(t){const f=S;try{S=!0,de(e),k(e,m)}finally{S=f}}else if(U===ie&&(H||(H=!0,queueMicrotask(Ne))),n&z)N.push(e),n&O||ve(e,!0);else{const f=a.length;let r=f===0;if(!r){const o=e.l,_=e.block,s=(n&q)!==0;let d,v,T,l=f;for(;;){if(d=a[--l],v=d.l,v<=o){l+1===f?r=!0:(T=(d.f&q)!==0,(v<o||d.block!==_||T&&!s)&&l++,a.splice(l,0,e));break}if(l===0){a.unshift(e);break}}}r&&a.push(e)}}function De(){const e=[];for(let t=0;t<a.length;t++){const n=a[t];n.f&B&&n.ctx===u&&(e.push(n),a.splice(t,1),t--)}F(e)}function Fe(e){const t=[];for(let n=0;n<a.length;n++){const f=a[n];f.f&q&&f.ctx===e&&(t.push(f),a.splice(n,1),n--)}F(t)}function ye(e){Le(e)}function Le(e,t=!0){const n=U,f=a,r=N;let o;try{he();const _=[],s=[];U=Ce,a=_,N=s,t&&(F(f),F(r)),e!==void 0&&(o=e()),(a.length>0||s.length>0)&&ye(),qe(),D=0}finally{U=n,a=f,N=r}return o}async function at(){await Promise.resolve(),ye()}function Z(e){const t=e.f;if(t&K)return e.v;if(p!==null&&!(p.f&O)&&!b){const n=(p.f&C)!==0,f=p.deps;h===null&&f!==null&&f[i]===e&&!(n&&c!==null)?i++:(f===null||i===0||f[i-1]!==e)&&(h===null?h=[e]:h.push(e)),w!==null&&c!==null&&c.f&m&&!(c.f&O)&&w.includes(e)&&(k(c,E),L(c,!1))}return t&V&&fe(e)&&le(e,!1),e.v}function ve(e,t,n){const f=e.effects;if(f!==null)for(var r=0;r<f.length;r++){const o=f[r];M(o,t,n)}}function M(e,t,n=new Set){const f=e.f;if((f&X)!==0!==t){e.f^=X,!t&&!(f&m)&&L(e,!1);const o=e.block;if(o!==null&&!n.has(o)){n.add(o);const _=o.t;if(_===Oe){const s=o.e;s!==null&&o!==R&&M(s,t,n);const d=o.ce;d!==null&&o.v&&M(d,t,n);const v=o.ae;v!==null&&!o.v&&M(v,t,n)}else if(_===me){const s=o.v;for(let{e:d}of s)d!==null&&M(d,t,n)}}}ve(e,t,n)}function re(e,t,n){var f=e.reactions;if(f!==null)for(var r=ee(),o=f.length,_=0;_<o;_++){var s=f[_];if(!((!n||!r)&&s===c)){var d=s.f;k(s,t);var v=(d&P)!==0,T=(d&C)!==0;(d&m||v&&T)&&(s.f&V?re(s,P,n):L(s,!1))}}}function Ee(e){const t=b;try{return b=!0,e()}finally{b=t}}const je=~(E|P|m);function k(e,t){e.f=e.f&je|t}function Ie(e){return typeof e=="object"&&e!==null&&typeof e.f=="number"}function pt(e,t=1){const n=Z(e);return ne(e,n+t),n}function dt(e,t=!1,n){u={x:null,c:null,e:null,m:!1,p:u,d:null,s:e,r:t,l1:[],l2:ue(!1),u:null}}function ht(e){const t=u;if(t!==null){e!==void 0&&(t.x=e);const n=t.e;if(n!==null){t.e=null;for(let f=0;f<n.length;f++)L(n[f],!1)}u=t.p,t.m=!0}return e||{}}function yt(e){if(!(typeof e!="object"||!e||e instanceof EventTarget)){if(ce in e)te(e);else if(!Array.isArray(e))for(let t in e){const n=e[t];typeof n=="object"&&n&&ce in n&&te(n)}}}function te(e,t=new Set){if(typeof e=="object"&&e!==null&&!(e instanceof EventTarget)&&!t.has(e)){t.add(e);for(let f in e)try{te(e[f],t)}catch{}const n=Object.getPrototypeOf(e);if(n!==Object.prototype&&n!==Array.prototype&&n!==Map.prototype&&n!==Set.prototype&&n!==Date.prototype){const f=ke(n);for(let r in f){const o=f[r].get;if(o)try{o.call(e)}catch{}}}}}function vt(e){return Ie(e)?Z(e):e}export{Ke as A,He as B,Ve as C,Ue as D,ue as E,Pe as F,Q as G,ge as H,Oe as I,ze as J,Je as K,at as L,_t as M,Le as N,Be as O,me as P,We as Q,Ge as R,ce as S,Ze as T,Qe as U,$e as V,ot as W,ct as X,pt as Y,vt as Z,Ee as a,ht as b,u as c,yt as d,dt as e,it as f,Z as g,we as h,M as i,ft as j,be as k,nt as l,Xe as m,ut as n,Re as o,rt as p,de as q,lt as r,ne as s,R as t,et as u,tt as v,Ye as w,Ae as x,Te as y,st as z};
