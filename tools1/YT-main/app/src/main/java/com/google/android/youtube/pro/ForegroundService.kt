package com.google.android.youtube.pro

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.graphics.drawable.Icon
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.media.MediaMetadata
import android.media.session.MediaSession
import android.media.session.PlaybackState
import android.os.Build
import android.os.IBinder
import android.util.Base64
import android.util.Log
import com.google.android.youtube.pro.receivers.NotificationActionReceiver

class ForegroundService : Service() {

    private var notificationManager: NotificationManager? = null
    private var updateReceiver: BroadcastReceiver? = null
    private var mediaSession: MediaSession? = null

    override fun onCreate() {
        super.onCreate()
        initMediaSession()
        registerUpdateReceiver()
        createNotificationChannel()
    }

    private fun initMediaSession() {
        mediaSession = MediaSession(applicationContext, "YTPROMediaSession").apply {
            setCallback(object : MediaSession.Callback() {
                override fun onPlay() {
                    super.onPlay()
                    applicationContext.sendBroadcast(
                        Intent("TRACKS_TRACKS")
                            .putExtra("actionname", "PLAY_ACTION")
                    )
                    Log.e("pause", "play session called")
                }

                override fun onPause() {
                    super.onPause()
                    applicationContext.sendBroadcast(
                        Intent("TRACKS_TRACKS")
                            .putExtra("actionname", "PAUSE_ACTION")
                    )
                    Log.e("pause", "pause session called")
                }

                override fun onSkipToNext() {
                    super.onSkipToNext()
                    applicationContext.sendBroadcast(
                        Intent("TRACKS_TRACKS")
                            .putExtra("actionname", "NEXT_ACTION")
                    )
                }

                override fun onSkipToPrevious() {
                    super.onSkipToPrevious()
                    applicationContext.sendBroadcast(
                        Intent("TRACKS_TRACKS")
                            .putExtra("actionname", "PREV_ACTION")
                    )
                }

                override fun onSeekTo(pos: Long) {
                    super.onSeekTo(pos)
                    applicationContext.sendBroadcast(
                        Intent("TRACKS_TRACKS")
                            .putExtra("actionname", "SEEKTO")
                            .putExtra("pos", pos.toString())
                    )
                }
            })
            isActive = true
        }
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "Background Play",
                NotificationManager.IMPORTANCE_MIN
            )
            notificationManager = getSystemService(NotificationManager::class.java)
            notificationManager?.createNotificationChannel(channel)
        }
    }

    fun buildNotification(icon: String, title: String, subtitle: String, action: String, duration: Long, currentPosition: Long) {
        val cont = applicationContext

        val decodedBytes = Base64.decode(icon, Base64.DEFAULT)
        val largeIcon = BitmapFactory.decodeByteArray(decodedBytes, 0, decodedBytes.size)

        val playbackState = when (action) {
            "pause" -> PlaybackState.STATE_PAUSED
            "play" -> PlaybackState.STATE_PLAYING
            else -> PlaybackState.STATE_BUFFERING
        }

        updateMediaSessionMetadata(title, subtitle, largeIcon, duration)
        updatePlaybackState(currentPosition, playbackState)

        val openAppIntent = Intent(cont, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP
        }
        val openAppPendingIntent = PendingIntent.getActivity(
            cont, 0, openAppIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val playIntent = Intent(cont, NotificationActionReceiver::class.java).apply { setAction("PLAY_ACTION") }
        val playPendingIntent = PendingIntent.getBroadcast(
            cont, 0, playIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val pauseIntent = Intent(cont, NotificationActionReceiver::class.java).apply { setAction("PAUSE_ACTION") }
        val pausePendingIntent = PendingIntent.getBroadcast(
            cont, 0, pauseIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val nextIntent = Intent(cont, NotificationActionReceiver::class.java).apply { setAction("NEXT_ACTION") }
        val nextPendingIntent = PendingIntent.getBroadcast(
            cont, 0, nextIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val prevIntent = Intent(cont, NotificationActionReceiver::class.java).apply { setAction("PREV_ACTION") }
        val prevPendingIntent = PendingIntent.getBroadcast(
            cont, 0, prevIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val builder = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            Notification.Builder(this, CHANNEL_ID)
        } else {
            @Suppress("DEPRECATION")
            Notification.Builder(this)
        }

        val mediaStyle = Notification.MediaStyle()
            .setMediaSession(mediaSession?.sessionToken)
            .setShowActionsInCompactView(0, 1, 2)

        builder.setSmallIcon(if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) R.drawable.notification else R.mipmap.app_icon)
            .setContentTitle(title)
            .setContentText(subtitle)
            .setLargeIcon(largeIcon)
            .setContentIntent(openAppPendingIntent)
            .setOngoing(action == "play")
            .setOnlyAlertOnce(true)
            .setStyle(mediaStyle)
            .addAction(
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    Notification.Action.Builder(
                        Icon.createWithResource(this, R.drawable.ic_skip_previous_white), "Previous", prevPendingIntent
                    ).build()
                } else {
                    @Suppress("DEPRECATION")
                    Notification.Action.Builder(
                        R.drawable.ic_skip_previous_white, "Previous", prevPendingIntent
                    ).build()
                }
            )

        if (action == "play") {
            builder.addAction(
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    Notification.Action.Builder(
                        Icon.createWithResource(this, R.drawable.ic_pause_white), "Pause", pausePendingIntent
                    ).build()
                } else {
                    @Suppress("DEPRECATION")
                    Notification.Action.Builder(
                        R.drawable.ic_pause_white, "Pause", pausePendingIntent
                    ).build()
                }
            )
        } else {
            builder.addAction(
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    Notification.Action.Builder(
                        Icon.createWithResource(this, R.drawable.ic_play_arrow_white), "Play", playPendingIntent
                    ).build()
                } else {
                    @Suppress("DEPRECATION")
                    Notification.Action.Builder(
                        R.drawable.ic_play_arrow_white, "Play", playPendingIntent
                    ).build()
                }
            )
        }

        builder.addAction(
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                Notification.Action.Builder(
                    Icon.createWithResource(this, R.drawable.ic_skip_next_white), "Next", nextPendingIntent
                ).build()
            } else {
                @Suppress("DEPRECATION")
                Notification.Action.Builder(
                    R.drawable.ic_skip_next_white, "Next", nextPendingIntent
                ).build()
            }
        )

        val notification = builder.build()
        if (action == "play") {
            startForeground(1, notification)
        } else {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                stopForeground(STOP_FOREGROUND_DETACH)
            } else {
                @Suppress("DEPRECATION")
                stopForeground(false)
            }
            notificationManager?.notify(1, notification)
        }
    }

    private fun registerUpdateReceiver() {
        updateReceiver = object : BroadcastReceiver() {
            override fun onReceive(context: Context, intent: Intent) {
                if (ACTION_UPDATE_NOTIFICATION == intent.action) {
                    val icon = intent.getStringExtra("icon") ?: ""
                    val title = intent.getStringExtra("title") ?: ""
                    val subtitle = intent.getStringExtra("subtitle") ?: ""
                    val action = intent.getStringExtra("action") ?: ""
                    val duration = intent.getLongExtra("duration", 0)
                    val currentPosition = intent.getLongExtra("currentPosition", 0)

                    buildNotification(icon, title, subtitle, action, duration, currentPosition)
                }
            }
        }

        val filter = IntentFilter(ACTION_UPDATE_NOTIFICATION)
        if (Build.VERSION.SDK_INT >= 34 && applicationInfo.targetSdkVersion >= 34) {
            registerReceiver(updateReceiver, filter, RECEIVER_EXPORTED)
        } else {
            registerReceiver(updateReceiver, filter)
        }
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        if (intent != null) {
            notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            val icon = intent.getStringExtra("icon") ?: ""
            val title = intent.getStringExtra("title") ?: ""
            val subtitle = intent.getStringExtra("subtitle") ?: ""
            val action = intent.getStringExtra("action") ?: ""
            val duration = intent.getLongExtra("duration", 0)
            val currentPosition = intent.getLongExtra("currentPosition", 0)

            buildNotification(icon, title, subtitle, action, duration, currentPosition)
        }
        return START_NOT_STICKY
    }

    private fun updateMediaSessionMetadata(title: String, artist: String, albumArt: Bitmap, duration: Long) {
        val metadata = MediaMetadata.Builder()
            .putString(MediaMetadata.METADATA_KEY_TITLE, title)
            .putString(MediaMetadata.METADATA_KEY_ARTIST, artist)
            .putString(MediaMetadata.METADATA_KEY_ALBUM, "YT PRO")
            .putBitmap(MediaMetadata.METADATA_KEY_ALBUM_ART, albumArt)
            .putLong(MediaMetadata.METADATA_KEY_DURATION, duration)
            .build()

        mediaSession?.setMetadata(metadata)
    }

    private fun updatePlaybackState(currentPosition: Long, state: Int) {
        val playbackState = PlaybackState.Builder()
            .setActions(
                PlaybackState.ACTION_PLAY
                        or PlaybackState.ACTION_SKIP_TO_NEXT
                        or PlaybackState.ACTION_PAUSE
                        or PlaybackState.ACTION_SKIP_TO_PREVIOUS or PlaybackState.ACTION_SEEK_TO
            )
            .setState(state, currentPosition, 1.0f) // 1.0f for playback speed
            .build()

        mediaSession?.setPlaybackState(playbackState)
    }

    override fun onDestroy() {
        super.onDestroy()
        updateReceiver?.let { unregisterReceiver(it) }
        mediaSession?.release()
    }

    override fun onBind(intent: Intent): IBinder? {
        return null
    }

    companion object {
        const val CHANNEL_ID = "Media"
        const val ACTION_UPDATE_NOTIFICATION = "UPDATE_NOTIFICATION"
    }
}
