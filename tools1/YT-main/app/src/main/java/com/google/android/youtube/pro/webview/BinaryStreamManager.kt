package com.google.android.youtube.pro.webview

import android.content.ContentValues
import android.content.Context
import android.net.Uri
import android.os.Build
import android.os.Environment
import android.provider.MediaStore
import android.util.Log
import android.widget.Toast
import androidx.webkit.WebMessageCompat
import androidx.webkit.WebMessagePortCompat
import androidx.webkit.WebViewCompat
import androidx.webkit.WebViewFeature
import java.io.File
import java.io.FileOutputStream
import java.io.OutputStream
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.Executors

class BinaryStreamManager(private val webView: YTProWebView, private val context: Context) {

    private val ioExecutor = Executors.newFixedThreadPool(4)

    // API 29+ path: store OutputStreams and their URIs
    private val fileStreams = ConcurrentHashMap<String, OutputStream>()
    private val fileUris = ConcurrentHashMap<String, Uri>()

    // API 21-28 path: keep FileOutputStream separately
    private val legacyStreams = ConcurrentHashMap<String, FileOutputStream>()

    fun openStreamForFile(fileName: String) {
        if (!WebViewFeature.isFeatureSupported(WebViewFeature.WEB_MESSAGE_ARRAY_BUFFER)) {
            Log.e("YTPRO_STREAM", "ArrayBuffer not supported on this device.")
            Toast.makeText(context, "ArrayBuffer not supported on this device.", Toast.LENGTH_SHORT).show()
            return
        }

        val channel = WebViewCompat.createWebMessageChannel(webView)
        val localPort = channel[0]
        val jsPort = channel[1]

        // 1. Open file stream asynchronously
        ioExecutor.execute {
            try {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    // API 29+ — MediaStore, zero permissions needed
                    val resolver = context.contentResolver
                    val values = ContentValues().apply {
                        put(MediaStore.Downloads.DISPLAY_NAME, fileName)
                        put(MediaStore.Downloads.MIME_TYPE, getMimeType(fileName))
                        put(MediaStore.Downloads.RELATIVE_PATH, "Download/YTPRO")
                        put(MediaStore.Downloads.IS_PENDING, 1)
                    }

                    val uri = resolver.insert(MediaStore.Downloads.getContentUri("external"), values)

                    if (uri == null) {
                        Log.e("YTPRO_STREAM", "MediaStore insert returned null for: $fileName")
                        return@execute
                    }

                    val os = resolver.openOutputStream(uri)
                    if (os == null) {
                        Log.e("YTPRO_STREAM", "openOutputStream returned null for: $fileName")
                        return@execute
                    }

                    fileStreams[fileName] = os
                    fileUris[fileName] = uri

                } else {
                    // API 21-28 — direct file access
                    val dir = File(
                        Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS),
                        "YTPRO"
                    )
                    if (!dir.exists()) dir.mkdirs()
                    val file = File(dir, fileName)
                    val fos = FileOutputStream(file, true)
                    legacyStreams[fileName] = fos
                }

                Log.d("YTPRO_STREAM", "Stream opened for: $fileName")

            } catch (e: Exception) {
                Log.e("YTPRO_STREAM", "Failed to open stream: ${e.message}")
            }
        }

        // 2. This port only listens for chunks belonging to THIS file
        localPort.setWebMessageCallback(object : WebMessagePortCompat.WebMessageCallbackCompat() {
            override fun onMessage(port: WebMessagePortCompat, message: WebMessageCompat?) {
                ioExecutor.execute {
                    if (message == null) return@execute
                    if (message.type == WebMessageCompat.TYPE_ARRAY_BUFFER) {
                        try {
                            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                                val os = fileStreams[fileName]
                                os?.write(message.arrayBuffer!!)
                            } else {
                                val fos = legacyStreams[fileName]
                                fos?.write(message.arrayBuffer!!)
                            }
                        } catch (e: Exception) {
                            Log.e("YTPRO_STREAM", "Write failed: ${e.message}")
                        }

                    } else if (message.type == WebMessageCompat.TYPE_STRING
                        && "END" == message.data
                    ) {
                        try {
                            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                                val os = fileStreams.remove(fileName)
                                if (os != null) {
                                    os.flush()
                                    os.close()
                                }
                                // Mark file as visible
                                val uri = fileUris.remove(fileName)
                                if (uri != null) {
                                    val values = ContentValues().apply {
                                        put(MediaStore.Downloads.IS_PENDING, 0)
                                    }
                                    context.contentResolver.update(uri, values, null, null)
                                }
                            } else {
                                val fos = legacyStreams.remove(fileName)
                                if (fos != null) {
                                    fos.flush()
                                    fos.close()
                                }
                            }

                            port.close()
                            Log.d("YTPRO_STREAM", "Stream finished for: $fileName")

                        } catch (e: Exception) {
                            Log.e("YTPRO_STREAM", "Close failed: ${e.message}")
                        }
                    }
                }
            }
        })

        // 3. Send the port back to JS tagged with the filename
        WebViewCompat.postWebMessage(
            webView,
            WebMessageCompat("PORT_FOR:$fileName", arrayOf(jsPort)),
            Uri.EMPTY
        )
    }

    // Returns the Uri for a file already written by this app (for muxer input)
    fun getUriForFile(fileName: String): Uri? {
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            fileUris[fileName]
        } else {
            null
        }
    }

    private fun getMimeType(fileName: String): String {
        return when {
            fileName.endsWith(".webm") -> "video/webm"
            fileName.endsWith(".mp4") -> "video/mp4"
            fileName.endsWith(".m4a") -> "audio/mp4"
            fileName.endsWith(".opus") -> "audio/ogg"
            else -> "application/octet-stream"
        }
    }

    fun cleanup() {
        ioExecutor.shutdown()
    }
}
