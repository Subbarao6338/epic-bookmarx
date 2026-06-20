package cc.astron.utils

import android.content.Context
import android.content.SharedPreferences
import cc.astron.model.Account
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken

class PreferenceManager(context: Context) {
    private val gson = Gson()
    private val prefs: SharedPreferences = context.getSharedPreferences("astron_prefs", Context.MODE_PRIVATE)

    fun setProEnabled(enabled: Boolean) {
        prefs.edit().putBoolean("pro_enabled", enabled).apply()
    }

    fun isProEnabled(): Boolean {
        return true // All features unlocked in ASTRON
    }

    fun setUserLoggedIn(loggedIn: Boolean) {
        prefs.edit().putBoolean("user_logged_in", loggedIn).apply()
    }

    fun isUserLoggedIn(): Boolean {
        return prefs.getBoolean("user_logged_in", false)
    }

    fun getAccounts(): List<Account> {
        val json = prefs.getString("accounts_json", "[]")
        val type = object : TypeToken<List<Account>>() {}.type
        return gson.fromJson(json, type)
    }

    fun addAccount(account: Account) {
        val accounts = getAccounts().toMutableList()
        accounts.removeAll { it.id == account.id }
        accounts.add(account)
        val json = gson.toJson(accounts)
        prefs.edit().putString("accounts_json", json).apply()
    }

    fun getActiveAccountId(): String? {
        return prefs.getString("active_account_id", null)
    }

    fun setActiveAccountId(accountId: String?) {
        prefs.edit().putString("active_account_id", accountId).apply()
    }

    fun setCookies(accountId: String, cookies: String) {
        prefs.edit().putString("cookies_$accountId", cookies).apply()
    }

    fun getCookies(accountId: String): String? {
        return prefs.getString("cookies_$accountId", null)
    }
}
