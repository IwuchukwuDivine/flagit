// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: false },
  modules: ["@nuxtjs/tailwindcss"],
  css: ["~/assets/css/main.css"],
  typescript: {
    strict: true,
    typeCheck: false,
  },
  app: {
    head: {
      title: "Flagit",
      htmlAttrs: { lang: "en" },
      meta: [
        {
          name: "description",
          content: "Flagit — flag civic issues in your community.",
        },
        {
          name: "viewport",
          content:
            "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
        },
        {
          name: "keywords",
          content: "Flagit, Community, Complaints, Issues, Concerns",
        },
      ],
    },
  },
  devServer: {
    port: 3000,
    host: "0.0.0.0",
  },
  nitro: {
    experimental: {
      database: true,
    },
  },
});
