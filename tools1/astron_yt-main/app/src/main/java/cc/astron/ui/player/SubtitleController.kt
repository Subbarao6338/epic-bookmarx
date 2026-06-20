package cc.astron.ui.player

import com.google.android.exoplayer2.ExoPlayer
import com.google.android.exoplayer2.trackselection.DefaultTrackSelector
import com.google.android.exoplayer2.ui.CaptionStyleCompat
import android.content.Context
import com.google.android.exoplayer2.C

class SubtitleController(private val context: Context, private val player: ExoPlayer) {

    fun setSubtitleStyle(style: CaptionStyleCompat) {
        // Implementation for custom subtitle styles
    }

    fun toggleSubtitles(enabled: Boolean) {
        val trackSelector = player.trackSelector as? DefaultTrackSelector ?: return
        val parameters = trackSelector.buildUponParameters()
            .setTrackTypeDisabled(C.TRACK_TYPE_TEXT, !enabled)
            .build()
        trackSelector.setParameters(parameters)
    }
}
