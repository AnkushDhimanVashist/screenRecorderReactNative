package com.rtnmyscreenrecorder
import android.Manifest
import android.os.Build
import androidx.core.app.ActivityCompat
import com.facebook.react.bridge.ReactApplicationContext


class MyScreenRecorderModule (val context: ReactApplicationContext?): NativeMyScreenRecorder(context){

private val REQUEST_CODE_PERMISSIONS = 10
private val REQUIRED_PERMISSIONS = mutableListOf(Manifest.permission.INTERNET).toTypedArray()

private val REQUEST_CODE_PERMISSIONS_TWO = 11
private val REQUIRED_PERMISSIONS_TWO = mutableListOf(
   android.Manifest.permission.RECORD_AUDIO
).apply {
   if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
     add(android.Manifest.permission.POST_NOTIFICATIONS)
   }
}.apply {
      if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.P) {
      add(android.Manifest.permission.WRITE_EXTERNAL_STORAGE)
  }
}.toTypedArray()


override fun getName(): String {
return NAME
}


override fun startRecording () {
ActivityCompat.requestPermissions(
context?.currentActivity!!, REQUIRED_PERMISSIONS_TWO,
REQUEST_CODE_PERMISSIONS_TWO,
)
}


override fun stopRecording () {
ActivityCompat.requestPermissions(
context?.currentActivity!!,
 REQUIRED_PERMISSIONS,
REQUEST_CODE_PERMISSIONS,
)
}

companion object {
    const val NAME="RTNMyScreenRecorder"
}
}
