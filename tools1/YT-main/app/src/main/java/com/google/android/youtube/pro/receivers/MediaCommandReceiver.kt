package com.google.android.youtube.pro.receivers

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log
import com.google.android.youtube.pro.webview.YTProWebView

class MediaCommandReceiver(private val web: YTProWebView) : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        val extras = intent.extras ?: return

        val action = extras.getString("actionname")
        Log.e("Action MainActivity", action ?: "null")

        when (action) {
            "PLAY_ACTION" -> web.evaluateJavascript("playVideo();", null)
            "PAUSE_ACTION" -> web.evaluateJavascript("pauseVideo();", null)
            "NEXT_ACTION" -> web.evaluateJavascript("playNext();", null)
            "PREV_ACTION" -> web.evaluateJavascript("playPrev();", null)
            "SEEKTO" -> web.evaluateJavascript("seekTo('${extras.getString("pos")}');", null)
        }
    }
}
