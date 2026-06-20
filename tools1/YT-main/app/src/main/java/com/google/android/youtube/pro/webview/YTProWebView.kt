package com.google.android.youtube.pro.webview

import android.content.Context
import android.util.AttributeSet
import android.view.View
import android.webkit.WebView

open class YTProWebView : WebView {

    constructor(context: Context) : super(context)
    constructor(context: Context, attrs: AttributeSet?) : super(context, attrs)
    constructor(context: Context, attrs: AttributeSet?, defStyleAttr: Int) : super(context, attrs, defStyleAttr)

    override fun onWindowVisibilityChanged(visibility: Int) {
        val prefs = context.getSharedPreferences("YTPRO", Context.MODE_PRIVATE)
        val bgPlay = prefs.getBoolean("bgplay", false)

        if (visibility != View.GONE && visibility != View.INVISIBLE || !bgPlay) {
            super.onWindowVisibilityChanged(visibility)
        }
    }
}
