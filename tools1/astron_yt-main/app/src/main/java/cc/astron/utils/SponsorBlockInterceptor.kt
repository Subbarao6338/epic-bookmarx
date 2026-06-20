package cc.astron.utils

import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import okhttp3.Interceptor
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.Response
import java.io.IOException

class SponsorBlockInterceptor : Interceptor {

    data class Segment(val segment: List<Double>) {
        val start: Long get() = (segment[0] * 1000).toLong()
        val end: Long get() = (segment[1] * 1000).toLong()
    }

    private val segments = mutableMapOf<String, List<Segment>>()
    private val client = OkHttpClient()
    private val gson = Gson()

    fun fetchSegments(videoId: String) {
        val url = "https://sponsor.ajay.app/api/skipSegments?videoID=$videoId&category=sponsor"
        val request = Request.Builder().url(url).build()

        client.newCall(request).enqueue(object : okhttp3.Callback {
            override fun onFailure(call: okhttp3.Call, e: IOException) {
                e.printStackTrace()
            }

            override fun onResponse(call: okhttp3.Call, response: Response) {
                response.use {
                    if (!response.isSuccessful) return
                    val body = response.body?.string() ?: return
                    val type = object : TypeToken<List<Segment>>() {}.type
                    val fetchedSegments: List<Segment> = gson.fromJson(body, type)
                    segments[videoId] = fetchedSegments
                }
            }
        })
    }

    override fun intercept(chain: Interceptor.Chain): Response {
        val request = chain.request()
        val url = request.url.toString()

        // This is where we would intercept requests if SponsorBlock needed to modify them
        return chain.proceed(request)
    }

    fun getSegmentsForVideo(videoId: String): List<Segment> {
        return segments[videoId] ?: emptyList()
    }
}
