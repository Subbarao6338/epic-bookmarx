package cc.astron.model

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "notifications")
data class NotificationItem(
    @PrimaryKey val id: String,
    val title: String,
    val message: String,
    val timestamp: Long,
    val thumbnailUrl: String? = null,
    val isRead: Boolean = false
)
