package com.ntube

import android.annotation.SuppressLint
import android.app.DownloadManager
import android.app.PictureInPictureParams
import android.content.Context
import android.content.Intent
import android.graphics.Bitmap
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.Environment
import android.view.View
import android.webkit.CookieManager
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.URLUtil
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import com.ntube.databinding.ActivityMainBinding
import com.google.android.material.color.DynamicColors

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        ThemeHelper.applyTheme(this)
        DynamicColors.applyToActivityIfAvailable(this)
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupWebView()
        setupBottomNavigation()
        setupToolbar()

        binding.fabAction.setOnClickListener {
            showActionDialog()
        }

        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (binding.webView.canGoBack()) {
                    binding.webView.goBack()
                } else {
                    isEnabled = false
                    onBackPressedDispatcher.onBackPressed()
                }
            }
        })

        startNotificationService()
    }

    private fun startNotificationService() {
        val intent = Intent(this, NotificationService::class.java)
        startService(intent)
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun setupWebView() {
        CookieManager.getInstance().setAcceptCookie(true)
        CookieManager.getInstance().setAcceptThirdPartyCookies(binding.webView, true)

        binding.webView.apply {
            settings.apply {
                javaScriptEnabled = true
                domStorageEnabled = true
                databaseEnabled = true
                mediaPlaybackRequiresUserGesture = false
                cacheMode = WebSettings.LOAD_DEFAULT
                userAgentString = "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36"
            }
            webViewClient = object : WebViewClient() {
                override fun onPageStarted(view: WebView?, url: String?, favicon: Bitmap?) {
                    super.onPageStarted(view, url, favicon)
                    binding.progressBar.visibility = View.VISIBLE
                }

                override fun onPageFinished(view: WebView?, url: String?) {
                    super.onPageFinished(view, url)
                    binding.progressBar.visibility = View.GONE
                    injectAdBlocker()
                }

                override fun onReceivedError(
                    view: WebView?,
                    request: WebResourceRequest?,
                    error: WebResourceError?
                ) {
                    super.onReceivedError(view, request, error)
                    Toast.makeText(this@MainActivity, "Error loading page: ${error?.description}", Toast.LENGTH_SHORT).show()
                }
            }
            setDownloadListener { url, userAgent, contentDisposition, mimetype, contentLength ->
                val request = DownloadManager.Request(Uri.parse(url))
                val cookie = CookieManager.getInstance().getCookie(url)
                request.addRequestHeader("Cookie", cookie)
                request.addRequestHeader("User-Agent", userAgent)
                request.allowScanningByMediaScanner()
                request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED)
                val fileName = URLUtil.guessFileName(url, contentDisposition, mimetype)
                request.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, fileName)

                val dm = getSystemService(Context.DOWNLOAD_SERVICE) as DownloadManager
                dm.enqueue(request)
                Toast.makeText(applicationContext, "Downloading $fileName", Toast.LENGTH_LONG).show()
            }
            loadUrl("https://m.youtube.com")
        }
    }

    private fun setupBottomNavigation() {
        binding.bottomNavigation.setOnItemSelectedListener { item ->
            when (item.itemId) {
                R.id.nav_youtube -> {
                    binding.webView.loadUrl("https://m.youtube.com")
                    true
                }
                R.id.nav_music -> {
                    binding.webView.loadUrl("https://music.youtube.com")
                    true
                }
                else -> false
            }
        }
    }

    private fun setupToolbar() {
        binding.topAppBar.setOnMenuItemClickListener { menuItem ->
            when (menuItem.itemId) {
                R.id.action_notifications -> {
                    binding.webView.loadUrl("https://m.youtube.com/notifications")
                    true
                }
                R.id.action_settings -> {
                    startActivity(Intent(this, SettingsActivity::class.java))
                    true
                }
                else -> false
            }
        }
    }

    private fun showActionDialog() {
        val options = arrayOf("Download Video", "Download Audio", "Save to Playlist")
        AlertDialog.Builder(this)
            .setTitle("Actions")
            .setItems(options) { _, which ->
                when (which) {
                    0 -> downloadMedia(true)
                    1 -> downloadMedia(false)
                    2 -> saveToPlaylist()
                }
            }
            .show()
    }

    private fun downloadMedia(isVideo: Boolean) {
        val currentUrl = binding.webView.url
        if (currentUrl != null && (currentUrl.contains("youtube.com") || currentUrl.contains("youtu.be") || currentUrl.contains("music.youtube.com"))) {
            // Cobalt uses hash fragment for URL in some versions or direct query.
            // Using a simple direct link to the service for user to paste or it might auto-load.
            val downloadUrl = if (isVideo) {
                "https://cobalt.tools"
            } else {
                "https://cobalt.tools"
            }

            // Try to copy to clipboard first for convenience
            val clipboard = getSystemService(Context.CLIPBOARD_SERVICE) as android.content.ClipboardManager
            val clip = android.content.ClipData.newPlainText("video url", currentUrl)
            clipboard.setPrimaryClip(clip)
            Toast.makeText(this, "URL copied to clipboard", Toast.LENGTH_SHORT).show()

            val intent = Intent(Intent.ACTION_VIEW, Uri.parse(downloadUrl))
            startActivity(intent)
        } else {
            Toast.makeText(this, "Please open a YouTube video first", Toast.LENGTH_SHORT).show()
        }
    }

    private fun saveToPlaylist() {
        val js = """
            (function() {
                var selectors = [
                    'button[aria-label="Save to playlist"]',
                    '.ytd-menu-renderer[aria-label="Save to playlist"]',
                    'ytm-playlist-add-to-option-renderer',
                    'button.icon-button[aria-label="Save to playlist"]'
                ];
                var found = false;
                for (var i = 0; i < selectors.length; i++) {
                    var el = document.querySelector(selectors[i]);
                    if (el) {
                        el.click();
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    var buttons = document.querySelectorAll('button, ytm-button-renderer, .player-control-button');
                    for (var i = 0; i < buttons.length; i++) {
                        var text = buttons[i].innerText || buttons[i].getAttribute('aria-label') || "";
                        if (text.toLowerCase().includes('save')) {
                            buttons[i].click();
                            found = true;
                            break;
                        }
                    }
                }
                return found;
            })();
        """.trimIndent()
        binding.webView.evaluateJavascript(js) { result ->
            if (result == "false") {
                Toast.makeText(this, "Save button not found. Try opening the menu first.", Toast.LENGTH_SHORT).show()
            } else {
                Toast.makeText(this, "Attempting to save to playlist...", Toast.LENGTH_SHORT).show()
            }
        }
    }

    override fun onUserLeaveHint() {
        super.onUserLeaveHint()
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val currentUrl = binding.webView.url
            if (currentUrl != null && (currentUrl.contains("watch") || currentUrl.contains("music.youtube.com"))) {
                enterPictureInPictureMode(PictureInPictureParams.Builder().build())
            }
        }
    }

    private fun injectAdBlocker() {
        // Basic CSS and JS injection to hide/skip ads
        val js = """
            (function() {
                if (window.adBlockerInjected) return;
                window.adBlockerInjected = true;

                var style = document.createElement('style');
                style.innerHTML = `
                    .ad-container, .ad-div, .video-ads, .ytp-ad-progress-list,
                    .ytp-ad-overlay-container, .ytp-ad-message-container,
                    #player-ads, ytd-ad-slot-renderer,
                    ytm-promoted-sparkles-web-renderer, ytm-promoted-video-renderer,
                    .ytp-ad-player-overlay, .ytp-ad-image-overlay {
                        display: none !important;
                    }
                `;
                document.head.appendChild(style);

                var skipAds = function() {
                    var skipButton = document.querySelector('.ytp-ad-skip-button, .ytp-ad-skip-button-modern, .ytp-ad-skip-button-slot');
                    if (skipButton) {
                        skipButton.click();
                    }
                    var video = document.querySelector('video');
                    if (video && (document.querySelector('.ad-showing') || document.querySelector('.ad-interrupting'))) {
                        if (isFinite(video.duration)) {
                            video.currentTime = video.duration;
                        }
                    }
                };

                setInterval(skipAds, 500);
            })();
        """.trimIndent()
        binding.webView.evaluateJavascript(js, null)
    }

}
