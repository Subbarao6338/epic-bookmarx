package com.nsocial.app;

import android.Manifest;
import android.app.DownloadManager;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.webkit.CookieManager;
import android.webkit.JavascriptInterface;
import android.webkit.JsPromptResult;
import android.webkit.URLUtil;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.EditText;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.android.material.color.DynamicColors;
import android.widget.PopupMenu;
import android.view.MenuItem;
import android.util.Log;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.List;
import java.util.HashSet;
import java.util.Set;

public class MainActivity extends AppCompatActivity {

    private WebView webView;
    private static final int PERMISSION_REQUEST_CODE = 100;
    private String pendingDownloadUrl;
    private String pendingUserAgent;
    private String pendingContentDisposition;
    private String pendingMimetype;

    private static final List<String> AD_HOSTS = Arrays.asList(
            "googleads.g.doubleclick.net",
            "adservice.google.com",
            "pagead2.googlesyndication.com",
            "static.doubleclick.net",
            "ad.doubleclick.net"
    );

    private String currentProfile = "default";
    private SharedPreferences profilePrefs;
    private SharedPreferences categoryPrefs;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        DynamicColors.applyToActivityIfAvailable(this);
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        profilePrefs = getSharedPreferences("profiles", MODE_PRIVATE);
        categoryPrefs = getSharedPreferences("categories", MODE_PRIVATE);
        currentProfile = profilePrefs.getString("current_profile", "default");

        webView = findViewById(R.id.webView);
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setDatabaseEnabled(true);
        webSettings.setAllowFileAccess(false);
        webSettings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        webSettings.setUserAgentString("Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36");

        webView.addJavascriptInterface(new Object() {
            @JavascriptInterface
            public void saveToCategory(String url, String category) {
                Set<String> posts = new HashSet<>(categoryPrefs.getStringSet(category, new HashSet<>()));
                posts.add(url);
                categoryPrefs.edit().putStringSet(category, posts).apply();
                runOnUiThread(() -> Toast.makeText(MainActivity.this, "Saved to " + category, Toast.LENGTH_SHORT).show());
            }

            @JavascriptInterface
            public void downloadMedia(String url, String filename) {
                runOnUiThread(() -> {
                    String userAgent = webView.getSettings().getUserAgentString();
                    downloadFile(url, userAgent, null, null);
                });
            }
        }, "AndroidBridge");

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                view.loadUrl(url);
                return true;
            }

            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                String url = request.getUrl().toString();
                for (String adHost : AD_HOSTS) {
                    if (url.contains(adHost)) {
                        return new WebResourceResponse("text/plain", "UTF-8", new ByteArrayInputStream("".getBytes()));
                    }
                }
                return super.shouldInterceptRequest(view, request);
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                if (url.contains("instagram.com")) {
                    injectJS("ig_categories.js");
                }
            }
        });

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onJsPrompt(WebView view, String url, String message, String defaultValue, JsPromptResult result) {
                final EditText input = new EditText(MainActivity.this);
                input.setText(defaultValue);
                new AlertDialog.Builder(MainActivity.this)
                        .setTitle("NSocial")
                        .setMessage(message)
                        .setView(input)
                        .setPositiveButton("OK", (dialog, which) -> result.confirm(input.getText().toString()))
                        .setNegativeButton("Cancel", (dialog, which) -> result.cancel())
                        .show();
                return true;
            }
        });

        webView.setDownloadListener((url, userAgent, contentDisposition, mimetype, contentLength) -> {
            if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.S_V2 &&
                    ContextCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
                pendingDownloadUrl = url;
                pendingUserAgent = userAgent;
                pendingContentDisposition = contentDisposition;
                pendingMimetype = mimetype;
                ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE}, PERMISSION_REQUEST_CODE);
            } else {
                downloadFile(url, userAgent, contentDisposition, mimetype);
            }
        });

        BottomNavigationView bottomNavigation = findViewById(R.id.bottomNavigation);
        bottomNavigation.setOnItemSelectedListener(item -> {
            int itemId = item.getItemId();
            if (itemId == R.id.nav_instagram) {
                webView.loadUrl("https://www.instagram.com");
                return true;
            } else if (itemId == R.id.nav_facebook) {
                webView.loadUrl("https://www.facebook.com");
                return true;
            } else if (itemId == R.id.nav_twitter) {
                webView.loadUrl("https://www.twitter.com");
                return true;
            } else if (itemId == R.id.nav_pinterest) {
                webView.loadUrl("https://www.pinterest.com");
                return true;
            } else if (itemId == R.id.nav_more) {
                showMoreMenu(findViewById(R.id.nav_more));
                return true;
            }
            return false;
        });

        // Load cookies for the current profile
        restoreCookies(currentProfile, "https://www.instagram.com");
        webView.loadUrl("https://www.instagram.com");
    }

    private void downloadFile(String url, String userAgent, String contentDisposition, String mimetype) {
        DownloadManager.Request request = new DownloadManager.Request(Uri.parse(url));
        request.setMimeType(mimetype);
        String cookies = CookieManager.getInstance().getCookie(url);
        request.addRequestHeader("cookie", cookies);
        request.addRequestHeader("User-Agent", userAgent);
        request.setDescription("Downloading file...");
        request.setTitle(URLUtil.guessFileName(url, contentDisposition, mimetype));
        request.allowScanningByMediaScanner();
        request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
        request.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, URLUtil.guessFileName(url, contentDisposition, mimetype));

        DownloadManager dm = (DownloadManager) getSystemService(DOWNLOAD_SERVICE);
        dm.enqueue(request);
        Toast.makeText(getApplicationContext(), "Downloading File", Toast.LENGTH_LONG).show();
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == PERMISSION_REQUEST_CODE) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                if (pendingDownloadUrl != null) {
                    downloadFile(pendingDownloadUrl, pendingUserAgent, pendingContentDisposition, pendingMimetype);
                }
            } else {
                Toast.makeText(this, "Permission Denied", Toast.LENGTH_SHORT).show();
            }
        }
    }

    private void injectJS(String fileName) {
        try {
            BufferedReader reader = new BufferedReader(new InputStreamReader(getAssets().open(fileName)));
            StringBuilder script = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                script.append(line).append("\n");
            }
            reader.close();
            webView.evaluateJavascript(script.toString(), null);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void showMoreMenu(android.view.View view) {
        PopupMenu popup = new PopupMenu(this, view);
        popup.getMenu().add(0, 1, 0, "Messenger");
        popup.getMenu().add(0, 2, 0, "Threads");
        popup.getMenu().add(0, 3, 0, "Telegram");
        popup.getMenu().add(0, 4, 0, "WhatsApp");
        popup.getMenu().add(0, 10, 0, "Switch Account (" + currentProfile + ")");
        popup.getMenu().add(0, 20, 0, "Saved Categories");

        popup.setOnMenuItemClickListener(item -> {
            switch (item.getItemId()) {
                case 1:
                    webView.loadUrl("https://www.messenger.com");
                    return true;
                case 2:
                    webView.loadUrl("https://www.threads.net");
                    return true;
                case 3:
                    webView.loadUrl("https://web.telegram.org");
                    return true;
                case 4:
                    webView.loadUrl("https://web.whatsapp.com");
                    return true;
                case 10:
                    showAccountSwitcher();
                    return true;
                case 20:
                    showSavedCategories();
                    return true;
            }
            return false;
        });
        popup.show();
    }

    private void showSavedCategories() {
        Set<String> categories = categoryPrefs.getAll().keySet();
        if (categories.isEmpty()) {
            Toast.makeText(this, "No saved categories yet", Toast.LENGTH_SHORT).show();
            return;
        }
        PopupMenu popup = new PopupMenu(this, findViewById(R.id.nav_more));
        int i = 0;
        for (String cat : categories) {
            popup.getMenu().add(0, i++, 0, cat);
        }
        popup.setOnMenuItemClickListener(item -> {
            String category = item.getTitle().toString();
            Set<String> posts = categoryPrefs.getStringSet(category, new HashSet<>());
            if (!posts.isEmpty()) {
                // Show a dialog to pick a post from this category
                String[] items = posts.toArray(new String[0]);
                new AlertDialog.Builder(this)
                        .setTitle(category)
                        .setItems(items, (dialog, which) -> webView.loadUrl(items[which]))
                        .show();
            }
            return true;
        });
        popup.show();
    }

    private void showAccountSwitcher() {
        PopupMenu popup = new PopupMenu(this, findViewById(R.id.nav_more));
        popup.getMenu().add(0, 1, 0, "Default Profile");
        popup.getMenu().add(0, 2, 0, "Profile 2");
        popup.getMenu().add(0, 3, 0, "Profile 3");
        popup.getMenu().add(0, 4, 0, "Clear Current Cookies");

        popup.setOnMenuItemClickListener(item -> {
            switch (item.getItemId()) {
                case 1:
                    switchProfile("default");
                    return true;
                case 2:
                    switchProfile("profile2");
                    return true;
                case 3:
                    switchProfile("profile3");
                    return true;
                case 4:
                    CookieManager.getInstance().removeAllCookies(value -> webView.reload());
                    return true;
            }
            return false;
        });
        popup.show();
    }

    private void switchProfile(String profileName) {
        if (currentProfile.equals(profileName)) return;

        saveCookies(currentProfile);
        currentProfile = profileName;
        profilePrefs.edit().putString("current_profile", currentProfile).apply();

        String currentUrl = webView.getUrl();
        CookieManager.getInstance().removeAllCookies(value -> {
            restoreCookies(currentProfile, currentUrl);
            webView.reload();
            Toast.makeText(MainActivity.this, "Switched to " + profileName, Toast.LENGTH_SHORT).show();
        });
    }

    private void saveCookies(String profileName) {
        String url = webView.getUrl();
        if (url == null) return;
        String cookies = CookieManager.getInstance().getCookie(url);
        profilePrefs.edit().putString("cookies_" + profileName, cookies).apply();
    }

    private void restoreCookies(String profileName, String url) {
        if (url == null) return;
        String cookies = profilePrefs.getString("cookies_" + profileName, null);
        if (cookies != null) {
            String[] cookieArray = cookies.split(";");
            for (String cookie : cookieArray) {
                CookieManager.getInstance().setCookie(url, cookie);
            }
        }
    }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    protected void onPause() {
        super.onPause();
        saveCookies(currentProfile);
    }
}
