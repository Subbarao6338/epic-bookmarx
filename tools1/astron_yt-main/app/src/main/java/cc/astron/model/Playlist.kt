package cc.astron.model

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "playlists")
data class Playlist(
    @PrimaryKey val id: String,
    val name: String
)

@Entity(tableName = "videos", primaryKeys = ["videoId", "playlistId"])
data class VideoItem(
    val videoId: String,
    val playlistId: String,
    val title: String,
    val author: String,
    val thumbnailUrl: String
)
