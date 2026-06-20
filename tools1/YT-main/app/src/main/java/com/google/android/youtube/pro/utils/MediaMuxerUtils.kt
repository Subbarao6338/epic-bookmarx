package com.google.android.youtube.pro.utils

import android.content.ContentValues
import android.content.Context
import android.media.MediaCodec
import android.media.MediaCodecList
import android.media.MediaExtractor
import android.media.MediaFormat
import android.media.MediaMuxer
import android.net.Uri
import android.os.Build
import android.os.Handler
import android.os.Looper
import android.provider.MediaStore
import android.util.Log
import java.io.File
import java.nio.ByteBuffer

object MediaMuxerUtils {

    private const val TAG = "YTPRO_MEDIA"

    interface MuxCallback {
        fun onSuccess(outputFile: File)
        fun onFailure(e: Exception)
    }

    @JvmStatic
    fun muxVideoAudio(
        context: Context,
        videoFile: File,
        audioFile: File?,
        outputFile: File,
        callback: MuxCallback?
    ) {
        Thread {
            val videoExtractor = MediaExtractor()
            val audioExtractor = MediaExtractor()
            var muxer: MediaMuxer? = null
            var outputUri: Uri? = null
            var pfd: android.os.ParcelFileDescriptor? = null

            try {
                val isWebm = outputFile.name.endsWith(".webm")
                val outFormat = if (isWebm)
                    MediaMuxer.OutputFormat.MUXER_OUTPUT_WEBM
                else
                    MediaMuxer.OutputFormat.MUXER_OUTPUT_MPEG_4

                // ── Create muxer ──────────────────────────────────────────────
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    val resolver = context.contentResolver
                    val values = ContentValues().apply {
                        put(MediaStore.Downloads.DISPLAY_NAME, outputFile.name)
                        put(MediaStore.Downloads.MIME_TYPE, if (isWebm) "video/webm" else "video/mp4")
                        put(MediaStore.Downloads.RELATIVE_PATH, "Download/YTPRO")
                        put(MediaStore.Downloads.IS_PENDING, 1)
                    }

                    outputUri = resolver.insert(MediaStore.Downloads.getContentUri("external"), values) ?: throw Exception("MediaStore insert returned null for output")

                    pfd = resolver.openFileDescriptor(outputUri!!, "rw") ?: throw Exception("openFileDescriptor returned null")

                    val fd = pfd!!.fileDescriptor
                    muxer = MediaMuxer(fd, outFormat)

                } else {
                    // API 21-28
                    muxer = MediaMuxer(outputFile.absolutePath, outFormat)
                }

                // ── Set data sources ──────────────────────────────────────────
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    val resolver = context.contentResolver
                    val videoUri = getUriForFile(context, videoFile.name)
                    if (videoUri != null) {
                        resolver.openFileDescriptor(videoUri, "r")?.use { videoPfd ->
                            videoExtractor.setDataSource(videoPfd.fileDescriptor)
                        }
                    } else {
                        videoExtractor.setDataSource(videoFile.absolutePath)
                    }

                    if (audioFile != null) {
                        val audioUri = getUriForFile(context, audioFile.name)
                        if (audioUri != null) {
                            resolver.openFileDescriptor(audioUri, "r")?.use { audioPfd ->
                                audioExtractor.setDataSource(audioPfd.fileDescriptor)
                            }
                        } else {
                            audioExtractor.setDataSource(audioFile.absolutePath)
                        }
                    }
                } else {
                    videoExtractor.setDataSource(videoFile.absolutePath)
                    if (audioFile != null && audioFile.exists()) {
                        audioExtractor.setDataSource(audioFile.absolutePath)
                    }
                }

                // ── Video track ───────────────────────────────────────────────
                var muxerVideoTrackIndex = -1
                for (i in 0 until videoExtractor.trackCount) {
                    val format = videoExtractor.getTrackFormat(i)
                    val mime = format.getString(MediaFormat.KEY_MIME)
                    if (mime != null && mime.startsWith("video/")) {
                        // Check if codec is supported on this device/API
                        if (!isCodecSupported(mime)) {
                            throw Exception("Video codec not supported on this device: $mime")
                        }
                        videoExtractor.selectTrack(i)
                        muxerVideoTrackIndex = muxer!!.addTrack(format)
                        break
                    }
                }

                if (muxerVideoTrackIndex < 0) {
                    throw Exception("No video track found in file")
                }

                // ── Audio track ───────────────────────────────────────────────
                var muxerAudioTrackIndex = -1
                if (audioFile != null && audioFile.exists()) {
                    for (i in 0 until audioExtractor.trackCount) {
                        val format = audioExtractor.getTrackFormat(i)
                        val mime = format.getString(MediaFormat.KEY_MIME)
                        if (mime != null && mime.startsWith("audio/")) {
                            if (!isCodecSupported(mime)) {
                                // Audio codec not supported — log and skip
                                // instead of crashing, mux video only
                                Log.w(TAG, "Audio codec not supported, muxing video only: $mime")
                                break
                            }
                            audioExtractor.selectTrack(i)
                            muxerAudioTrackIndex = muxer!!.addTrack(format)
                            break
                        }
                    }
                }

                // ── Start muxer ───────────────────────────────────────────────
                try {
                    muxer!!.start()
                } catch (e: IllegalStateException) {
                    throw Exception("Muxer failed to start: ${e.message}")
                }

                val buffer = ByteBuffer.allocate(1024 * 1024)
                val info = MediaCodec.BufferInfo()

                // ── Write video ───────────────────────────────────────────────
                try {
                    while (true) {
                        val sampleSize = videoExtractor.readSampleData(buffer, 0)
                        if (sampleSize < 0) break
                        info.offset = 0
                        info.size = sampleSize
                        info.presentationTimeUs = videoExtractor.sampleTime
                        info.flags = videoExtractor.sampleFlags
                        muxer!!.writeSampleData(muxerVideoTrackIndex, buffer, info)
                        videoExtractor.advance()
                    }
                } catch (e: Exception) {
                    throw Exception("Failed writing video samples: ${e.message}")
                }

                // ── Write audio ───────────────────────────────────────────────
                if (muxerAudioTrackIndex >= 0) {
                    buffer.clear()
                    try {
                        while (true) {
                            val sampleSize = audioExtractor.readSampleData(buffer, 0)
                            if (sampleSize < 0) break
                            info.offset = 0
                            info.size = sampleSize
                            info.presentationTimeUs = audioExtractor.sampleTime
                            info.flags = audioExtractor.sampleFlags
                            muxer!!.writeSampleData(muxerAudioTrackIndex, buffer, info)
                            audioExtractor.advance()
                        }
                    } catch (e: Exception) {
                        throw Exception("Failed writing audio samples: ${e.message}")
                    }
                }

                // ── Stop muxer ────────────────────────────────────────────────
                try {
                    muxer!!.stop()
                    muxer!!.release()
                    muxer = null
                } catch (e: IllegalStateException) {
                    throw Exception("Muxer failed to stop: ${e.message}")
                }

                // ── Finalize output in MediaStore ─────────────────────────────
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q && outputUri != null) {
                    val values = ContentValues().apply {
                        put(MediaStore.Downloads.IS_PENDING, 0)
                    }
                    context.contentResolver.update(outputUri!!, values, null, null)
                }

                pfd?.close()
                pfd = null

                Log.d(TAG, "Muxing successful: ${outputFile.name}")

                if (callback != null) {
                    Handler(Looper.getMainLooper()).post { callback.onSuccess(outputFile) }
                }

            } catch (e: Exception) {
                Log.e(TAG, "Mux failed: ${e.message}")

                // If output was created in MediaStore but muxing failed, delete it
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q && outputUri != null) {
                    try {
                        context.contentResolver.delete(outputUri!!, null, null)
                    } catch (ignored: Exception) {
                    }
                } else {
                    // API 21-28 — delete the broken output file
                    if (outputFile.exists()) outputFile.delete()
                }

                if (callback != null) {
                    Handler(Looper.getMainLooper()).post { callback.onFailure(e) }
                }

            } finally {
                try { videoExtractor.release() } catch (ignored: Exception) { }
                try { audioExtractor.release() } catch (ignored: Exception) { }
                try { muxer?.let { it.stop(); it.release() } } catch (ignored: Exception) { }
                try { pfd?.close() } catch (ignored: Exception) { }

                // ── Delete temp input files ───────────────────────────────────
                deleteFile(context, videoFile)
                audioFile?.let { deleteFile(context, it) }
            }
        }.start()
    }

    private fun getUriForFile(context: Context, fileName: String): Uri? {
        val collection = MediaStore.Downloads.getContentUri("external")
        val projection = arrayOf(MediaStore.Downloads._ID)
        val selection = "${MediaStore.Downloads.DISPLAY_NAME} = ?"
        val args = arrayOf(fileName)

        return try {
            context.contentResolver.query(collection, projection, selection, args, null)?.use { cursor ->
                if (cursor.moveToFirst()) {
                    val id = cursor.getLong(cursor.getColumnIndexOrThrow(MediaStore.Downloads._ID))
                    Uri.withAppendedPath(collection, id.toString())
                } else null
            }
        } catch (e: Exception) {
            Log.e(TAG, "Failed to query MediaStore: ${e.message}")
            null
        }
    }

    // Deletes a file correctly for the current API level
    private fun deleteFile(context: Context, file: File) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            val uri = getUriForFile(context, file.name)
            if (uri != null) {
                context.contentResolver.delete(uri, null, null)
                Log.d(TAG, "Deleted via MediaStore: ${file.name}")
            }
        } else {
            if (file.exists()) file.delete()
        }
    }

    // Checks if a codec mime type is supported on this device
    private fun isCodecSupported(mime: String): Boolean {
        return try {
            val list = MediaCodecList(MediaCodecList.ALL_CODECS)
            list.codecInfos.any { info ->
                info.supportedTypes.any { it.equals(mime, ignoreCase = true) }
            }
        } catch (e: Exception) {
            Log.w(TAG, "Codec check failed: ${e.message}")
            // If check itself fails, let it try anyway
            true
        }
    }
}
