import { $fetch } from '@nuxt/test-utils'

/**
 * Test client that persists cookies across requests.
 * Solves the issue where $fetch doesn't automatically handle cookies in tests.
 */
export class TestClient {
  private cookies: string[] = []

  /**
   * Make a fetch request with cookies from previous responses.
   */
  async fetch<T = any>(url: string, options: any = {}): Promise<T> {
    // Add existing cookies to the request
    const headers = {
      ...options.headers,
      ...(this.cookies.length > 0 && { cookie: this.cookies.join('; ') }),
    }

    // Capture 'this' context in a variable to use in callbacks
    const self = this

    try {
      // Make the request with a custom onResponse handler to capture cookies
      const response = await $fetch(url, {
        ...options,
        headers,
        // Use a custom onResponse to capture cookies
        async onResponse({ response: res }) {
          // Extract Set-Cookie headers
          const setCookie = res.headers.get('set-cookie')
          if (setCookie) {
            // Handle both single cookie and multiple cookies
            const cookies = Array.isArray(setCookie) ? setCookie : [setCookie]
            cookies.forEach((cookieHeader) => {
              const cookiePart = cookieHeader.split(';')[0]
              const cookieName = cookiePart.split('=')[0]
              // Remove existing cookie with same name
              self.cookies = self.cookies.filter(
                (c) => !c.startsWith(cookieName + '=')
              )
              // Add new cookie
              self.cookies.push(cookiePart)
            })
          }
        },
      })

      return response as T
    } catch (error: any) {
      // For error responses, still try to extract cookies if available
      if (error.response?.headers) {
        const setCookie = error.response.headers.get?.('set-cookie')
        if (setCookie) {
          const cookies = Array.isArray(setCookie) ? setCookie : [setCookie]
          cookies.forEach((cookieHeader) => {
            const cookiePart = cookieHeader.split(';')[0]
            const cookieName = cookiePart.split('=')[0]
            this.cookies = this.cookies.filter(
              (c) => !c.startsWith(cookieName + '=')
            )
            this.cookies.push(cookiePart)
          })
        }
      }
      throw error
    }
  }

  /**
   * Clear all stored cookies.
   */
  clearCookies() {
    this.cookies = []
  }

  /**
   * Get the current cookies as a string.
   */
  getCookies(): string {
    return this.cookies.join('; ')
  }
}
