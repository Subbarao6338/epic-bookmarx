package cc.astron.ui

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
import cc.astron.model.Account
import cc.astron.utils.PreferenceManager
import com.google.android.material.switchmaterial.SwitchMaterial
import java.util.UUID

class AccountFragment : Fragment() {

    private lateinit var preferenceManager: PreferenceManager
    private lateinit var adapter: AccountAdapter
    private val accounts = mutableListOf<Account>()

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        val view = inflater.inflate(R.layout.fragment_account, container, false)
        preferenceManager = PreferenceManager(requireContext())
        accounts.clear()
        accounts.addAll(preferenceManager.getAccounts())

        val userStatus: TextView = view.findViewById(R.id.user_status)
        val btnLogin: Button = view.findViewById(R.id.btn_login)
        val switchPro: SwitchMaterial = view.findViewById(R.id.switch_pro)
        val recyclerView: RecyclerView = view.findViewById(R.id.accounts_recycler_view)

        recyclerView.layoutManager = LinearLayoutManager(context)
        adapter = AccountAdapter(accounts) { account ->
            preferenceManager.setActiveAccountId(account.id)
            updateUi(userStatus, btnLogin, switchPro)
        }
        recyclerView.adapter = adapter

        updateUi(userStatus, btnLogin, switchPro)

        btnLogin.setOnClickListener {
            startActivity(android.content.Intent(requireContext(), LoginActivity::class.java))
        }

        switchPro.setOnCheckedChangeListener { _, isChecked ->
            preferenceManager.setProEnabled(isChecked)
        }

        return view
    }

    private fun updateUi(userStatus: TextView, btnLogin: Button, switchPro: SwitchMaterial) {
        val activeId = preferenceManager.getActiveAccountId()
        val activeAccount = accounts.find { it.id == activeId }

        userStatus.text = if (activeAccount != null) "Logged in as ${activeAccount.name}" else "No Active Account"
        adapter.updateAccounts(accounts)
        switchPro.isChecked = preferenceManager.isProEnabled()
    }
}
