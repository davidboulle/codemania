import { z as value_or_fallback, l as create_anchor, A as ensure_array_like, B as attr, w as escape, C as stringify, o as bind_props, q as pop, j as push, D as copy_payload, E as assign_payload, F as head } from "../../chunks/index.js";
import resolveConfig from "tailwindcss/resolveConfig.js";
class ProjectFile {
  path;
  name = "untilted.txt";
  content = "";
  lines = 0;
  complete = false;
  progress = "";
  progressNext = "";
  constructor(path) {
    this.path = path;
    let file = path.split("/").at(-1);
    if (typeof file != "undefined" && file.length > 0) {
      this.name = file;
    }
  }
  getNextWord(i) {
    let word = "";
    let index = i;
    let loops = 0;
    while (true) {
      let nextchar = this.content.charAt(index);
      if (word.length > 4 && word.replaceAll(" ", "").length != 0 && word.charAt(word.length) != " ") {
        if (nextchar == " ")
          break;
        if (nextchar == "\n")
          break;
      }
      word += this.content.charAt(index);
      index += 1;
      loops += 1;
      if (loops > 100)
        break;
    }
    return word;
  }
  isSameChar(c) {
    console.log(c + " <-> " + this.progress.charAt(this.progress.length - 1));
    return c == this.progress.charAt(this.progress.length - 1);
  }
}
class Project {
  name;
  author;
  url;
  files = [];
  complete = false;
  constructor(name, author, url) {
    this.name = name;
    this.author = author;
    this.url = url;
  }
}
function WidgetIde($$payload, $$props) {
  push(false);
  let cssVarStyles;
  let project = $$props["project"];
  let tabs = [
    new ProjectFile("https://raw.githubusercontent.com/saadeghi/daisyui/master/src/lib/addPrefix.js"),
    new ProjectFile("https://raw.githubusercontent.com/saadeghi/daisyui/master/src/lib/createPlugin.js")
  ];
  let widgetName = value_or_fallback($$props["widgetName"], "IDE");
  let ideContent = "";
  let ideContentNext = "";
  let ready = false;
  let animations = [];
  let chainSize = 0;
  let selected = tabs[0];
  let ideStyle = {
    "border-external": "#b5b5b5",
    "border-internal": "#c5cede",
    "border-tab-unactive": "#d1dbec",
    "border-tab-active": "#c5cede",
    "border-tab-hover": "#c6d4e3",
    "border-tab-focus": "#c5cede",
    "bg-tabs": "#d1dbec",
    "bg-tab-unactive": "#d1dbec",
    "bg-tab-hover": "#c6d4e3",
    "bg-tab-active": "white",
    "bg-tab-focus": "#f1f4f9",
    "bg-input": "white",
    "text-tab-unactive": "rgba(0, 0, 0, 0.7)",
    "text-tab-hover": "rgba(0, 0, 0, 0.7)",
    "text-tab-active": "rgba(0, 0, 0, 0.7)",
    "text-tab-focus": "rgba(0, 0, 0, 0.7)",
    "text-light": "#cbd5e1"
  };
  cssVarStyles = Object.entries(ideStyle).map(([key, value]) => `--${key}:${value}`).join(";");
  const anchor = create_anchor($$payload);
  const each_array = ensure_array_like(tabs);
  const anchor_2 = create_anchor($$payload);
  const each_array_1 = ensure_array_like(animations);
  $$payload.out += `<div class="widget-ide flew-grow relative flex min-h-96 flex-1 select-none flex-col rounded shadow-sm svelte-14hmjwh"${attr("style", cssVarStyles, false)}><div class="ide-tabs no-scrollbar absolute inline-flex h-12 w-full items-end self-start overflow-x-scroll rounded-t pt-2 svelte-14hmjwh"><div class="ide-icon relative h-12 min-w-12 select-none border-0 pl-2 pr-3 svelte-14hmjwh"></div> ${anchor}`;
  for (let $$index = 0; $$index < each_array.length; $$index++) {
    const tab = each_array[$$index];
    const anchor_1 = create_anchor($$payload);
    $$payload.out += `${anchor_1}<button${attr("class", `ide-tab shadow-0 relative h-10 min-w-48 max-w-64 pb-2 pl-4 pr-4 pt-2 text-sm svelte-14hmjwh ${stringify([tab == selected ? "active" : ""].filter(Boolean).join(" "))}`, false)}><p class="truncate text-left svelte-14hmjwh">${escape(tab.name)}</p></button>${anchor_1}`;
  }
  $$payload.out += `${anchor}</div> <textarea${attr("disabled", !ready, true)}${attr("class", `ide-content absolute bottom-0 left-0 right-0 top-0 z-20 mt-12 flex-grow resize-none bg-transparent pb-32 pl-4 pr-4 pt-4 font-mono outline-none svelte-14hmjwh ${stringify([""].filter(Boolean).join(" "))}`, false)} autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">`;
  const $$body = escape(ideContent);
  if ($$body) {
    $$payload.out += `${$$body}`;
  }
  $$payload.out += `</textarea> <textarea readonly${attr("class", `ide-content-next bottom-0 left-0 right-0 top-0 z-10 mt-12 flex-grow resize-none pb-32 pl-4 pr-4 pt-4 font-mono outline-none svelte-14hmjwh ${stringify([""].filter(Boolean).join(" "))}`, false)} spellcheck="false">`;
  const $$body_1 = escape(ideContentNext);
  if ($$body_1) {
    $$payload.out += `${$$body_1}`;
  }
  $$payload.out += `</textarea> <div class="ide-animations absolute z-10 m-[50%] flex h-0 w-0 items-center justify-center svelte-14hmjwh"><div class="anim-chain chain-pulse relative mt-10 w-auto whitespace-nowrap text-center svelte-14hmjwh">Chain × ${escape(chainSize)}</div> ${anchor_2}`;
  for (let $$index_1 = 0; $$index_1 < each_array_1.length; $$index_1++) {
    const anim = each_array_1[$$index_1];
    const anchor_3 = create_anchor($$payload);
    $$payload.out += `${anchor_3}<p${attr("class", `absolute leading-zero svelte-14hmjwh ${stringify([anim.error ? "error" : ""].filter(Boolean).join(" "))}`, false)}>${escape(anim.key)}</p>${anchor_3}`;
  }
  $$payload.out += `${anchor_2}</div></div>`;
  bind_props($$props, { project, widgetName });
  pop();
}
function WidgetManagement($$payload, $$props) {
  push(false);
  let widgetName = value_or_fallback($$props["widgetName"], "Management");
  $$payload.out += `<div class="widget-management flex min-h-48 flex-1 overflow-hidden rounded bg-slate-100 p-4 shadow-sm">${escape(widgetName)}</div>`;
  bind_props($$props, { widgetName });
  pop();
}
function WidgetStats($$payload, $$props) {
  push(false);
  let widgetName = value_or_fallback($$props["widgetName"], "Stats");
  $$payload.out += `<div class="widget-stats flex h-[30%] min-h-48 rounded bg-slate-100 p-4 shadow-sm">${escape(widgetName)}</div>`;
  bind_props($$props, { widgetName });
  pop();
}
function CardProject($$payload, $$props) {
  push(false);
  let project = $$props["project"];
  $$payload.out += `<button class="block w-96 rounded bg-slate-100 p-4 text-start shadow-sm drop-shadow-sm transition hover:bg-slate-50"><p class="w-full overflow-ellipsis text-xl text-slate-600">${escape(project.name)}</p> <p class="text-sm text-slate-400">${escape(project.author)}</p> <p class="text-end text-sm text-slate-400 text-opacity-75">18,325 lines</p></button>`;
  bind_props($$props, { project });
  pop();
}
function OverlayProjectPicker($$payload, $$props) {
  push(false);
  let projects = value_or_fallback($$props["projects"], []);
  let selected = value_or_fallback($$props["selected"], null);
  const anchor = create_anchor($$payload);
  const each_array = ensure_array_like(projects);
  $$payload.out += `<div class="widget-stats absolute z-50 flex h-screen w-screen items-center justify-center bg-slate-400 bg-opacity-75 text-center"><div class="flex flex-col gap-4 rounded-lg bg-slate-200 p-4 shadow-sm"><p class="text-slate-400">Start a new project</p> ${anchor}`;
  for (let $$index = 0; $$index < each_array.length; $$index++) {
    const project = each_array[$$index];
    const anchor_1 = create_anchor($$payload);
    const anchor_2 = create_anchor($$payload);
    $$payload.out += `${anchor_1}${anchor_2}`;
    CardProject($$payload, { project });
    $$payload.out += `${anchor_2}${anchor_1}`;
  }
  $$payload.out += `${anchor}</div></div>`;
  bind_props($$props, { projects, selected });
  pop();
}
const tailwindConfig = {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      lineHeight: {
        "zero": "0"
      }
    }
  },
  plugins: []
};
function _page($$payload, $$props) {
  push(false);
  const twConfig = resolveConfig(tailwindConfig);
  parseInt(twConfig.theme.screens.md.slice(0, -2));
  let projects = value_or_fallback($$props["projects"], [
    new Project("daisyui", "saadeghi", "https://raw.githubusercontent.com/saadeghi/daisyui/master/src/lib/addPrefix.js"),
    new Project("OpenGFW", "apernet", "https://github.com/apernet/OpenGFW/blob/master/analyzer/interface.go"),
    new Project("earthworm", "cuixueshe", "https://github.com/cuixueshe/earthworm/blob/main/apps/api/src/main.ts")
  ]);
  let project = new Project("", "", "");
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    const anchor = create_anchor($$payload2);
    const anchor_2 = create_anchor($$payload2);
    const anchor_6 = create_anchor($$payload2);
    head($$payload2, ($$payload3) => {
      $$payload3.title = "<title>";
      $$payload3.title += `CODEMANIA — ${escape(project.name)}</title>`;
      $$payload3.out += `<meta name="description" content="">`;
    });
    $$payload2.out += `${anchor}`;
    {
      $$payload2.out += "<!--ssr:if:true-->";
      const anchor_1 = create_anchor($$payload2);
      $$payload2.out += `${anchor_1}`;
      OverlayProjectPicker($$payload2, {
        get projects() {
          return projects;
        },
        set projects($$value) {
          projects = $$value;
          $$settled = false;
        }
      });
      $$payload2.out += `${anchor_1}`;
    }
    $$payload2.out += `${anchor} <div id="container-main" class="flex min-h-screen w-full min-w-64 select-none flex-col gap-2 overflow-hidden bg-slate-200 p-2 font-sans md:h-screen md:flex-row md:gap-0"><div id="column-1" class="flex w-full flex-col gap-2 md:w-[50%]">${anchor_2}`;
    {
      $$payload2.out += "<!--ssr:if:false-->";
      const anchor_4 = create_anchor($$payload2);
      const anchor_5 = create_anchor($$payload2);
      $$payload2.out += `${anchor_4}`;
      WidgetStats($$payload2, {});
      $$payload2.out += `${anchor_4} ${anchor_5}`;
      WidgetManagement($$payload2, {});
      $$payload2.out += `${anchor_5}`;
    }
    $$payload2.out += `${anchor_2}</div> <div class="hidden min-h-96 w-2 flex-col justify-between text-slate-400 md:flex"><button class="resizer flex flex-1 cursor-col-resize items-center justify-center text-center">•</button></div> <div id="column-2" class="flex w-full flex-1 flex-col gap-2">${anchor_6}`;
    {
      $$payload2.out += "<!--ssr:if:false-->";
      const anchor_9 = create_anchor($$payload2);
      $$payload2.out += `${anchor_9}`;
      WidgetIde($$payload2, {
        get project() {
          return project;
        },
        set project($$value) {
          project = $$value;
          $$settled = false;
        }
      });
      $$payload2.out += `${anchor_9}`;
    }
    $$payload2.out += `${anchor_6}</div></div>`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, { projects });
  pop();
}
export {
  _page as default
};
