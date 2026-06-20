package com.ntube

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.ntube.databinding.ActivitySettingsBinding

class SettingsActivity : AppCompatActivity() {

    private lateinit var binding: ActivitySettingsBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivitySettingsBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setSupportActionBar(binding.toolbar)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        binding.toolbar.setNavigationOnClickListener {
            onBackPressedDispatcher.onBackPressed()
        }

        setupThemeSelection()
    }

    private fun setupThemeSelection() {
        val currentTheme = ThemeHelper.getTheme(this)
        when (currentTheme) {
            ThemeHelper.THEME_LIGHT -> binding.radioLight.isChecked = true
            ThemeHelper.THEME_DARK -> binding.radioDark.isChecked = true
            else -> binding.radioSystem.isChecked = true
        }

        binding.themeRadioGroup.setOnCheckedChangeListener { _, checkedId ->
            val theme = when (checkedId) {
                R.id.radioLight -> ThemeHelper.THEME_LIGHT
                R.id.radioDark -> ThemeHelper.THEME_DARK
                else -> ThemeHelper.THEME_SYSTEM
            }
            ThemeHelper.setTheme(this, theme)
        }
    }
}
