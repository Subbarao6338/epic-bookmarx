package cc.astron.utils

import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import java.io.ByteArrayInputStream

class AdBlocker {
    private val adDomains = hashSetOf(
        "googleads.g.doubleclick.net",
        "pubads.g.doubleclick.net",
        "securepubads.g.doubleclick.net",
        "googlesyndication.com",
        "adservice.google.com",
        "youtube.com/pagead/",
        "youtube.com/ptracking",
        "youtube.com/api/stats/ads",
        "youtube.com/api/stats/qoe",
        "youtube.com/api/stats/vss",
        "s.youtube.com",
        "video-stats.l.google.com",
        "ads.youtube.com",
        "partnerad.l.google.com",
        "pagead2.googlesyndication.com",
        "telemetry.youtube.com",
        "stats.g.doubleclick.net"
    )

    fun isAdRequest(url: String): Boolean {
        return adDomains.any { url.contains(it) }
    }

    fun createEmptyResponse(): WebResourceResponse {
        return WebResourceResponse("text/plain", "UTF-8", ByteArrayInputStream("".toByteArray()))
    }

    // For ExoPlayer interceptor
    fun shouldBlockStream(url: String): Boolean {
        return isAdRequest(url)
    }
}
