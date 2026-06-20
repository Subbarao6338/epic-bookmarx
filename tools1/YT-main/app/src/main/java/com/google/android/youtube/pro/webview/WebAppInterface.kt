package com.google.android.youtube.pro.webview

import android.Manifest
import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.PictureInPictureParams
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.media.AudioManager
import android.net.Uri
import android.os.Build
import android.os.Environment
import android.provider.Settings
import android.util.Rational
import android.view.WindowManager
import android.webkit.CookieManager
import android.webkit.JavascriptInterface
import android.widget.Toast
import androidx.webkit.WebViewFeature
import com.google.android.youtube.pro.ForegroundService
import com.google.android.youtube.pro.GeminiWrapper
import com.google.android.youtube.pro.MainActivity
import com.google.android.youtube.pro.R
import com.google.android.youtube.pro.utils.DownloadUtils
import com.google.android.youtube.pro.utils.MediaMuxerUtils
import org.json.JSONObject
import java.io.File

class WebAppInterface(private val activity: MainActivity, private val web: YTProWebView) {
    private val audioManager: AudioManager = activity.getSystemService(Context.AUDIO_SERVICE) as AudioManager

    private var icon = ""
    private var title = ""
    private var subtitle = ""
    private var duration: Long = 0

    @JavascriptInterface
    fun showToast(txt: String) {
        Toast.makeText(activity.applicationContext, txt, Toast.LENGTH_SHORT).show()
    }

    @JavascriptInterface
    fun gohome(x: String) {
        val startMain = Intent(Intent.ACTION_MAIN)
        startMain.addCategory(Intent.CATEGORY_HOME)
        startMain.flags = Intent.FLAG_ACTIVITY_NEW_TASK
        activity.startActivity(startMain)
    }

    @JavascriptInterface
    fun downvid(name: String, url: String, m: String) {
        DownloadUtils.downloadFile(activity, name, url, m)
    }

    @JavascriptInterface
    fun fullScreen(value: Boolean) {
        activity.portrait = value
    }

    @JavascriptInterface
    fun oplink(url: String) {
        val i = Intent(Intent.ACTION_VIEW)
        i.data = Uri.parse(url)
        activity.startActivity(i)
    }

    @JavascriptInterface
    fun getInfo(): String {
        return try {
            val info = activity.packageManager.getPackageInfo(activity.packageName, 0)
            info.versionName ?: "1.0"
        } catch (e: Exception) {
            "1.0"
        }
    }

    @JavascriptInterface
    fun isWebViewSupported(): Boolean {
        return WebViewFeature.isFeatureSupported(WebViewFeature.WEB_MESSAGE_ARRAY_BUFFER)
    }

    @JavascriptInterface
    fun hasStoragePermission(): Boolean {
        if (Build.VERSION.SDK_INT > 22 && Build.VERSION.SDK_INT < Build.VERSION_CODES.R) {
            val hasWrite = activity.checkSelfPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE) == PackageManager.PERMISSION_GRANTED
            val hasRead = activity.checkSelfPermission(Manifest.permission.READ_EXTERNAL_STORAGE) == PackageManager.PERMISSION_GRANTED
            if (!hasWrite || !hasRead) {
                activity.runOnUiThread { activity.requestStoragePermission?.invoke() }
                return false
            }
            return true
        }
        return true
    }

    @JavascriptInterface
    fun requestBinaryPort(fileName: String) {
        activity.runOnUiThread {
            if (activity.streamManager != null) {
                activity.streamManager!!.openStreamForFile(fileName)
            }
        }
    }

    @JavascriptInterface
    fun muxVideoAudio(videoFileName: String, audioFileName: String, outputFileName: String) {
        val downloads = File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS).absolutePath + "/YTPRO")
        val video = File(downloads, videoFileName)
        val audio = File(downloads, audioFileName)

        val output = File(downloads, outputFileName)

        MediaMuxerUtils.muxVideoAudio(activity.applicationContext, video, audio, output, object : MediaMuxerUtils.MuxCallback {
            override fun onSuccess(output: File) {
                // safe to update UI here — already on main thread
                Toast.makeText(activity, "Done: " + output.name, Toast.LENGTH_SHORT).show()
            }

            override fun onFailure(e: Exception) {
                Toast.makeText(activity, "Failed: " + e.message, Toast.LENGTH_SHORT).show()
            }
        })
    }

    @JavascriptInterface
    fun setBgPlay(bgplay: Boolean) {
        activity.getSharedPreferences("YTPRO", Context.MODE_PRIVATE).edit().putBoolean("bgplay", bgplay).apply()
    }

    @JavascriptInterface
    fun bgStart(iconn: String, titlen: String, subtitlen: String, dura: Long) {
        icon = iconn
        title = titlen
        subtitle = subtitlen
        duration = dura
        activity.isPlaying = true
        activity.mediaSession = true

        val intent = Intent(activity.applicationContext, ForegroundService::class.java)
        intent.putExtra("icon", icon)
        intent.putExtra("title", title)
        intent.putExtra("subtitle", subtitle)
        intent.putExtra("duration", duration)
        intent.putExtra("currentPosition", 0L)
        intent.putExtra("action", "play")
        activity.startService(intent)
    }

    @JavascriptInterface
    fun bgUpdate(iconn: String, titlen: String, subtitlen: String, dura: Long) {
        icon = iconn
        title = titlen
        subtitle = subtitlen
        duration = dura
        activity.isPlaying = true
        sendUpdateBroadcast(0, "pause")
    }

    @JavascriptInterface
    fun bgStop() {
        activity.isPlaying = false
        activity.mediaSession = false
        activity.stopService(Intent(activity.applicationContext, ForegroundService::class.java))
    }

    @JavascriptInterface
    fun bgPause(ct: Long) {
        activity.isPlaying = false
        sendUpdateBroadcast(ct, "pause")
    }

    @JavascriptInterface
    fun bgPlay(ct: Long) {
        activity.isPlaying = true
        sendUpdateBroadcast(ct, "play")
    }

    @JavascriptInterface
    fun bgBuffer(ct: Long) {
        activity.isPlaying = true
        sendUpdateBroadcast(ct, "buffer")
    }

    private fun sendUpdateBroadcast(ct: Long, action: String) {
        activity.sendBroadcast(
            Intent("UPDATE_NOTIFICATION")
                .putExtra("icon", icon).putExtra("title", title)
                .putExtra("subtitle", subtitle).putExtra("duration", duration)
                .putExtra("currentPosition", ct).putExtra("action", action)
        )
    }

    @JavascriptInterface
    fun getSNlM0e(cookies: String) {
        Thread {
            val response = GeminiWrapper.getSNlM0e(cookies)
            activity.runOnUiThread { web.evaluateJavascript("callbackSNlM0e.resolve(`$response`) ", null) }
        }.start()
    }

    @JavascriptInterface
    fun GeminiClient(url: String, headers: String, body: String) {
        Thread {
            val response = GeminiWrapper.getStream(url, headers, body)
            activity.runOnUiThread { web.evaluateJavascript("callbackGeminiClient.resolve($response) ", null) }
        }.start()
    }

    @JavascriptInterface
    fun getAllCookies(url: String): String? {
        return CookieManager.getInstance().getCookie(url)
    }

    @JavascriptInterface
    fun getVolume(): Float {
        val currentVolume = audioManager.getStreamVolume(AudioManager.STREAM_MUSIC)
        val maxVolume = audioManager.getStreamMaxVolume(AudioManager.STREAM_MUSIC)
        return currentVolume.toFloat() / maxVolume
    }

    @JavascriptInterface
    fun setVolume(volume: Float) {
        val max = audioManager.getStreamMaxVolume(AudioManager.STREAM_MUSIC)
        audioManager.setStreamVolume(AudioManager.STREAM_MUSIC, (max * volume).toInt(), 0)
    }

    @JavascriptInterface
    fun getBrightness(): Float {
        return try {
            (Settings.System.getInt(activity.contentResolver, Settings.System.SCREEN_BRIGHTNESS) / 255f) * 100f
        } catch (e: Settings.SettingNotFoundException) {
            50f
        }
    }

    @JavascriptInterface
    fun setBrightness(brightnessValue: Float) {
        activity.runOnUiThread {
            val brightness = Math.max(0f, Math.min(brightnessValue, 1f))
            val layout = activity.window.attributes
            layout.screenBrightness = brightness
            activity.window.attributes = layout
        }
    }

    @JavascriptInterface
    fun pipvid(mode: String) {
        if (Build.VERSION.SDK_INT >= 26) {
            try {
                val params = PictureInPictureParams.Builder()
                    .setAspectRatio(Rational(if (mode == "portrait") 9 else 16, if (mode == "portrait") 16 else 9))
                    .build()
                activity.enterPictureInPictureMode(params)
            } catch (e: Exception) {
                e.printStackTrace()
            }
        } else {
            Toast.makeText(activity, activity.getString(R.string.no_pip), Toast.LENGTH_SHORT).show()
        }
    }

    @JavascriptInterface
    fun showNotification(title: String, message: String) {
        val notificationManager = activity.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        val channelId = "app_notifications"
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(channelId, "App Notifications", NotificationManager.IMPORTANCE_DEFAULT)
            notificationManager.createNotificationChannel(channel)
        }

        val intent = Intent(activity, MainActivity::class.java)
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        val pendingIntent = PendingIntent.getActivity(activity, 0, intent, PendingIntent.FLAG_IMMUTABLE)

        val builder = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            Notification.Builder(activity, channelId)
        } else {
            @Suppress("DEPRECATION")
            Notification.Builder(activity)
        }

        builder.setSmallIcon(R.mipmap.app_icon)
            .setContentTitle(title)
            .setContentText(message)
            .setAutoCancel(true)
            .setContentIntent(pendingIntent)

        notificationManager.notify(System.currentTimeMillis().toInt(), builder.build())
    }
}
