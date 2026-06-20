package cc.astron.ui.notifications

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import cc.astron.R
import cc.astron.model.NotificationItem

class NotificationFragment : Fragment() {

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_notifications, container, false)
        val recyclerView: RecyclerView = view.findViewById(R.id.notifications_recycler_view)

        // Mock data for demonstration
        val mockData = listOf(
            NotificationItem("1", "New Video!", "Check out the latest upload from your favorite creator.", System.currentTimeMillis()),
            NotificationItem("2", "System Update", "ASTRON v1.1 is now available with new features.", System.currentTimeMillis())
        )

        recyclerView.layoutManager = LinearLayoutManager(context)
        recyclerView.adapter = NotificationAdapter(mockData)

        return view
    }
}
