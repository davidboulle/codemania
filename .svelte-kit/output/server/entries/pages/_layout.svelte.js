import { l as create_anchor, t as slot, q as pop, j as push } from "../../chunks/index.js";
function _layout($$payload, $$props) {
  push(false);
  const anchor = create_anchor($$payload);
  $$payload.out += `<div class="app svelte-lmxqks"><main class="svelte-lmxqks">${anchor}`;
  slot($$payload, $$props.children, {}, null);
  $$payload.out += `${anchor}</main></div>`;
  pop();
}
export {
  _layout as default
};
