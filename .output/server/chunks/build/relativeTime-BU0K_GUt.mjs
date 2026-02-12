import { defineComponent, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CategoryBadge",
  __ssrInlineRender: true,
  props: {
    category: {}
  },
  setup(__props) {
    const props = __props;
    const categoryColors = {
      roads: "bg-blue-100 text-blue-800",
      water: "bg-cyan-100 text-cyan-800",
      electricity: "bg-yellow-100 text-yellow-800",
      sanitation: "bg-green-100 text-green-800"
    };
    const colorClass = computed(() => categoryColors[props.category] || "bg-gray-100 text-gray-800");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<span${ssrRenderAttrs(mergeProps({
        class: ["inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", unref(colorClass)]
      }, _attrs))}>${ssrInterpolate(__props.category)}</span>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/CategoryBadge.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main, { __name: "CategoryBadge" });
function relativeTime(date) {
  const now = /* @__PURE__ */ new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffSeconds = Math.floor(diffMs / 1e3);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  if (diffSeconds < 60) {
    return "just now";
  } else if (diffMinutes < 60) {
    return `${diffMinutes} ${diffMinutes === 1 ? "minute" : "minutes"} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
  } else if (diffDays < 30) {
    return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;
  } else {
    return then.toLocaleDateString();
  }
}

export { __nuxt_component_1 as _, relativeTime as r };
//# sourceMappingURL=relativeTime-BU0K_GUt.mjs.map
