import { _ as __nuxt_component_0 } from './nuxt-link-Dh3vRL2d.mjs';
import { u as useFetch, r as relativeTime, _ as __nuxt_component_1 } from './fetch-BNYUjz8P.mjs';
import { defineComponent, withAsyncContext, computed, mergeProps, withCtx, openBlock, createBlock, createVNode, unref, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { a as useRoute } from './server.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@vue/shared';
import 'perfect-debounce';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'vue-router';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    const complaintId = route.params.id;
    const { data: complaint, error } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      `/api/complaints/${complaintId}`,
      "$N99fayg0fv"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const timeAgo = computed(() => {
      if (complaint.value) {
        return relativeTime(complaint.value.createdAt);
      }
      return "";
    });
    const formattedDate = computed(() => {
      if (complaint.value) {
        return new Date(complaint.value.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        });
      }
      return "";
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_CategoryBadge = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen" }, _attrs))}><header class="bg-white shadow-sm"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"><div class="flex items-center gap-4">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "text-gray-600 hover:text-gray-900 transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"${_scopeId}></path></svg>`);
          } else {
            return [
              (openBlock(), createBlock("svg", {
                class: "w-6 h-6",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24"
              }, [
                createVNode("path", {
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  "stroke-width": "2",
                  d: "M10 19l-7-7m0 0l7-7m-7 7h18"
                })
              ]))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div><h1 class="text-3xl font-bold text-gray-900">Speak Up</h1><p class="text-gray-600 mt-1">Civic complaints platform</p></div></div></div></header><main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">`);
      if (unref(error) || !unref(complaint)) {
        _push(`<div class="bg-white shadow-md rounded-lg p-8 text-center"><svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><h3 class="mt-2 text-lg font-medium text-gray-900">Complaint not found</h3><p class="mt-1 text-sm text-gray-500"> The complaint you&#39;re looking for doesn&#39;t exist or has been removed. </p><div class="mt-6">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/",
          class: "inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Back to Feed `);
            } else {
              return [
                createTextVNode(" Back to Feed ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
      } else {
        _push(`<article class="bg-white shadow-md rounded-lg overflow-hidden">`);
        if (unref(complaint).imageUrl) {
          _push(`<div class="w-full"><img${ssrRenderAttr("src", unref(complaint).imageUrl)}${ssrRenderAttr("alt", unref(complaint).title)} class="w-full h-96 object-cover"></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="p-6 md:p-8"><div class="flex items-start justify-between gap-4 mb-4"><h1 class="text-3xl font-bold text-gray-900 flex-1">${ssrInterpolate(unref(complaint).title)}</h1>`);
        _push(ssrRenderComponent(_component_CategoryBadge, {
          category: unref(complaint).category
        }, null, _parent));
        _push(`</div><div class="flex flex-wrap gap-4 text-sm text-gray-600 mb-6 pb-6 border-b"><div class="flex items-center gap-2"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg><span>${ssrInterpolate(unref(complaint).authorName)}</span></div><div class="flex items-center gap-2"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg><span>${ssrInterpolate(unref(complaint).location)}</span></div><div class="flex items-center gap-2"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><span>${ssrInterpolate(unref(timeAgo))}</span></div><div class="flex items-center gap-2"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><span class="capitalize">${ssrInterpolate(unref(complaint).status)}</span></div></div><div class="prose prose-lg max-w-none"><p class="text-gray-700 whitespace-pre-wrap">${ssrInterpolate(unref(complaint).body)}</p></div><div class="mt-8 pt-6 border-t"><p class="text-xs text-gray-500"> Submitted on ${ssrInterpolate(unref(formattedDate))}</p></div></div></article>`);
      }
      _push(`</main></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/complaints/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-D5Tc50Mx.mjs.map
