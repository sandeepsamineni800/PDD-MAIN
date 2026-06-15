package com.corescheduler.app

import android.annotation.SuppressLint
import android.os.Bundle
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webview)

        // Enable Javascript and DOM Storage for Next.js to work properly
        val webSettings: WebSettings = webView.settings
        webSettings.javaScriptEnabled = true
        webSettings.domStorageEnabled = true
        
        // Force links and redirects to open in the WebView instead of the device browser
        webView.webViewClient = WebViewClient()
        webView.webChromeClient = WebChromeClient()

        // TODO: REPLACE THIS URL WITH YOUR LIVE DEPLOYED RENDER OR VERCEL URL
        val appUrl = "https://your-scheduler-app.onrender.com"
        
        webView.loadUrl(appUrl)
    }

    // Handle back button press to navigate back within the WebView
    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }
}
