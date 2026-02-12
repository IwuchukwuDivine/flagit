import { _ as __nuxt_component_0$1 } from './nuxt-link-Dh3vRL2d.mjs';
import { mergeProps, withCtx, openBlock, createBlock, createVNode, defineComponent, ref, reactive, unref, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderClass, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';
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

const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "ImageUpload",
  __ssrInlineRender: true,
  emits: ["update:imageUrl", "error"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const selectedFile = ref(null);
    const previewUrl = ref(null);
    const errorMessage = ref("");
    const clearSelection = () => {
      selectedFile.value = null;
      previewUrl.value = null;
      errorMessage.value = "";
    };
    __expose({
      selectedFile,
      clearSelection
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><div><label for="image-upload" class="block text-sm font-medium text-gray-700 mb-2"> Photo Evidence (optional) </label><input id="image-upload" type="file" accept="image/jpeg,image/jpg,image/png,image/webp" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"><p class="mt-1 text-xs text-gray-500"> JPG, PNG, or WEBP. Max 5MB. </p></div>`);
      if (unref(errorMessage)) {
        _push(`<div class="text-sm text-red-600">${ssrInterpolate(unref(errorMessage))}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(previewUrl)) {
        _push(`<div class="relative"><img${ssrRenderAttr("src", unref(previewUrl))} alt="Preview" class="w-full h-48 object-cover rounded-lg"><button type="button" class="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ImageUpload.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main$2, { __name: "ImageUpload" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "ComplaintForm",
  __ssrInlineRender: true,
  setup(__props) {
    const imageUploadRef = ref(null);
    const formData = reactive({
      title: "",
      body: "",
      authorName: "",
      category: "",
      location: ""
    });
    const errors = reactive({
      title: "",
      body: "",
      authorName: "",
      category: "",
      location: "",
      general: ""
    });
    const isSubmitting = ref(false);
    const categories = [
      { value: "roads", label: "Roads" },
      { value: "water", label: "Water" },
      { value: "electricity", label: "Electricity" },
      { value: "sanitation", label: "Sanitation" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ImageUpload = __nuxt_component_0;
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<form${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}>`);
      if (unref(errors).general) {
        _push(`<div class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">${ssrInterpolate(unref(errors).general)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div><label for="title" class="block text-sm font-medium text-gray-700 mb-2"> Title <span class="text-red-500">*</span></label><input id="title"${ssrRenderAttr("value", unref(formData).title)} type="text" class="${ssrRenderClass([{ "border-red-500": unref(errors).title }, "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"])}" placeholder="Brief summary of the issue">`);
      if (unref(errors).title) {
        _push(`<p class="mt-1 text-sm text-red-600">${ssrInterpolate(unref(errors).title)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label for="body" class="block text-sm font-medium text-gray-700 mb-2"> Description <span class="text-red-500">*</span></label><textarea id="body" rows="5" class="${ssrRenderClass([{ "border-red-500": unref(errors).body }, "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"])}" placeholder="Detailed description of the complaint">${ssrInterpolate(unref(formData).body)}</textarea>`);
      if (unref(errors).body) {
        _push(`<p class="mt-1 text-sm text-red-600">${ssrInterpolate(unref(errors).body)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label for="authorName" class="block text-sm font-medium text-gray-700 mb-2"> Your Name <span class="text-red-500">*</span></label><input id="authorName"${ssrRenderAttr("value", unref(formData).authorName)} type="text" class="${ssrRenderClass([{ "border-red-500": unref(errors).authorName }, "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"])}" placeholder="Your full name">`);
      if (unref(errors).authorName) {
        _push(`<p class="mt-1 text-sm text-red-600">${ssrInterpolate(unref(errors).authorName)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label for="category" class="block text-sm font-medium text-gray-700 mb-2"> Category <span class="text-red-500">*</span></label><select id="category" class="${ssrRenderClass([{ "border-red-500": unref(errors).category }, "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"])}"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(formData).category) ? ssrLooseContain(unref(formData).category, "") : ssrLooseEqual(unref(formData).category, "")) ? " selected" : ""}>Select a category</option><!--[-->`);
      ssrRenderList(categories, (cat) => {
        _push(`<option${ssrRenderAttr("value", cat.value)}${ssrIncludeBooleanAttr(Array.isArray(unref(formData).category) ? ssrLooseContain(unref(formData).category, cat.value) : ssrLooseEqual(unref(formData).category, cat.value)) ? " selected" : ""}>${ssrInterpolate(cat.label)}</option>`);
      });
      _push(`<!--]--></select>`);
      if (unref(errors).category) {
        _push(`<p class="mt-1 text-sm text-red-600">${ssrInterpolate(unref(errors).category)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label for="location" class="block text-sm font-medium text-gray-700 mb-2"> Location <span class="text-red-500">*</span></label><input id="location"${ssrRenderAttr("value", unref(formData).location)} type="text" class="${ssrRenderClass([{ "border-red-500": unref(errors).location }, "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"])}" placeholder="Street address or area name">`);
      if (unref(errors).location) {
        _push(`<p class="mt-1 text-sm text-red-600">${ssrInterpolate(unref(errors).location)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      _push(ssrRenderComponent(_component_ImageUpload, {
        ref_key: "imageUploadRef",
        ref: imageUploadRef
      }, null, _parent));
      _push(`<div class="flex gap-4"><button type="submit"${ssrIncludeBooleanAttr(unref(isSubmitting)) ? " disabled" : ""} class="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">${ssrInterpolate(unref(isSubmitting) ? "Submitting..." : "Submit Complaint")}</button>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Cancel `);
          } else {
            return [
              createTextVNode(" Cancel ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></form>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ComplaintForm.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main$1, { __name: "ComplaintForm" });
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_NuxtLink = __nuxt_component_0$1;
  const _component_ComplaintForm = __nuxt_component_1;
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
  _push(`<div><h1 class="text-3xl font-bold text-gray-900">Submit Complaint</h1><p class="text-gray-600 mt-1">Report a civic issue in your community</p></div></div></div></header><main class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><div class="bg-white shadow-md rounded-lg p-6 md:p-8">`);
  _push(ssrRenderComponent(_component_ComplaintForm, null, null, _parent));
  _push(`</div></main></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/submit.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const submit = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { submit as default };
//# sourceMappingURL=submit-ujdh6IwG.mjs.map
