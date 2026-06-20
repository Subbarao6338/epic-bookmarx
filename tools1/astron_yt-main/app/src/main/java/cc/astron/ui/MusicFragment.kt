package cc.astron.ui

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import cc.astron.R
import cc.astron.model.VideoItem
import cc.astron.ui.player.PlayerActivity

class MusicFragment : Fragment() {
    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        val view = inflater.inflate(R.layout.fragment_music, container, false)

        val recyclerView: RecyclerView = view.findViewById(R.id.music_recycler_view)
        recyclerView.layoutManager = LinearLayoutManager(context)

        val sampleTracks = listOf(
            VideoItem("1", "music", "Bohemian Rhapsody", "Queen", ""),
            VideoItem("2", "music", "Imagine", "John Lennon", ""),
            VideoItem("3", "music", "Billie Jean", "Michael Jackson", ""),
            VideoItem("4", "music", "Hotel California", "Eagles", ""),
            VideoItem("5", "music", "Stayin' Alive", "Bee Gees", "")
        )

        recyclerView.adapter = MusicAdapter(sampleTracks) { track ->
            val intent = Intent(requireContext(), PlayerActivity::class.java)
            intent.putExtra("VIDEO_ID", track.videoId)
            startActivity(intent)
        }

        return view
    }
}
