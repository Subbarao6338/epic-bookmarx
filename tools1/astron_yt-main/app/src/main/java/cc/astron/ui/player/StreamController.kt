package cc.astron.ui.player

import com.google.android.exoplayer2.ExoPlayer
import com.google.android.exoplayer2.trackselection.DefaultTrackSelector

class StreamController(private val player: ExoPlayer) {

    fun setVideoQuality(maxHeight: Int) {
        val trackSelector = player.trackSelector as? DefaultTrackSelector ?: return
        val parameters = trackSelector.buildUponParameters()
            .setMaxVideoSize(Int.MAX_VALUE, maxHeight)
            .build()
        trackSelector.setParameters(parameters)
    }

    fun setAudioLanguage(languageCode: String) {
        val trackSelector = player.trackSelector as? DefaultTrackSelector ?: return
        val parameters = trackSelector.buildUponParameters()
            .setPreferredAudioLanguage(languageCode)
            .build()
        trackSelector.setParameters(parameters)
    }

    fun bypassQualityRestrictions() {
        // Force selection of highest available tracks regardless of network conditions
        val trackSelector = player.trackSelector as? DefaultTrackSelector ?: return
        val parameters = trackSelector.buildUponParameters()
            .setForceLowestBitrate(false)
            .setForceHighestSupportedBitrate(true)
            .build()
        trackSelector.setParameters(parameters)

        // Apply InnerTube headers to bypass potential age/region restrictions
        val resolver = cc.astron.utils.InnerTubeResolver()
        val headers = resolver.getRequestHeaders(cc.astron.utils.InnerTubeResolver.ClientType.ANDROID_TV)
        // In a real implementation, these would be applied to the DataSpec or MediaSource factory
    }

    fun setAudioOnly(enabled: Boolean) {
        val trackSelector = player.trackSelector as? DefaultTrackSelector ?: return
        val parameters = trackSelector.buildUponParameters()
            .setTrackTypeDisabled(com.google.android.exoplayer2.C.TRACK_TYPE_VIDEO, enabled)
            .build()
        trackSelector.setParameters(parameters)
    }
}
