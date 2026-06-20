package cc.astron.ui.player

import android.app.PictureInPictureParams
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.ServiceConnection
import android.content.res.Configuration
import android.os.Build
import android.os.Bundle
import android.os.IBinder
import android.util.Rational
import android.view.View
import android.widget.ImageButton
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import cc.astron.R
import cc.astron.utils.AdBlockInterceptor
import com.google.android.exoplayer2.ExoPlayer
import com.google.android.exoplayer2.MediaItem
import com.google.android.exoplayer2.Player
import com.google.android.exoplayer2.ext.okhttp.OkHttpDataSource
import com.google.android.exoplayer2.source.DefaultMediaSourceFactory
import com.google.android.exoplayer2.ui.StyledPlayerView
import okhttp3.OkHttpClient

class PlayerActivity : AppCompatActivity() {

    private var player: ExoPlayer? = null
    private var playbackService: PlaybackService? = null
    private var isBound = false

    private val connection = object : ServiceConnection {
        override fun onServiceConnected(name: ComponentName?, service: IBinder?) {
            val binder = service as PlaybackService.LocalBinder
            playbackService = binder.getService()
            playbackService?.player = player
            isBound = true
        }

        override fun onServiceDisconnected(name: ComponentName?) {
            isBound = false
        }
    }
    private lateinit var streamController: StreamController
    private lateinit var subtitleController: SubtitleController
    private val sponsorBlockInterceptor = cc.astron.utils.SponsorBlockInterceptor()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_player)

        val intent = Intent(this, PlaybackService::class.java)
        startService(intent)
        bindService(intent, connection, Context.BIND_AUTO_CREATE)

        val playerView: StyledPlayerView = findViewById(R.id.player_view)

        val okHttpClient = OkHttpClient.Builder()
            .addInterceptor(AdBlockInterceptor())
            .build()

        val dataSourceFactory = OkHttpDataSource.Factory(okHttpClient)
        val mediaSourceFactory = DefaultMediaSourceFactory(dataSourceFactory)

        player = ExoPlayer.Builder(this)
            .setMediaSourceFactory(mediaSourceFactory)
            .build()

        playerView.player = player

        streamController = StreamController(player!!)
        subtitleController = SubtitleController(this, player!!)

        findViewById<ImageButton>(R.id.btn_playlist).setOnClickListener { showPlaylistDialog() }
        findViewById<ImageButton>(R.id.btn_subtitles).setOnClickListener { showSubtitleDialog() }
        findViewById<ImageButton>(R.id.btn_settings).setOnClickListener { showSettingsDialog() }

        val mediaItem = MediaItem.fromUri("https://storage.googleapis.com/exoplayer-test-media-0/BigBuckBunny/Relo/master.m3u8")
        player?.setMediaItem(mediaItem)
        player?.prepare()
        player?.playWhenReady = true

        streamController.bypassQualityRestrictions()
        setupSponsorBlock()
    }

    override fun onUserLeaveHint() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val params = PictureInPictureParams.Builder()
                .setAspectRatio(Rational(16, 9))
                .build()
            enterPictureInPictureMode(params)
        }
    }

    override fun onPictureInPictureModeChanged(
        isInPictureInPictureMode: Boolean,
        newConfig: Configuration
    ) {
        super.onPictureInPictureModeChanged(isInPictureInPictureMode, newConfig)
        val controls = listOf(R.id.btn_playlist, R.id.btn_subtitles, R.id.btn_settings)
        controls.forEach { id ->
            findViewById<View>(id).visibility = if (isInPictureInPictureMode) View.GONE else View.VISIBLE
        }
    }

    private fun setupSponsorBlock() {
        sponsorBlockInterceptor.fetchSegments("demo_video_id")

        player?.addListener(object : Player.Listener {
            override fun onPositionDiscontinuity(
                oldPosition: Player.PositionInfo,
                newPosition: Player.PositionInfo,
                reason: Int
            ) {
                checkSponsorSegments()
            }

            override fun onEvents(player: Player, events: Player.Events) {
                if (events.contains(Player.EVENT_PLAYBACK_STATE_CHANGED) || events.contains(Player.EVENT_IS_PLAYING_CHANGED)) {
                    checkSponsorSegments()
                }
            }
        })

        // Periodic check every second
        val mainHandler = android.os.Handler(android.os.Looper.getMainLooper())
        mainHandler.post(object : Runnable {
            override fun run() {
                checkSponsorSegments()
                mainHandler.postDelayed(this, 1000)
            }
        })
    }

    private fun checkSponsorSegments() {
        val currentPos = player?.currentPosition ?: return
        val segments = sponsorBlockInterceptor.getSegmentsForVideo("demo_video_id")
        for (segment in segments) {
            if (currentPos in segment.start until segment.end) {
                player?.seekTo(segment.end)
                // Optionally show a toast: Toast.makeText(this, "Sponsor skipped", Toast.LENGTH_SHORT).show()
                break
            }
        }
    }

    private fun showPlaylistDialog() {
        val options = arrayOf("Favorites", "Watch Later", "New Playlist...")
        AlertDialog.Builder(this)
            .setTitle("Add to Playlist")
            .setItems(options) { _, which ->
                // Handle playlist selection
            }
            .show()
    }

    private fun showSubtitleDialog() {
        val options = arrayOf("English", "Spanish", "Off")
        AlertDialog.Builder(this)
            .setTitle("Subtitles")
            .setItems(options) { _, which ->
                subtitleController.toggleSubtitles(which != 2)
            }
            .show()
    }

    private fun showSettingsDialog() {
        val options = arrayOf("Quality (1080p)", "Audio Language (English)")
        AlertDialog.Builder(this)
            .setTitle("Settings")
            .setItems(options) { _, which ->
                if (which == 0) showQualityDialog() else showAudioDialog()
            }
            .show()
    }

    private fun showQualityDialog() {
        val options = arrayOf("1080p", "720p", "480p", "Auto")
        AlertDialog.Builder(this)
            .setTitle("Quality")
            .setItems(options) { _, which ->
                val res = when(which) {
                    0 -> 1080; 1 -> 720; 2 -> 480; else -> Int.MAX_VALUE
                }
                streamController.setVideoQuality(res)
            }
            .show()
    }

    private fun showAudioDialog() {
        val options = arrayOf("English", "Spanish", "Japanese")
        AlertDialog.Builder(this)
            .setTitle("Audio Language")
            .setItems(options) { _, which ->
                val lang = when(which) {
                    0 -> "en"; 1 -> "es"; else -> "ja"
                }
                streamController.setAudioLanguage(lang)
            }
            .show()
    }

    override fun onDestroy() {
        super.onDestroy()
        if (isBound) {
            unbindService(connection)
            isBound = false
        }
        // Player should probably be managed by service if we want true background play
        // For now, keeping simple release
        player?.release()
        player = null
    }
}
