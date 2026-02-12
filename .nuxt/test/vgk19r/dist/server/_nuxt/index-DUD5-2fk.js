import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "../server.mjs";
import "/Users/dee_vyn/monolithic-ralph/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/Users/dee_vyn/monolithic-ralph/node_modules/hookable/dist/index.mjs";
import "/Users/dee_vyn/monolithic-ralph/node_modules/unctx/dist/index.mjs";
import "/Users/dee_vyn/monolithic-ralph/node_modules/h3/dist/index.mjs";
import "vue-router";
import "/Users/dee_vyn/monolithic-ralph/node_modules/defu/dist/defu.mjs";
import "/Users/dee_vyn/monolithic-ralph/node_modules/ufo/dist/index.mjs";
import "@vue/shared";
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1>Speak Up</h1><p>Civic complaints platform</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__file", "/Users/dee_vyn/monolithic-ralph/pages/index.vue"]]);
export {
  index as default
};
//# sourceMappingURL=index-DUD5-2fk.js.map
