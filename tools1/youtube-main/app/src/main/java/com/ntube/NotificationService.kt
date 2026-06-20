package com.ntube

import android.annotation.SuppressLint
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import android.webkit.CookieManager
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.core.app.NotificationCompat

class NotificationService : Service() {

    private val handler = Handler(Looper.getMainLooper())
    private val CHANNEL_ID = "ntube_notifications"
    private var hiddenWebView: WebView? = null
    private var lastNotificationCount = -1

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
        setupHiddenWebView()
        startPolling()
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val name = "Ntube Notifications"
            val descriptionText = "YouTube Notifications"
            val importance = NotificationManager.IMPORTANCE_DEFAULT
            val channel = NotificationChannel(CHANNEL_ID, name, importance).apply {
                description = descriptionText
            }
            val notificationManager: NotificationManager =
                getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.createNotificationChannel(channel)
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun setupHiddenWebView() {
        hiddenWebView = WebView(this).apply {
            settings.javaScriptEnabled = true
            settings.domStorageEnabled = true
            webViewClient = object : WebViewClient() {
                override fun onPageFinished(view: WebView?, url: String?) {
                    super.onPageFinished(view, url)
                    checkNotifications()
                }
            }
        }
    }

    private fun startPolling() {
        handler.postDelayed(object : Runnable {
            override fun run() {
                hiddenWebView?.loadUrl("https://m.youtube.com/notifications")
                handler.postDelayed(this, 300000) // Poll every 5 minutes
            }
        }, 10000)
    }

    private fun checkNotifications() {
        // Simple scraper to check for new notifications
        val js = """
            (function() {
                var items = document.querySelectorAll('ytm-notification-renderer');
                return items.length;
            })();
        """.trimIndent()
        hiddenWebView?.evaluateJavascript(js) { result ->
            val count = result.toIntOrNull() ?: 0
            if (lastNotificationCount != -1 && count > lastNotificationCount) {
                showNotification("New YouTube Notification", "You have new notifications on YouTube.")
            }
            lastNotificationCount = count
        }
    }

    private fun showNotification(title: String, message: String) {
        val builder = NotificationCompat.Builder(this, CHANNEL_ID)
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setContentTitle(title)
            .setContentText(message)
            .setPriority(NotificationCompat.PRIORITY_DEFAULT)
            .setAutoCancel(true)

        val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        notificationManager.notify(System.currentTimeMillis().toInt(), builder.build())
    }

    override fun onBind(intent: Intent?): IBinder? {
        return null
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        return START_STICKY
    }

    override fun onDestroy() {
        hiddenWebView?.destroy()
        super.onDestroy()
    }
}
