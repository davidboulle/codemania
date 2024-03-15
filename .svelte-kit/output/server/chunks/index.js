const noop = () => {
};
function subscribe_to_store(store, run, invalidate) {
  if (store == null) {
    run(void 0);
    if (invalidate)
      invalidate(void 0);
    return noop;
  }
  const unsub = store.subscribe(
    run,
    // @ts-expect-error
    invalidate
  );
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
const DERIVED = 1 << 1;
const EFFECT = 1 << 2;
const PRE_EFFECT = 1 << 3;
const RENDER_EFFECT = 1 << 4;
const MANAGED = 1 << 6;
const UNOWNED = 1 << 7;
const CLEAN = 1 << 8;
const DIRTY = 1 << 9;
const MAYBE_DIRTY = 1 << 10;
const INERT = 1 << 11;
const DESTROYED = 1 << 12;
const ROOT_BLOCK = 0;
const IF_BLOCK = 1;
const EACH_BLOCK = 2;
const UNINITIALIZED = Symbol();
const STATE_SYMBOL = Symbol("$state");
function equals(value) {
  return value === this.v;
}
function safe_not_equal(a, b) {
  return a != a ? (
    // eslint-disable-next-line eqeqeq
    b == b
  ) : a !== b || a !== null && typeof a === "object" || typeof a === "function";
}
function safe_equals(value) {
  return !safe_not_equal(value, this.v);
}
// @__NO_SIDE_EFFECTS__
function source(value) {
  const source2 = {
    f: 0,
    // TODO ideally we could skip this altogether, but it causes type errors
    reactions: null,
    equals,
    v: value,
    version: 0
  };
  return source2;
}
// @__NO_SIDE_EFFECTS__
function mutable_source(initial_value) {
  const s = /* @__PURE__ */ source(initial_value);
  s.equals = safe_equals;
  if (current_component_context) {
    (current_component_context.d ??= []).push(s);
  }
  return s;
}
function set(signal, value) {
  if (!current_untracking && !ignore_mutation_validation && current_reaction !== null && is_runes() && (current_reaction.f & DERIVED) !== 0) {
    throw new Error(
      "ERR_SVELTE_UNSAFE_MUTATION"
    );
  }
  if (!signal.equals(value)) {
    signal.v = value;
    signal.version++;
    if (is_runes() && !ignore_mutation_validation && current_effect !== null && (current_effect.f & CLEAN) !== 0 && (current_effect.f & MANAGED) === 0) {
      if (current_dependencies !== null && current_dependencies.includes(signal)) {
        set_signal_status(current_effect, DIRTY);
        schedule_effect(current_effect, false);
      } else {
        if (current_untracked_writes === null) {
          set_current_untracked_writes([signal]);
        } else {
          current_untracked_writes.push(signal);
        }
      }
    }
    mark_reactions(signal, DIRTY, true);
  }
  return value;
}
function create_effect(type, fn, sync, block = current_block, init = true) {
  const signal = {
    block,
    deps: null,
    f: type | DIRTY,
    l: 0,
    fn,
    effects: null,
    deriveds: null,
    teardown: null,
    ctx: current_component_context,
    ondestroy: null
  };
  if (current_effect !== null) {
    signal.l = current_effect.l + 1;
  }
  if ((type & MANAGED) === 0) {
    if (current_reaction !== null) {
      if (current_reaction.effects === null) {
        current_reaction.effects = [signal];
      } else {
        current_reaction.effects.push(signal);
      }
    }
  }
  if (init) {
    schedule_effect(signal, sync);
  }
  return signal;
}
function effect_active() {
  return current_effect ? (current_effect.f & MANAGED) === 0 : false;
}
function render_effect(fn, block = current_block, managed = false, sync = true) {
  let flags = RENDER_EFFECT;
  if (managed) {
    flags |= MANAGED;
  }
  return create_effect(
    flags,
    /** @type {any} */
    fn,
    sync,
    block
  );
}
function destroy_effect(signal) {
  destroy_children(signal);
  remove_reactions(signal, 0);
  set_signal_status(signal, DESTROYED);
  signal.teardown?.();
  signal.ondestroy?.();
  signal.fn = signal.effects = signal.ondestroy = signal.ctx = signal.block = signal.deps = null;
}
let updating_derived = false;
function update_derived(derived, force_schedule) {
  var previous_updating_derived = updating_derived;
  updating_derived = true;
  destroy_children(derived);
  var value = execute_reaction_fn(derived);
  updating_derived = previous_updating_derived;
  var status = (current_skip_reaction || (derived.f & UNOWNED) !== 0) && derived.deps !== null ? MAYBE_DIRTY : CLEAN;
  set_signal_status(derived, status);
  if (!derived.equals(value)) {
    derived.v = value;
    mark_reactions(derived, DIRTY, force_schedule);
  }
}
function destroy_derived(signal) {
  destroy_children(signal);
  remove_reactions(signal, 0);
  set_signal_status(signal, DESTROYED);
  signal.effects = signal.deps = signal.reactions = // @ts-expect-error `signal.fn` cannot be `null` while the signal is alive
  signal.fn = null;
}
function flush_tasks() {
}
const FLUSH_MICROTASK = 0;
const FLUSH_SYNC = 1;
let current_scheduler_mode = FLUSH_MICROTASK;
let is_micro_task_queued = false;
let is_flushing_effect = false;
let current_queued_pre_and_render_effects = [];
let current_queued_effects = [];
let flush_count = 0;
let current_reaction = null;
let current_effect = null;
let current_dependencies = null;
let current_dependencies_index = 0;
let current_untracked_writes = null;
function set_current_untracked_writes(value) {
  current_untracked_writes = value;
}
let current_untracking = false;
let ignore_mutation_validation = false;
let current_skip_reaction = false;
let current_block = null;
let current_component_context = null;
function is_runes() {
  return current_component_context !== null && current_component_context.r;
}
function check_dirtiness(reaction) {
  var flags = reaction.f;
  if ((flags & DIRTY) !== 0) {
    return true;
  }
  if ((flags & MAYBE_DIRTY) !== 0) {
    var dependencies = reaction.deps;
    if (dependencies !== null) {
      var length = dependencies.length;
      for (var i = 0; i < length; i++) {
        var dependency = dependencies[i];
        if (check_dirtiness(
          /** @type {import('#client').Derived} */
          dependency
        )) {
          update_derived(
            /** @type {import('#client').Derived} **/
            dependency,
            true
          );
          if ((reaction.f & DIRTY) !== 0) {
            return true;
          }
        }
        var is_unowned = (flags & UNOWNED) !== 0;
        var version = dependency.version;
        if (is_unowned && version > /** @type {import('#client').Derived} */
        reaction.version) {
          reaction.version = version;
          return true;
        }
      }
    }
    set_signal_status(reaction, CLEAN);
  }
  return false;
}
function execute_reaction_fn(signal) {
  const fn = signal.fn;
  const flags = signal.f;
  const is_render_effect = (flags & RENDER_EFFECT) !== 0;
  const previous_dependencies = current_dependencies;
  const previous_dependencies_index = current_dependencies_index;
  const previous_untracked_writes = current_untracked_writes;
  const previous_reaction = current_reaction;
  const previous_skip_reaction = current_skip_reaction;
  const previous_untracking = current_untracking;
  current_dependencies = /** @type {null | import('./types.js').Value[]} */
  null;
  current_dependencies_index = 0;
  current_untracked_writes = null;
  current_reaction = signal;
  current_skip_reaction = !is_flushing_effect && (flags & UNOWNED) !== 0;
  current_untracking = false;
  try {
    let res;
    if (is_render_effect) {
      res = /** @type {(block: import('#client').Block, signal: import('#client').Signal) => V} */
      fn(
        /** @type {import('#client').Block} */
        /** @type {import('#client').Effect} */
        signal.block,
        /** @type {import('#client').Signal} */
        signal
      );
    } else {
      res = /** @type {() => V} */
      fn();
    }
    let dependencies = (
      /** @type {import('./types.js').Value<unknown>[]} **/
      signal.deps
    );
    if (current_dependencies !== null) {
      let i;
      if (dependencies !== null) {
        const deps_length = dependencies.length;
        const full_current_dependencies = current_dependencies_index === 0 ? current_dependencies : dependencies.slice(0, current_dependencies_index).concat(current_dependencies);
        const current_dep_length = full_current_dependencies.length;
        const full_current_dependencies_set = current_dep_length > 16 && deps_length - current_dependencies_index > 1 ? new Set(full_current_dependencies) : null;
        for (i = current_dependencies_index; i < deps_length; i++) {
          const dependency = dependencies[i];
          if (full_current_dependencies_set !== null ? !full_current_dependencies_set.has(dependency) : !full_current_dependencies.includes(dependency)) {
            remove_reaction(signal, dependency);
          }
        }
      }
      if (dependencies !== null && current_dependencies_index > 0) {
        dependencies.length = current_dependencies_index + current_dependencies.length;
        for (i = 0; i < current_dependencies.length; i++) {
          dependencies[current_dependencies_index + i] = current_dependencies[i];
        }
      } else {
        signal.deps = /** @type {import('./types.js').Value<V>[]} **/
        dependencies = current_dependencies;
      }
      if (!current_skip_reaction) {
        for (i = current_dependencies_index; i < dependencies.length; i++) {
          const dependency = dependencies[i];
          const reactions = dependency.reactions;
          if (reactions === null) {
            dependency.reactions = [signal];
          } else if (reactions[reactions.length - 1] !== signal) {
            reactions.push(signal);
          }
        }
      }
    } else if (dependencies !== null && current_dependencies_index < dependencies.length) {
      remove_reactions(signal, current_dependencies_index);
      dependencies.length = current_dependencies_index;
    }
    return res;
  } finally {
    current_dependencies = previous_dependencies;
    current_dependencies_index = previous_dependencies_index;
    current_untracked_writes = previous_untracked_writes;
    current_reaction = previous_reaction;
    current_skip_reaction = previous_skip_reaction;
    current_untracking = previous_untracking;
  }
}
function remove_reaction(signal, dependency) {
  const reactions = dependency.reactions;
  let reactions_length = 0;
  if (reactions !== null) {
    reactions_length = reactions.length - 1;
    const index = reactions.indexOf(signal);
    if (index !== -1) {
      if (reactions_length === 0) {
        dependency.reactions = null;
      } else {
        reactions[index] = reactions[reactions_length];
        reactions.pop();
      }
    }
  }
  if (reactions_length === 0 && (dependency.f & UNOWNED) !== 0) {
    set_signal_status(dependency, DIRTY);
    remove_reactions(
      /** @type {import('./types.js').Derived} **/
      dependency,
      0
    );
  }
}
function remove_reactions(signal, start_index) {
  const dependencies = signal.deps;
  if (dependencies !== null) {
    const active_dependencies = start_index === 0 ? null : dependencies.slice(0, start_index);
    let i;
    for (i = start_index; i < dependencies.length; i++) {
      const dependency = dependencies[i];
      if (active_dependencies === null || !active_dependencies.includes(dependency)) {
        remove_reaction(signal, dependency);
      }
    }
  }
}
function destroy_children(signal) {
  if (signal.effects) {
    for (var i = 0; i < signal.effects.length; i += 1) {
      destroy_effect(signal.effects[i]);
    }
    signal.effects = null;
  }
  if (signal.deriveds) {
    for (i = 0; i < signal.deriveds.length; i += 1) {
      destroy_derived(signal.deriveds[i]);
    }
    signal.deriveds = null;
  }
}
function execute_effect(signal) {
  if ((signal.f & DESTROYED) !== 0) {
    return;
  }
  const previous_effect = current_effect;
  const previous_component_context = current_component_context;
  const previous_block = current_block;
  const component_context = signal.ctx;
  current_effect = signal;
  current_component_context = component_context;
  current_block = signal.block;
  try {
    destroy_children(signal);
    signal.teardown?.();
    const teardown = execute_reaction_fn(signal);
    signal.teardown = typeof teardown === "function" ? teardown : null;
  } finally {
    current_effect = previous_effect;
    current_component_context = previous_component_context;
    current_block = previous_block;
  }
  if ((signal.f & PRE_EFFECT) !== 0 && current_queued_pre_and_render_effects.length > 0) {
    flush_local_pre_effects(component_context);
  }
}
function infinite_loop_guard() {
  if (flush_count > 100) {
    flush_count = 0;
    throw new Error(
      "ERR_SVELTE_TOO_MANY_UPDATES"
    );
  }
  flush_count++;
}
function flush_queued_effects(effects) {
  var length = effects.length;
  if (length === 0)
    return;
  infinite_loop_guard();
  var previously_flushing_effect = is_flushing_effect;
  is_flushing_effect = true;
  try {
    for (var i = 0; i < length; i++) {
      var signal = effects[i];
      if ((signal.f & (DESTROYED | INERT)) === 0) {
        if (check_dirtiness(signal)) {
          set_signal_status(signal, CLEAN);
          execute_effect(signal);
        }
      }
    }
  } finally {
    is_flushing_effect = previously_flushing_effect;
  }
  effects.length = 0;
}
function process_microtask() {
  is_micro_task_queued = false;
  if (flush_count > 101) {
    return;
  }
  const previous_queued_pre_and_render_effects = current_queued_pre_and_render_effects;
  const previous_queued_effects = current_queued_effects;
  current_queued_pre_and_render_effects = [];
  current_queued_effects = [];
  flush_queued_effects(previous_queued_pre_and_render_effects);
  flush_queued_effects(previous_queued_effects);
  if (!is_micro_task_queued) {
    flush_count = 0;
  }
}
function schedule_effect(signal, sync) {
  const flags = signal.f;
  if (sync) {
    const previously_flushing_effect = is_flushing_effect;
    try {
      is_flushing_effect = true;
      execute_effect(signal);
      set_signal_status(signal, CLEAN);
    } finally {
      is_flushing_effect = previously_flushing_effect;
    }
  } else {
    if (current_scheduler_mode === FLUSH_MICROTASK) {
      if (!is_micro_task_queued) {
        is_micro_task_queued = true;
        queueMicrotask(process_microtask);
      }
    }
    if ((flags & EFFECT) !== 0) {
      current_queued_effects.push(signal);
      if ((flags & MANAGED) === 0) {
        mark_subtree_children_inert(signal, true);
      }
    } else {
      const length = current_queued_pre_and_render_effects.length;
      let should_append = length === 0;
      if (!should_append) {
        const target_level = signal.l;
        const target_block = signal.block;
        const is_pre_effect = (flags & PRE_EFFECT) !== 0;
        let target_signal;
        let target_signal_level;
        let is_target_pre_effect;
        let i = length;
        while (true) {
          target_signal = current_queued_pre_and_render_effects[--i];
          target_signal_level = target_signal.l;
          if (target_signal_level <= target_level) {
            if (i + 1 === length) {
              should_append = true;
            } else {
              is_target_pre_effect = (target_signal.f & PRE_EFFECT) !== 0;
              if (target_signal_level < target_level || target_signal.block !== target_block || is_target_pre_effect && !is_pre_effect) {
                i++;
              }
              current_queued_pre_and_render_effects.splice(i, 0, signal);
            }
            break;
          }
          if (i === 0) {
            current_queued_pre_and_render_effects.unshift(signal);
            break;
          }
        }
      }
      if (should_append) {
        current_queued_pre_and_render_effects.push(signal);
      }
    }
  }
}
function flush_local_pre_effects(context) {
  const effects = [];
  for (let i = 0; i < current_queued_pre_and_render_effects.length; i++) {
    const effect = current_queued_pre_and_render_effects[i];
    if ((effect.f & PRE_EFFECT) !== 0 && effect.ctx === context) {
      effects.push(effect);
      current_queued_pre_and_render_effects.splice(i, 1);
      i--;
    }
  }
  flush_queued_effects(effects);
}
function flushSync(fn) {
  flush_sync(fn);
}
function flush_sync(fn, flush_previous = true) {
  const previous_scheduler_mode = current_scheduler_mode;
  const previous_queued_pre_and_render_effects = current_queued_pre_and_render_effects;
  const previous_queued_effects = current_queued_effects;
  let result;
  try {
    infinite_loop_guard();
    const pre_and_render_effects = [];
    const effects = [];
    current_scheduler_mode = FLUSH_SYNC;
    current_queued_pre_and_render_effects = pre_and_render_effects;
    current_queued_effects = effects;
    if (flush_previous) {
      flush_queued_effects(previous_queued_pre_and_render_effects);
      flush_queued_effects(previous_queued_effects);
    }
    if (fn !== void 0) {
      result = fn();
    }
    if (current_queued_pre_and_render_effects.length > 0 || effects.length > 0) {
      flushSync();
    }
    flush_tasks();
    flush_count = 0;
  } finally {
    current_scheduler_mode = previous_scheduler_mode;
    current_queued_pre_and_render_effects = previous_queued_pre_and_render_effects;
    current_queued_effects = previous_queued_effects;
  }
  return result;
}
function get(signal) {
  const flags = signal.f;
  if ((flags & DESTROYED) !== 0) {
    return signal.v;
  }
  if (current_reaction !== null && (current_reaction.f & MANAGED) === 0 && !current_untracking) {
    const unowned = (current_reaction.f & UNOWNED) !== 0;
    const dependencies = current_reaction.deps;
    if (current_dependencies === null && dependencies !== null && dependencies[current_dependencies_index] === signal && !(unowned && current_effect !== null)) {
      current_dependencies_index++;
    } else if (dependencies === null || current_dependencies_index === 0 || dependencies[current_dependencies_index - 1] !== signal) {
      if (current_dependencies === null) {
        current_dependencies = [signal];
      } else {
        current_dependencies.push(signal);
      }
    }
    if (current_untracked_writes !== null && current_effect !== null && (current_effect.f & CLEAN) !== 0 && (current_effect.f & MANAGED) === 0 && current_untracked_writes.includes(signal)) {
      set_signal_status(current_effect, DIRTY);
      schedule_effect(current_effect, false);
    }
  }
  if ((flags & DERIVED) !== 0 && check_dirtiness(
    /** @type {import('#client').Derived} */
    signal
  )) {
    {
      update_derived(
        /** @type {import('./types.js').Derived} **/
        signal,
        false
      );
    }
  }
  return signal.v;
}
function mark_subtree_children_inert(signal, inert, visited_blocks) {
  const effects = signal.effects;
  if (effects !== null) {
    for (var i = 0; i < effects.length; i++) {
      const effect = effects[i];
      mark_subtree_inert(effect, inert, visited_blocks);
    }
  }
}
function mark_subtree_inert(signal, inert, visited_blocks = /* @__PURE__ */ new Set()) {
  const flags = signal.f;
  const is_already_inert = (flags & INERT) !== 0;
  if (is_already_inert !== inert) {
    signal.f ^= INERT;
    if (!inert && (flags & CLEAN) === 0) {
      schedule_effect(signal, false);
    }
    const block = signal.block;
    if (block !== null && !visited_blocks.has(block)) {
      visited_blocks.add(block);
      const type = block.t;
      if (type === IF_BLOCK) {
        const condition_effect = block.e;
        if (condition_effect !== null && block !== current_block) {
          mark_subtree_inert(condition_effect, inert, visited_blocks);
        }
        const consequent_effect = block.ce;
        if (consequent_effect !== null && block.v) {
          mark_subtree_inert(consequent_effect, inert, visited_blocks);
        }
        const alternate_effect = block.ae;
        if (alternate_effect !== null && !block.v) {
          mark_subtree_inert(alternate_effect, inert, visited_blocks);
        }
      } else if (type === EACH_BLOCK) {
        const items = block.v;
        for (let { e: each_item_effect } of items) {
          if (each_item_effect !== null) {
            mark_subtree_inert(each_item_effect, inert, visited_blocks);
          }
        }
      }
    }
  }
  mark_subtree_children_inert(signal, inert, visited_blocks);
}
function mark_reactions(signal, to_status, force_schedule) {
  var reactions = signal.reactions;
  if (reactions === null)
    return;
  var runes = is_runes();
  var length = reactions.length;
  for (var i = 0; i < length; i++) {
    var reaction = reactions[i];
    if ((!force_schedule || !runes) && reaction === current_effect) {
      continue;
    }
    var flags = reaction.f;
    set_signal_status(reaction, to_status);
    var maybe_dirty = (flags & MAYBE_DIRTY) !== 0;
    var unowned = (flags & UNOWNED) !== 0;
    if ((flags & CLEAN) !== 0 || maybe_dirty && unowned) {
      if ((reaction.f & DERIVED) !== 0) {
        mark_reactions(
          /** @type {import('#client').Derived} */
          reaction,
          MAYBE_DIRTY,
          force_schedule
        );
      } else {
        schedule_effect(
          /** @type {import('#client').Effect} */
          reaction,
          false
        );
      }
    }
  }
}
function untrack(fn) {
  const previous_untracking = current_untracking;
  try {
    current_untracking = true;
    return fn();
  } finally {
    current_untracking = previous_untracking;
  }
}
const STATUS_MASK = ~(DIRTY | MAYBE_DIRTY | CLEAN);
function set_signal_status(signal, status) {
  signal.f = signal.f & STATUS_MASK | status;
}
function getContext(key) {
  const context_map = get_or_init_context_map();
  const result = (
    /** @type {T} */
    context_map.get(key)
  );
  return result;
}
function setContext(key, context) {
  const context_map = get_or_init_context_map();
  context_map.set(key, context);
  return context;
}
function get_or_init_context_map() {
  const component_context = current_component_context;
  if (component_context === null) {
    throw new Error(
      "ERR_SVELTE_ORPHAN_CONTEXT"
    );
  }
  return component_context.c ??= new Map(get_parent_context(component_context) || void 0);
}
function get_parent_context(component_context) {
  let parent = component_context.p;
  while (parent !== null) {
    const context_map = parent.c;
    if (context_map !== null) {
      return context_map;
    }
    parent = parent.p;
  }
  return null;
}
function push$1(props, runes = false, fn) {
  current_component_context = {
    // exports (and props, if `accessors: true`)
    x: null,
    // context
    c: null,
    // effects
    e: null,
    // mounted
    m: false,
    // parent
    p: current_component_context,
    // signals
    d: null,
    // props
    s: props,
    // runes
    r: runes,
    // legacy $:
    l1: [],
    l2: /* @__PURE__ */ source(false),
    // update_callbacks
    u: null
  };
}
function pop$1(component) {
  const context_stack_item = current_component_context;
  if (context_stack_item !== null) {
    if (component !== void 0) {
      context_stack_item.x = component;
    }
    const effects = context_stack_item.e;
    if (effects !== null) {
      context_stack_item.e = null;
      for (let i = 0; i < effects.length; i++) {
        schedule_effect(effects[i], false);
      }
    }
    current_component_context = context_stack_item.p;
    context_stack_item.m = true;
  }
  return component || /** @type {T} */
  {};
}
const ATTR_REGEX = /[&"]/g;
const CONTENT_REGEX = /[&<]/g;
function create_payload() {
  return { out: "", head: { title: "", out: "", anchor: 0 }, anchor: 0 };
}
function copy_payload(to_copy) {
  return {
    ...to_copy,
    head: { ...to_copy.head }
  };
}
function assign_payload(p1, p2) {
  p1.out = p2.out;
  p1.head = p2.head;
  p1.anchor = p2.anchor;
}
let on_destroy = [];
function render(component, options) {
  const payload = create_payload();
  const root_anchor = create_anchor(payload);
  const root_head_anchor = create_anchor(payload.head);
  const prev_on_destroy = on_destroy;
  on_destroy = [];
  payload.out += root_anchor;
  if (options.context) {
    push$1({});
    current_component_context.c = options.context;
  }
  component(payload, options.props, {}, {});
  if (options.context) {
    pop$1();
  }
  payload.out += root_anchor;
  for (const cleanup of on_destroy)
    cleanup();
  on_destroy = prev_on_destroy;
  return {
    head: payload.head.out || payload.head.title ? payload.head.title + root_head_anchor + payload.head.out + root_head_anchor : "",
    html: payload.out
  };
}
function push(runes) {
  push$1({}, runes);
}
function pop() {
  pop$1();
}
function escape(value, is_attr = false) {
  const str = String(value ?? "");
  const pattern = is_attr ? ATTR_REGEX : CONTENT_REGEX;
  pattern.lastIndex = 0;
  let escaped = "";
  let last = 0;
  while (pattern.test(str)) {
    const i = pattern.lastIndex - 1;
    const ch = str[i];
    escaped += str.substring(last, i) + (ch === "&" ? "&amp;" : ch === '"' ? "&quot;" : "&lt;");
    last = i + 1;
  }
  return escaped + str.substring(last);
}
function head(payload, fn) {
  const head_payload = payload.head;
  fn(head_payload);
}
function attr(name, value, boolean) {
  if (value == null || !value && boolean || value === "" && name === "class")
    return "";
  const assignment = boolean ? "" : `="${escape(value, true)}"`;
  return ` ${name}${assignment}`;
}
function stringify(value) {
  return typeof value === "string" ? value : value == null ? "" : value + "";
}
function store_get(store_values, store_name, store) {
  if (store_name in store_values && store_values[store_name][0] === store) {
    return store_values[store_name][2];
  }
  store_values[store_name]?.[1]();
  store_values[store_name] = [store, null, void 0];
  const unsub = subscribe_to_store(
    store,
    /** @param {any} v */
    (v) => store_values[store_name][2] = v
  );
  store_values[store_name][1] = unsub;
  return store_values[store_name][2];
}
function unsubscribe_stores(store_values) {
  for (const store_name in store_values) {
    store_values[store_name][1]();
  }
}
function value_or_fallback(value, fallback) {
  return value === void 0 ? fallback : value;
}
function slot(payload, slot_fn, slot_props, fallback_fn) {
  if (slot_fn === void 0) {
    if (fallback_fn !== null) {
      fallback_fn();
    }
  } else {
    slot_fn(payload, slot_props);
  }
}
function bind_props(props_parent, props_now) {
  for (const key in props_now) {
    const initial_value = props_parent[key];
    const value = props_now[key];
    if (initial_value === void 0 && value !== void 0 && Object.getOwnPropertyDescriptor(props_parent, key)?.set) {
      props_parent[key] = value;
    }
  }
}
function ensure_array_like(array_like_or_iterator) {
  return array_like_or_iterator?.length !== void 0 ? array_like_or_iterator : Array.from(array_like_or_iterator);
}
function create_anchor(payload) {
  const depth = payload.anchor++;
  return `<!--ssr:${depth}-->`;
}
export {
  ensure_array_like as A,
  attr as B,
  stringify as C,
  copy_payload as D,
  assign_payload as E,
  head as F,
  ROOT_BLOCK as R,
  STATE_SYMBOL as S,
  UNINITIALIZED as U,
  set as a,
  untrack as b,
  current_component_context as c,
  destroy_effect as d,
  effect_active as e,
  flush_sync as f,
  get as g,
  pop$1 as h,
  render as i,
  push as j,
  setContext as k,
  create_anchor as l,
  mutable_source as m,
  noop as n,
  bind_props as o,
  push$1 as p,
  pop as q,
  render_effect as r,
  source as s,
  slot as t,
  updating_derived as u,
  getContext as v,
  escape as w,
  store_get as x,
  unsubscribe_stores as y,
  value_or_fallback as z
};
