const { ZoomSDK_LANGUAGE_ID, ZoomSDKError, CustomizedLanguageType, ZoomAPPLocale, ZoomSDKVideoRenderMode, SDKRawDataMemoryMode
  , ZoomSDKVideoCaptureMethod, ZoomSDKRenderPostProcessing } = require('./settings.js');
const ZOOMAUTHMOD = require('./zoom_auth.js');
const ZOOMMEETINGMOD = require('./zoom_meeting.js');
const ZOOMSETTINGMOD = require('./zoom_setting.js');
const ZOOMRESOURCE = require('./zoom_customized_resource.js');
const ZOOMRAWDATA = require('./zoom_rawdata.js');
const ZOOMSMS = require('./zoom_sms_helper.js');
const { platform, arch } = process
const messages = require('./electron_sdk_pb.js');

const ZoomSDK = (() => {
  let instance;
  /**
   * Zoom Electron Sdk
   * @module zoom_electron_sdk
   * @param {String} path zoomsdk.node path on win os or mac os
   * @return {ZoomSDK}
   */
  function init(opts) {
    // Private methods and variables
    let clientOpts = opts || {};
    let nativeSdkPath, addon
    try {
      switch (`${platform}:${arch}`) {
        case 'darwin:x64': 
        case 'darwin:arm64':
          nativeSdkPath = 'sdk/mac'
          break;
        case 'win32:ia32':
          nativeSdkPath = 'sdk/win32'
          break;
        case 'win32:x64':
          nativeSdkPath = 'sdk/win64'
          break;
      }
      require(`../${nativeSdkPath}/zoomsdk_napi_util.node`)
      addon = require(`../${nativeSdkPath}/zoomsdk.node`).exports()
    } catch (error) {
      console.log(error)
    }
    let _isSDKInitialized = false;

    return {
      // Public methods and variables
      /**
       * Initialize ZOOM SDK.
       * @method InitSDK
       * @param {String} path [Required] sdk.dll path on win os or mac os
       * @param {String} domain [Required] Web domain
       * @param {String} langname [Optional] Resource name
       * @param {String} langinfo [Optional] The value should be the full path of the resource file when the langType value is CustomizedLanguage_FilePath, including the file name. When the langType value is CustomizedLanguage_Content, the value saves the content of the resource
       * @param {Number} langtype [Optional] Use the custom resource type {@link CustomizedLanguageType}
       * @param {String} strSupportUrl [Optional] Support URL
       * @param {Number} langid [Optional] The ID of the SDK language {@link ZoomSDK_LANGUAGE_ID}
       * @param {Boolean} enable_log [Optional] Enable log feature
       * @param {Number} locale [Optional] Locale {@link ZoomAPPLocale}
       * @param {Number} logfilesize [Optional] Size of a log file in M(megabyte). The default size is 5M. There are 5 log files in total and the file size varies from 1M to 50M
       * @param {Boolean} enableGenerateDump [Optional] Enable generate dump file if the app crashed
       * @param {Boolean} permonitorAwarenessMode [Optional] Per-monitor awareness mode
       * @param {Number} videoRenderMode [Optional] Video render mode {@link ZoomSDKVideoRenderMode}
       * @param {Number} videoRawdataMemoryMode [Optional] Video rawdata memory mode {@link SDKRawDataMemoryMode}
       * @param {Number} shareRawdataMemoryMode [Optional] Share rawdata memory mode {@link SDKRawDataMemoryMode}
       * @param {Number} audioRawdataMemoryMode [Optional] Audio rawdata memory mode {@link SDKRawDataMemoryMode}
       * @param {Boolean} enableRawdataIntermediateMode [Optional] false -- YUV420data, true -- intermediate data
       * @param {Number} renderPostProcessing [Optional] Render post processing mode {@link ZoomSDKRenderPostProcessing}
       * @param {Number} videoCaptureMethod [Optional] Video capture method {@link ZoomSDKVideoCaptureMethod}
       * @param {String} customLocalizationFilePath [Optional] Set custom localizable string file path. only support for MAC platform
       * @param {Number} useCustomUI [Optional] Whether to use the custom UI mode
       * @param {String} strBrandingName [Optional] Branding name
       * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
       */
      InitSDK: function (opts) {
        let clientOpts = opts || {};
        let path = clientOpts.path || '';
        let domain = clientOpts.domain || 'https://www.zoom.us';
        let langname = clientOpts.langname || '';
        let langinfo = clientOpts.langinfo || '';
        let langtype = Number(clientOpts.langtype) || CustomizedLanguageType.CustomizedLanguage_None;
        let strSupportUrl = clientOpts.strSupportUrl || 'https://zoom.us';
        let langid = clientOpts.langid;
        let enable_log = clientOpts.enable_log == undefined ? true: clientOpts.enable_log;
        let locale = Number(clientOpts.locale) || ZoomAPPLocale.SDK_APP_Locale_Default;
        let logfilesize = Number(clientOpts.logfilesize) || 5;
        let enableGenerateDump = clientOpts.enableGenerateDump == undefined ? false : clientOpts.enableGenerateDump;
        let permonitorAwarenessMode = clientOpts.permonitorAwarenessMode == undefined ? true :clientOpts.permonitorAwarenessMode;
        let videoRenderMode = clientOpts.videoRenderMode || ZoomSDKVideoRenderMode.SDKVideoRenderMode_None;
        let videoRawdataMemoryMode = clientOpts.videoRawdataMemoryMode || SDKRawDataMemoryMode.SDKRawDataMemoryModeStack;
        let shareRawdataMemoryMode = clientOpts.shareRawdataMemoryMode || SDKRawDataMemoryMode.SDKRawDataMemoryModeStack;
        let audioRawdataMemoryMode = clientOpts.audioRawdataMemoryMode || SDKRawDataMemoryMode.SDKRawDataMemoryModeStack;
        let enableRawdataIntermediateMode = clientOpts.enableRawdataIntermediateMode || platform == 'darwin' ? false : true;
        let renderPostProcessing = clientOpts.renderPostProcessing || ZoomSDKVideoCaptureMethod.ZoomSDKVideoCaptureMethod_Auto;
        let videoCaptureMethod = clientOpts.videoCaptureMethod || ZoomSDKRenderPostProcessing.ZoomSDKRenderPostProcessing_Auto;
        let customLocalizationFilePath = clientOpts.customLocalizationFilePath
        let useCustomUI = clientOpts.useCustomUI || false
        let strBrandingName = clientOpts.strBrandingName
        if (langid == undefined) {
          langid = platform == 'darwin' ? ZoomSDK_LANGUAGE_ID.LANGUAGE_Unknown : ZoomSDK_LANGUAGE_ID.LANGUAGE_English
        }
        try {
          let InitSDKParams = new messages.InitSDKParams();
          InitSDKParams.setPath(path);
          InitSDKParams.setDomain(domain);
          InitSDKParams.setCustomizedlanguagename(langname);
          InitSDKParams.setCustomizedlanguageinfo(langinfo);
          InitSDKParams.setCustomizedlanguagetype(langtype);
          InitSDKParams.setStrsupporturl(strSupportUrl);
          InitSDKParams.setLangid(langid);
          InitSDKParams.setEnablelog(enable_log);
          InitSDKParams.setApplocale(locale);
          InitSDKParams.setLogfilesize(logfilesize);
          InitSDKParams.setEnablegeneraldump(enableGenerateDump);
          InitSDKParams.setPermonitorawarenessmode(permonitorAwarenessMode);
          InitSDKParams.setVideorendermode(videoRenderMode);
          InitSDKParams.setVideorawdatamemorymode(videoRawdataMemoryMode);
          InitSDKParams.setSharerawdatamemorymode(shareRawdataMemoryMode);
          InitSDKParams.setAudiorawdatamemorymode(audioRawdataMemoryMode);
          InitSDKParams.setEnablerawdataintermediatemode(enableRawdataIntermediateMode);
          InitSDKParams.setRenderpostprocessing(renderPostProcessing);
          InitSDKParams.setVideocapturemethod(videoCaptureMethod);
          InitSDKParams.setCustomlocalizationfilepath(customLocalizationFilePath);
          InitSDKParams.setUsecustomui(useCustomUI);
          InitSDKParams.setStrbrandingname(strBrandingName);
          let bytes = InitSDKParams.serializeBinary();
          let ret = addon.InitSDK(bytes);
          if (ZoomSDKError.SDKERR_SUCCESS == ret){
            _isSDKInitialized = true;
          } else {
            _isSDKInitialized = false;
          }
          return ret
        } catch (error) {
          return ZoomSDKError.SDKERR_INVALID_PARAMETER;
        }
      },
      /**
      * Get the version of ZOOM SDK.
      * @method GetZoomSDKVersion
      * @return {String} The version of ZOOM SDK
      */
      GetZoomSDKVersion: () => {
        return addon.GetZoomSDKVersion();
      },
      /**
       * Clean up ZOOM SDK.
       * @method CleanUPSDK
       * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
       */
      CleanUPSDK: function () {
        return addon.CleanUPSDK();
      },
      GetAuth: (opts) => {
        if (_isSDKInitialized) {
          let clientOpts = opts || {};
          clientOpts.addon = addon;
          return ZOOMAUTHMOD.ZoomAuth.getInstance(clientOpts);
        }
        return null;
      },
      GetMeeting: (opts) => {
        if (_isSDKInitialized) {
          let clientOpts = opts || {};
          clientOpts.addon = addon;
          return ZOOMMEETINGMOD.ZoomMeeting.getInstance(clientOpts);
        }
        return null;
      },
      GetSetting: (opts) => {
        if (_isSDKInitialized) {
          let clientOpts = opts || {};
          clientOpts.addon = addon;
          return ZOOMSETTINGMOD.ZoomSetting.getInstance(clientOpts);
        }
        return null;
      },
      GetCustomizedResource: (opts) => {
        let clientOpts = opts || {};
        clientOpts.addon = addon;
        return ZOOMRESOURCE.ZoomCustomizedResource.getInstance(clientOpts);
      },
      RawData: (opts) => {
        if (_isSDKInitialized) {
          let clientOpts = opts || {};
          clientOpts.addon = addon;
          return ZOOMRAWDATA.ZoomRawData.getInstance(clientOpts);
        }
        return null;
      },
      SMSHelper: (opts) => {
        if (_isSDKInitialized) {
          let clientOpts = opts || {};
          clientOpts.addon = addon;
          return ZOOMSMS.ZoomSMSHelper.getInstance(clientOpts);
        }
        return null;
      }
    };
  };

  return {
    getInstance: (opts) => {
      if (!instance) {
        instance = init(opts);
      }
      return instance;
    }
  };
})();

module.exports = {
  ZoomSDK: ZoomSDK
}
