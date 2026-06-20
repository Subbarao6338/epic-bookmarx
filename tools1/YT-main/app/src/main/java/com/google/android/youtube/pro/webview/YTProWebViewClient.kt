package com.google.android.youtube.pro.webview

import android.content.Intent
import android.util.Log
import android.webkit.CookieManager
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebView
import android.webkit.WebViewClient
import com.google.android.youtube.pro.ForegroundService
import com.google.android.youtube.pro.MainActivity
import java.io.BufferedReader
import java.io.ByteArrayInputStream
import java.io.InputStream
import java.io.InputStreamReader
import java.net.URL
import javax.net.ssl.HttpsURLConnection

open class YTProWebViewClient(private val activity: MainActivity, private val web: YTProWebView) : WebViewClient() {

    override fun shouldInterceptRequest(view: WebView, request: WebResourceRequest): WebResourceResponse? {
        val url = request.url.toString()

        if (url.contains("accounts.google.com") ||
            url.contains("myaccount.google.com") ||
            url.contains("accounts.youtube.com") ||
            url.contains("google.com/signin") ||
            url.contains("google.com/oauth") ||
            url.contains("googleapis.com/oauth") ||
            url.contains("/signin") ||
            url.contains("SetSID")
        ) {
            return super.shouldInterceptRequest(view, request)
        }

        if (request.isForMainFrame && (url.contains("m.youtube.com") || url.contains("www.youtube.com") || url.contains("music.youtube.com"))) {
            try {
                val newUrl = URL(url)
                val connection = newUrl.openConnection() as HttpsURLConnection
                connection.requestMethod = request.method

                for ((key, value) in request.requestHeaders) {
                    if (!key.equals("Accept-Encoding", ignoreCase = true)) {
                        connection.setRequestProperty(key, value)
                    }
                }

                val cookies = CookieManager.getInstance().getCookie(url)
                if (cookies != null) connection.setRequestProperty("Cookie", cookies)

                connection.connect()

                val safeHeaders = mutableMapOf<String, String>()
                for ((key, value) in connection.headerFields) {
                    if (key != null) {
                        val headerName = key.lowercase()
                        if (headerName != "content-security-policy" && headerName != "content-security-policy-report-only") {
                            safeHeaders[key] = value.joinToString(", ")
                        }
                    }
                }

                val inputStream = if (connection.responseCode >= 400) connection.errorStream else connection.inputStream
                inputStream?.use { stream ->
                    val html = stream.bufferedReader().use { it.readText() }
                    val cspPattern = "(?i)<meta\\s+[^>]*http-equiv\\s*=\\s*[\"']?Content-Security-Policy[\"']?[^>]*>".toRegex()
                    val modifiedHtml = html.replace(cspPattern, "")

                    val modifiedHtmlStream = ByteArrayInputStream(modifiedHtml.toByteArray(Charsets.UTF_8))
                    return WebResourceResponse("text/html", "utf-8", connection.responseCode, "OK", safeHeaders, modifiedHtmlStream)
                }
                return super.shouldInterceptRequest(view, request)
            } catch (e: Exception) {
                return super.shouldInterceptRequest(view, request)
            }
        }

        if (url.startsWith("https://www.google.com/js/") ||
            url.startsWith("https://www.google.com/recaptcha/") ||
            url.startsWith("https://www.google.com/js/th/")
        ) {
            try {
                val conn = URL(url).openConnection() as HttpsURLConnection
                conn.setRequestProperty("User-Agent", request.requestHeaders["User-Agent"])
                conn.setRequestProperty("Referer", "https://www.youtube.com/")
                conn.instanceFollowRedirects = true
                conn.connectTimeout = 10000
                conn.readTimeout = 10000
                conn.connect()

                val mimeType = conn.contentType ?: "application/javascript"
                val encoding = conn.contentEncoding ?: "utf-8"

                val headers = mutableMapOf<String, String>()
                headers["Access-Control-Allow-Origin"] = "*"
                headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
                headers["Access-Control-Allow-Headers"] = "*"
                headers["Cross-Origin-Resource-Policy"] = "cross-origin"

                val inputStream = if (conn.responseCode >= 400) conn.errorStream else conn.inputStream
                return WebResourceResponse(
                    mimeType, encoding,
                    conn.responseCode, "OK",
                    headers, inputStream
                )

            } catch (e: Exception) {
                Log.e("YTPRO_WVC", "Google JS fetch failed: ${e.message}")
            }
        }

        if (url.contains("youtube.com/ytpro_cdn/")) {
            var modifiedUrl = url

            if (url.contains("youtube.com/ytpro_cdn/npm/ytpro@latest/bgplay.js") || url == "https://youtube.com/ytpro_cdn/npm/ytpro/bgplay.js") {
                try {
                    val inputStream = activity.assets.open("bgplay.js")
                    return WebResourceResponse("application/javascript", "UTF-8", inputStream)
                } catch (e: Exception) {
                }
            } else if (url.contains("youtube.com/ytpro_cdn/npm/ytpro@latest/innertube.js") || url == "https://youtube.com/ytpro_cdn/npm/ytpro/innertube.js") {
                try {
                    val inputStream = activity.assets.open("innertube.js")
                    return WebResourceResponse("application/javascript", "UTF-8", inputStream)
                } catch (e: Exception) {
                }
            } else if (url.contains("youtube.com/ytpro_cdn/npm/ytpro@latest") || url == "https://youtube.com/ytpro_cdn/npm/ytpro") {
                try {
                    val inputStream = activity.assets.open("script.js")
                    return WebResourceResponse("application/javascript", "UTF-8", inputStream)
                } catch (e: Exception) {
                }
            }

            if (url.contains("youtube.com/ytpro_cdn/esm")) modifiedUrl = url.replace("youtube.com/ytpro_cdn/esm", "esm.sh")
            else if (url.contains("youtube.com/ytpro_cdn/npm")) modifiedUrl = url.replace("youtube.com/ytpro_cdn", "cdn.jsdelivr.net")

            try {
                val newUrl = URL(modifiedUrl)
                val connection = newUrl.openConnection() as HttpsURLConnection

                connection.useCaches = false
                connection.defaultUseCaches = false
                connection.addRequestProperty("Cache-Control", "no-cache, no-store, must-revalidate")
                connection.addRequestProperty("Pragma", "no-cache")
                connection.addRequestProperty("Expires", "0")
                connection.setRequestProperty("User-Agent", "YTPRO")
                connection.setRequestProperty("Accept", "**")
                connection.connectTimeout = 10000
                connection.readTimeout = 10000

                connection.requestMethod = "GET"
                connection.connect()

                val mimeType = connection.contentType ?: "application/javascript"
                val encoding = connection.contentEncoding ?: "utf-8"

                val headers = mutableMapOf<String, String>()
                headers["Access-Control-Allow-Origin"] = "*"
                headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
                headers["Access-Control-Allow-Headers"] = "*"
                headers["Content-Type"] = mimeType
                headers["Access-Control-Allow-Credentials"] = "true"
                headers["Cross-Origin-Resource-Policy"] = "cross-origin"

                if (request.method == "OPTIONS") {
                    return WebResourceResponse("text/plain", "UTF-8", 204, "No Content", headers, null)
                }

                val inputStream = if (connection.responseCode >= 400) connection.errorStream else connection.inputStream
                return WebResourceResponse(mimeType, encoding, connection.responseCode, "OK", headers, inputStream)
            } catch (e: Exception) {
                return super.shouldInterceptRequest(view, request)
            }
        }

        return super.shouldInterceptRequest(view, request)
    }

    override fun onPageFinished(view: WebView, url: String) {
        web.evaluateJavascript("if (window.trustedTypes && window.trustedTypes.createPolicy && !window.trustedTypes.defaultPolicy) {window.trustedTypes.createPolicy('default', {createHTML: (string) => string,createScriptURL: string => string, createScript: string => string, });}", null)
        web.evaluateJavascript("(function () { var script = document.createElement('script'); script.src='https://youtube.com/ytpro_cdn/npm/ytpro@latest'; document.body.appendChild(script);  })();", null)
        web.evaluateJavascript("(function () { var script = document.createElement('script'); script.src='https://youtube.com/ytpro_cdn/npm/ytpro@latest/bgplay.js'; document.body.appendChild(script);  })();", null)
        web.evaluateJavascript("(function () { var script = document.createElement('script');script.type='module';script.src='https://youtube.com/ytpro_cdn/npm/ytpro@latest/innertube.js'; document.body.appendChild(script);  })();", null)

        if (!url.contains("youtube.com/watch") && !url.contains("youtube.com/shorts") && activity.isPlaying) {
            activity.isPlaying = false
            activity.mediaSession = false
            activity.stopService(Intent(activity.applicationContext, ForegroundService::class.java))
        }
        activity.swipeRefreshLayout?.isRefreshing = false
        super.onPageFinished(view, url)
    }
}
