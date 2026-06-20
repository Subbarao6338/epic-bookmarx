package cc.astron.model

data class Account(
    val id: String,
    val name: String,
    val email: String,
    val avatarUrl: String? = null,
    val sessionToken: String? = null
)
