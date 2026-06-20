package cc.astron.ui

import android.annotation.SuppressLint
import android.os.Bundle
import android.webkit.CookieManager
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity
import cc.astron.model.Account
import cc.astron.utils.PreferenceManager
import java.util.UUID

class LoginActivity : AppCompatActivity() {

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val webView = WebView(this)
        setContentView(webView)

        webView.settings.javaScriptEnabled = true
        webView.webViewClient = object : WebViewClient() {
            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                val cookies = CookieManager.getInstance().getCookie(url)
                if (cookies != null && cookies.contains("SAPISID")) {
                    // This is a sign that the user is logged in
                    handleLoginSuccess(cookies)
                }
            }
        }

        webView.loadUrl("https://accounts.google.com/ServiceLogin?service=youtube")
    }

    private fun handleLoginSuccess(cookies: String) {
        val preferenceManager = PreferenceManager(this)
        val newId = UUID.randomUUID().toString()
        // Mock account data from captured cookies (in real app, use API)
        val name = cookies.split(";").find { it.trim().startsWith("display_name=") }?.split("=")?.get(1) ?: "YouTube User"
        val email = cookies.split(";").find { it.trim().startsWith("email=") }?.split("=")?.get(1) ?: "user@youtube.com"

        val account = Account(newId, name, email, cookies)

        preferenceManager.addAccount(account)
        preferenceManager.setCookies(newId, cookies)
        preferenceManager.setUserLoggedIn(true)
        preferenceManager.setActiveAccountId(newId)
        finish()
    }
}
