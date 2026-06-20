package cc.astron.db

import androidx.room.*
import cc.astron.model.NotificationItem
import cc.astron.model.Playlist
import cc.astron.model.VideoItem
import kotlinx.coroutines.flow.Flow

@Dao
interface AstronDao {
    @Query("SELECT * FROM notifications ORDER BY timestamp DESC")
    fun getAllNotifications(): Flow<List<NotificationItem>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertNotification(notification: NotificationItem)

    @Query("SELECT * FROM playlists")
    fun getAllPlaylists(): Flow<List<Playlist>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertPlaylist(playlist: Playlist)

    @Query("SELECT * FROM videos WHERE playlistId = :playlistId")
    fun getVideosForPlaylist(playlistId: String): Flow<List<VideoItem>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertVideo(video: VideoItem)
}

@Database(entities = [NotificationItem::class, Playlist::class, VideoItem::class], version = 1)
abstract class AstronDatabase : RoomDatabase() {
    abstract fun astronDao(): AstronDao
}
