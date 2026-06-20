package cc.astron.utils

import okhttp3.Interceptor
import okhttp3.Response
import okhttp3.Protocol
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.ResponseBody.Companion.toResponseBody

class AdBlockInterceptor : Interceptor {
    private val adBlocker = AdBlocker()

    override fun intercept(chain: Interceptor.Chain): Response {
        val request = chain.request()
        val url = request.url.toString()

        if (adBlocker.isAdRequest(url)) {
            return Response.Builder()
                .request(request)
                .protocol(Protocol.HTTP_1_1)
                .code(204) // No Content
                .message("Blocked by ASTRON")
                .body("".toResponseBody("text/plain".toMediaTypeOrNull()))
                .build()
        }

        return chain.proceed(request)
    }
}
