import { b as useFetch, a as __nuxt_component_0$1 } from './server.mjs';
import { r as relativeTime, _ as __nuxt_component_1$1 } from './relativeTime-BU0K_GUt.mjs';
import { defineComponent, withAsyncContext, mergeProps, unref, withCtx, createTextVNode, computed, createVNode, openBlock, createBlock, createCommentVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'vue-router';
import '@vue/shared';
import 'perfect-debounce';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "ComplaintCard",
  __ssrInlineRender: true,
  props: {
    complaint: {}
  },
  setup(__props) {
    const props = __props;
    const truncatedBody = computed(() => {
      const maxLength = 150;
      if (props.complaint.body.length > maxLength) {
        return props.complaint.body.substring(0, maxLength) + "...";
      }
      return props.complaint.body;
    });
    const timeAgo = computed(() => relativeTime(props.complaint.createdAt));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      const _component_CategoryBadge = __nuxt_component_1$1;
      _push(ssrRenderComponent(_component_NuxtLink, mergeProps({
        to: `/complaints/${__props.complaint.id}`,
        class: "block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-col md:flex-row gap-4"${_scopeId}>`);
            if (__props.complaint.imageUrl) {
              _push2(`<div class="md:w-1/3"${_scopeId}><img${ssrRenderAttr("src", __props.complaint.imageUrl)}${ssrRenderAttr("alt", __props.complaint.title)} class="w-full h-48 object-cover rounded-lg"${_scopeId}></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="flex-1"${_scopeId}><div class="flex items-start justify-between gap-4 mb-2"${_scopeId}><h3 class="text-xl font-semibold text-gray-900 flex-1"${_scopeId}>${ssrInterpolate(__props.complaint.title)}</h3>`);
            _push2(ssrRenderComponent(_component_CategoryBadge, {
              category: __props.complaint.category
            }, null, _parent2, _scopeId));
            _push2(`</div><p class="text-gray-600 mb-4"${_scopeId}>${ssrInterpolate(unref(truncatedBody))}</p><div class="flex items-center justify-between text-sm text-gray-500"${_scopeId}><div class="flex items-center gap-4"${_scopeId}><span class="flex items-center gap-1"${_scopeId}><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"${_scopeId}></path></svg> ${ssrInterpolate(__props.complaint.authorName)}</span><span class="flex items-center gap-1"${_scopeId}><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"${_scopeId}></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"${_scopeId}></path></svg> ${ssrInterpolate(__props.complaint.location)}</span></div><span${_scopeId}>${ssrInterpolate(unref(timeAgo))}</span></div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex flex-col md:flex-row gap-4" }, [
                __props.complaint.imageUrl ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "md:w-1/3"
                }, [
                  createVNode("img", {
                    src: __props.complaint.imageUrl,
                    alt: __props.complaint.title,
                    class: "w-full h-48 object-cover rounded-lg"
                  }, null, 8, ["src", "alt"])
                ])) : createCommentVNode("", true),
                createVNode("div", { class: "flex-1" }, [
                  createVNode("div", { class: "flex items-start justify-between gap-4 mb-2" }, [
                    createVNode("h3", { class: "text-xl font-semibold text-gray-900 flex-1" }, toDisplayString(__props.complaint.title), 1),
                    createVNode(_component_CategoryBadge, {
                      category: __props.complaint.category
                    }, null, 8, ["category"])
                  ]),
                  createVNode("p", { class: "text-gray-600 mb-4" }, toDisplayString(unref(truncatedBody)), 1),
                  createVNode("div", { class: "flex items-center justify-between text-sm text-gray-500" }, [
                    createVNode("div", { class: "flex items-center gap-4" }, [
                      createVNode("span", { class: "flex items-center gap-1" }, [
                        (openBlock(), createBlock("svg", {
                          class: "w-4 h-4",
                          fill: "none",
                          stroke: "currentColor",
                          viewBox: "0 0 24 24"
                        }, [
                          createVNode("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            "stroke-width": "2",
                            d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          })
                        ])),
                        createTextVNode(" " + toDisplayString(__props.complaint.authorName), 1)
                      ]),
                      createVNode("span", { class: "flex items-center gap-1" }, [
                        (openBlock(), createBlock("svg", {
                          class: "w-4 h-4",
                          fill: "none",
                          stroke: "currentColor",
                          viewBox: "0 0 24 24"
                        }, [
                          createVNode("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            "stroke-width": "2",
                            d: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          }),
                          createVNode("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            "stroke-width": "2",
                            d: "M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          })
                        ])),
                        createTextVNode(" " + toDisplayString(__props.complaint.location), 1)
                      ])
                    ]),
                    createVNode("span", null, toDisplayString(unref(timeAgo)), 1)
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ComplaintCard.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main$1, { __name: "ComplaintCard" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { data: complaints, error } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/complaints",
      "$NNVdHhouK7"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      const _component_ComplaintCard = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen" }, _attrs))}><main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">`);
      if (unref(error)) {
        _push(`<div class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg"> Failed to load complaints. Please try again later. </div>`);
      } else if (!unref(complaints) || unref(complaints).length === 0) {
        _push(`<div class="text-center py-12"><svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg><h3 class="mt-2 text-sm font-medium text-gray-900">No complaints yet</h3><p class="mt-1 text-sm text-gray-500"> Get started by submitting the first complaint. </p><div class="mt-6">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/submit",
          class: "inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Submit Complaint `);
            } else {
              return [
                createTextVNode(" Submit Complaint ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
      } else {
        _push(`<div class="space-y-6"><!--[-->`);
        ssrRenderList(unref(complaints), (complaint) => {
          _push(ssrRenderComponent(_component_ComplaintCard, {
            key: complaint.id,
            complaint
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      }
      _push(`</main></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-ByuEVLHC.mjs.map
