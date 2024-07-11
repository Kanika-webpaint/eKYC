package com.ekyc

import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.ReactRootView
import com.facebook.react.modules.core.PermissionListener
import com.regula.documentreader.full.DocumentReaderFull
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView
import android.content.pm.PackageManager

class MainActivity : ReactActivity(), PermissionAwareActivity {
    
    private var mPermissionListener: PermissionListener? = null
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val licensePath = "..android/app/assets/regula.license" 
        try {
            DocumentReaderFull.getInstance().initialize(this, licensePath)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    override fun getMainComponentName(): String {
        return "eKYC"
    }

    override fun createReactActivityDelegate(): ReactActivityDelegate {
        return object : ReactActivityDelegate(this, mainComponentName) {
            override fun createRootView(): ReactRootView {
                return RNGestureHandlerEnabledRootView(this@MainActivity)
            }

            override fun requestPermissions(permissions: Array<String>, requestCode: Int, listener: PermissionListener) {
                mPermissionListener = listener
                requestPermissions(permissions, requestCode)
            }

            override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<String>, grantResults: IntArray) {
                if (mPermissionListener != null && mPermissionListener!!.onRequestPermissionsResult(requestCode, permissions, grantResults)) {
                    mPermissionListener = null
                }
            }
        }
    }
}
