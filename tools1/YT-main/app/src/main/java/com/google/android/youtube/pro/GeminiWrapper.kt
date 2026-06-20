package com.google.android.youtube.pro

import android.util.Log
import org.json.JSONException
import org.json.JSONObject
import java.io.BufferedReader
import java.io.InputStreamReader
import java.io.OutputStream
import java.net.HttpURLConnection
import java.net.URL
import java.util.regex.Pattern

object GeminiWrapper {

    private const val GEMINI_URL = "https://gemini.google.com/app"

    @JvmStatic
    fun getStream(url: String, headers: String, body: String): JSONObject {
        return try {
            val connection = URL(url).openConnection() as HttpURLConnection
            connection.requestMethod = "POST"

            try {
                val headersObj = JSONObject(headers)
                val keys = headersObj.keys()
                while (keys.hasNext()) {
                    val key = keys.next()
                    val value = headersObj.get(key).toString()
                    connection.setRequestProperty(key, value)
                }
            } catch (e: JSONException) {
                Log.e("GeminiWrapper", "Error parsing headers", e)
                return JSONObject()
            }

            connection.doOutput = true
            connection.outputStream.use { os ->
                os.write(body.toByteArray())
            }

            val responseCode = connection.responseCode
            if (responseCode != HttpURLConnection.HTTP_OK) {
                val errorStream = connection.errorStream
                val errorMessage = errorStream?.bufferedReader()?.use { it.readText() } ?: "No error details"
                Log.e("GeminiWrapper", "HTTP error in getStream: $responseCode - $errorMessage")
                return JSONObject().apply {
                    put("error", "HTTP error $responseCode")
                    put("details", errorMessage)
                }
            }

            readResponse(connection)
        } catch (e: Exception) {
            Log.e("GeminiWrapper", "Error in getStream", e)
            return JSONObject()
        }
    }

    private fun readResponse(connection: HttpURLConnection): JSONObject {
        return try {
            val reader = BufferedReader(InputStreamReader(connection.inputStream))
            val response = StringBuilder()
            var line: String?
            while (reader.readLine().also { line = it } != null) {
                response.append(line).append("\n")
            }
            reader.close()

            JSONObject().apply {
                put("stream", response.toString())
            }
        } catch (e: Exception) {
            Log.e("GeminiWrapper", "Error reading response", e)
            JSONObject()
        }
    }

    @JvmStatic
    fun getSNlM0e(cookies: String): String {
        return try {
            val connection = URL(GEMINI_URL).openConnection() as HttpURLConnection
            connection.requestMethod = "GET"
            connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded;charset=utf-8")
            connection.setRequestProperty(
                "User-Agent",
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            )
            connection.setRequestProperty("Origin", "https://gemini.google.com")
            connection.setRequestProperty("Referer", "https://gemini.google.com")
            connection.setRequestProperty("X-Same-Domain", "1")
            connection.setRequestProperty("Cookie", cookies)

            val responseCode = connection.responseCode
            if (responseCode != HttpURLConnection.HTTP_OK) {
                val errorStream = connection.errorStream
                val errorMessage = errorStream?.bufferedReader()?.use { it.readText() } ?: "No error details"
                Log.e("GeminiWrapper", "HTTP error in getSNlM0e: $responseCode - $errorMessage")
                return "error"
            }

            val reader = BufferedReader(InputStreamReader(connection.inputStream))
            val response = StringBuilder()
            var line: String?
            while (reader.readLine().also { line = it } != null) {
                response.append(line)
            }
            reader.close()

            val matcher = Pattern.compile("\"SNlM0e\":\"(.*?)\"").matcher(response.toString())
            if (matcher.find()) matcher.group(1) ?: "error" else "error"
        } catch (e: Exception) {
            Log.e("GeminiWrapper", "Error in getSNlM0e", e)
            "error"
        }
    }
}
