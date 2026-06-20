package cc.astron.model

data class User(
    val id: String,
    val name: String,
    val email: String,
    val isPro: Boolean = false
)
