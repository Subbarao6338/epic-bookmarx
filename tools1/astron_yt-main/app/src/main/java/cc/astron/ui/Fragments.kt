package cc.astron.ui

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import cc.astron.R
import cc.astron.ui.player.PlayerActivity

class HomeFragment : Fragment() {
    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        val view = inflater.inflate(R.layout.fragment_placeholder, container, false)
        val button: Button = view.findViewById(R.id.btn_open_player)
        button.text = "Open Demo Player"
        button.visibility = View.VISIBLE
        button.setOnClickListener {
            startActivity(Intent(requireContext(), PlayerActivity::class.java))
        }
        return view
    }
}

class LibraryFragment : Fragment() {
    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        val view = inflater.inflate(R.layout.fragment_placeholder, container, false)
        val title: TextView = view.findViewById(R.id.fragment_title)
        title.text = "Library - Your Playlists"

        // In a real app, this would use Room and a RecyclerView
        return view
    }
}
