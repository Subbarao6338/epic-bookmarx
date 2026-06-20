package cc.astron.utils

class InnerTubeResolver {

    enum class ClientType {
        ANDROID, ANDROID_TV, IOS, WEB
    }

    fun getRequestHeaders(clientType: ClientType): Map<String, String> {
        val headers = mutableMapOf<String, String>()
        headers["User-Agent"] = when (clientType) {
            ClientType.ANDROID -> "com.google.android.youtube/19.05.36 (Linux; U; Android 14; en_US) gzip"
            ClientType.ANDROID_TV -> "com.google.android.youtube.tv/4.10.001 (Linux; U; Android 12; en_US) gzip"
            ClientType.IOS -> "com.google.ios.youtube/19.05.2 (iPhone16,2; U; CPU iOS 17_3 like Mac OS X; en_US)"
            ClientType.WEB -> "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
        }
        headers["X-Goog-Api-Format-Version"] = "2"
        return headers
    }

    fun getClientPayload(clientType: ClientType): String {
        // Simplified InnerTube context payload
        return when (clientType) {
            ClientType.ANDROID_TV -> "{\"context\":{\"client\":{\"clientName\":\"ANDROID_TV\",\"clientVersion\":\"4.10.001\"}}}"
            else -> "{\"context\":{\"client\":{\"clientName\":\"ANDROID\",\"clientVersion\":\"19.05.36\"}}}"
        }
    }
}
