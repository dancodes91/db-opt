const { ZoomSDKError } = require('./settings.js');
const messages = require('./electron_sdk_pb.js');

var ZoomRawData = (function () {
  let instance;
  /**
   * Zoom Raw Data
   * @module zoom_rawdata
   * @param {Function} onRawDataStatusChanged
   * @return {ZoomRawData}
   */
  function init(opts) {
    
    let clientOpts = opts || {};

    // Private methods and variables
    let _addon = clientOpts.addon.GetRawdataAPIWrap() || null;
    let _onRawDataStatusChanged = clientOpts.onRawDataStatusChanged || null;

    /**
      * onRawDataStatusChanged callback
      * @event onRawDataStatusChanged
      * @param {Number} status {@link RawDataStatus}
      * @param {Number} recv_handle
    */
    function onRawDataStatusChanged(status, recv_handle) {
      if (_onRawDataStatusChanged) {
        _onRawDataStatusChanged(status, recv_handle)
      }
    }

    if (_addon) {
      _addon.SetonRawDataStatusChangedCB(onRawDataStatusChanged);
    }

    return {
      /** 
      * Set onRawDataStatusChanged callback.
      * @method SetonRawDataStatusChangedCB
      * @param {Function} onRawDataStatusChanged
      * @return {Boolean} true or false
      */
      SetonRawDataStatusChangedCB: function (onRawDataStatusChanged) {
        if (_addon && onRawDataStatusChanged && onRawDataStatusChanged instanceof Function) {
          _onRawDataStatusChanged = onRawDataStatusChanged;
          return true;
        }
        return false;
      },
      /** 
      * Check if raw data license is available.
      * @method HasRawDataLicense
      * @return {Boolean} true or false
      */
      HasRawDataLicense: function () {
        if (_addon) {
          return _addon.HasRawDataLicense();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /** 
      * Create renderer.
      * @method CreateRenderer
      * @param {Number} recv_handle
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      */
      CreateRenderer: function (opts) {
        if (_addon) {
          let clientOpts = opts || {};
          let recv_handle = clientOpts.recv_handle;
          try {
            let CreateRendererParams = new messages.CreateRendererParams();
            CreateRendererParams.setRecvhandle(Number(recv_handle));
            let bytes = CreateRendererParams.serializeBinary();
            return _addon.CreateRenderer(bytes);            
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE
      },
      /** 
      * Destroy renderer.
      * @method DestroyRenderer
      * @param {Number} recv_handle
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      */
      DestroyRenderer: function (opts) {
        if (_addon) {
          let clientOpts = opts || {};
          let recv_handle = clientOpts.recv_handle;
          try {
            let DestroyRendererParams = new messages.DestroyRendererParams();
            DestroyRendererParams.setRecvhandle(Number(recv_handle));
            let bytes = DestroyRendererParams.serializeBinary();
            return _addon.DestroyRenderer(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE
      },
      /** 
      * Subscribe to the video or share's raw data.
      * @method Subscribe
      * @param {Number} subscribeId If 'type' is RAW_DATA_TYPE_VIDEO, 'subscribeId' refers to the user ID, otherwise it refers to the shared source ID of user.
      * @param {Number} rawdataType Specify the raw data type {@link ZoomSDKRawDataType}
      * @param {Number} recv_handle
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      */
      Subscribe: function (opts) {
        if (_addon) {
          let clientOpts = opts || {};
          let subscribeId = clientOpts.subscribeId;
          let rawdataType = clientOpts.rawdataType;
          let recv_handle = clientOpts.recv_handle;
          try {
            let SubscribeParams = new messages.SubscribeParams();
            SubscribeParams.setSubscribeid(Number(subscribeId));
            SubscribeParams.setRawdatatype(Number(rawdataType));
            SubscribeParams.setRecvhandle(Number(recv_handle));
            let bytes = SubscribeParams.serializeBinary();
            return _addon.Subscribe(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE
      },
      /** 
      * Unsubscribe from the video or share's raw data.
      * @method UnSubscribe
      * @param {Number} recv_handle
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      */
      UnSubscribe: function (opts) {
        if (_addon) {
          let clientOpts = opts || {};
          let recv_handle = clientOpts.recv_handle;
          try {
            let UnSubscribeParams = new messages.UnSubscribeParams();
            UnSubscribeParams.setRecvhandle(Number(recv_handle));
            let bytes = UnSubscribeParams.serializeBinary();
            return _addon.UnSubscribe(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /** 
      * Set raw data resolution.
      * @method SetRawDataResolution
      * @param {Number} resolution Specify the raw data resolution {@link ZoomSDKResolution}
      * @param {Number} recv_handle
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      */
      SetRawDataResolution: function (opts) {
        if (_addon) {
          let clientOpts = opts || {};
          let resolution = clientOpts.resolution;
          let recv_handle = clientOpts.recv_handle;
          try {
            let SetRawDataResolutionParams = new messages.SetRawDataResolutionParams();
            SetRawDataResolutionParams.setResolution(Number(resolution));
            SetRawDataResolutionParams.setRecvhandle(Number(recv_handle));
            let bytes = SetRawDataResolutionParams.serializeBinary();
            return _addon.SetRawDataResolution(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE
      },
      /** 
      * Get raw data resolution.
      * @method GetResolution
      * @param {Number} recv_handle
      * @return {Number} {@link RawDataResolution}
      */
      GetResolution: function (opts) {
        if (_addon) {
          let clientOpts = opts || {};
          let recv_handle = clientOpts.recv_handle;
          try {
            let GetResolutionParams = new messages.GetResolutionParams();
            GetResolutionParams.setRecvhandle(Number(recv_handle));
            let bytes = GetResolutionParams.serializeBinary();
            return _addon.GetResolution(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE
      },
      /** 
      * Get raw data type.
      * @method GetRawDataType
      * @param {Number} recv_handle
      * @return {Number} {@link ZoomSDKRawDataType}
      */
      GetRawDataType: function (opts) {
        if (_addon) {
          let clientOpts = opts || {};
          let recv_handle = clientOpts.recv_handle;
          try {
            let GetRawDataTypeParams = new messages.GetRawDataTypeParams();
            GetRawDataTypeParams.setRecvhandle(Number(recv_handle));
            let bytes = GetRawDataTypeParams.serializeBinary();
            return _addon.GetRawDataType(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE
      },
      /** 
      * Get the subscribed ID specified when subscribing.
      * @method GetSubscribeId
      * @param {Number} recv_handle
      * @return {Number} subscribed id.
      */
      GetSubscribeId: function (opts) {
        if (_addon) {
          let clientOpts = opts || {};
          let recv_handle = clientOpts.recv_handle;
          try {
            let GetSubscribeIdParams = new messages.GetSubscribeIdParams();
            GetSubscribeIdParams.setRecvhandle(Number(recv_handle));
            let bytes = GetSubscribeIdParams.serializeBinary();
            return _addon.GetSubscribeId(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE
      },
      /** 
      * Initialize audio raw data helper.
      * @method InitAudioRawDataHelper
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      */
      InitAudioRawDataHelper: function () {
        if (_addon) {
          return _addon.InitAudioRawDataHelper();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE
      },
      /** 
      * Subscribe to audio raw data.
      * @method SubscribeAudioRawdata
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      */
      SubscribeAudioRawdata: function () {
        if (_addon) {
          return _addon.SubscribeAudioRawdata();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE
      },
      /** 
      * Unsubscribe from audio raw data.
      * @method UnSubscribeAudioRawdata
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      */
      UnSubscribeAudioRawdata: function () {
        if (_addon) {
          return _addon.UnSubscribeAudioRawdata();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE
      }
    };
};
  return {
    getInstance: function (opts) {
      if (!instance) {
        instance = init(opts)
      }
      return instance
    }
  };
})();

module.exports = {
  ZoomRawData: ZoomRawData
}