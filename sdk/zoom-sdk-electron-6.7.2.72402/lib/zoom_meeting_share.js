let { ZoomSDKError, AudioShareMode } = require('./settings.js');
let messages = require('./electron_sdk_pb.js');

var ZoomMeetingShare = (function () {
  var instance;
  /**
   * Zoom Meeting Share
   * @module zoom_meeting_share
   * @param {Function} onSharingStatus Callback event of the changed sharing status.
   * @param {Function} onFailedToStartShare Callback event of failed to start sharing.
   * @param {Function} onOptimizingShareForVideoClipStatusChanged Designated for the optimize video status have changed. 
   * @return {ZoomMeetingShare}
   */
  function init(opts) {
    let clientOpts = opts || {};
    // Private methods and variables
    let _addon = clientOpts.addon.GetMeetingShareCtrl() || null;
    let _onSharingStatus = clientOpts.onSharingStatus || null;
    let _onFailedToStartShare = clientOpts.onFailedToStartShare || null;
    let _onOptimizingShareForVideoClipStatusChanged = clientOpts.onOptimizingShareForVideoClipStatusChanged || null;

    /**
     * Callback event of the changed sharing status.
     * @event onSharingStatus
     * @param {Object} shareInfo Sharing information with the following properties:
     *   - userid: User ID
     *   - shareSourceID: Share source ID
     *   - status: The values of sharing status {@link ShareStatus}
     *   - isShowingInFirstView: Display or not on the primary view. Available only for Zoom UI mode
     *   - isShowingInSecondView: Display or not on the secondary view. Available only for Zoom UI mode
     *   - isCanBeRemoteControl: Enable or disable the remote control
     *   - bEnableOptimizingVideoSharing: Enable or disable the optimizing video
     *   - contentType: Type of sharing
     *   - windowID: Handle of sharing application or white-board. It is invalid unless the value of the contentType is SHARE_TYPE_AS or SHARE_TYPE_WB
     *   - monitorID: The ID of screen to be shared. It is invalid unless the value of the contentType is SHARE_TYPE_DS
     * @note The userId changes according to the status value. When the status value is the Sharing_Self_Send_Begin or Sharing_Self_Send_End, the userId is the user own ID. Otherwise, the value of userId is the sharer ID.
     */
    function onSharingStatus(item) {
      if (_onSharingStatus) {
        let shareInfo = {
          userid: item.userid,
          shareSourceID: item.shareSourceID,
          status: item.status,
          isShowingInFirstView: item.isShowingInFirstView,
          isShowingInSecondView: item.isShowingInSecondView,
          isCanBeRemoteControl: item.isCanBeRemoteControl,
          bEnableOptimizingVideoSharing: item.bEnableOptimizingVideoSharing,
          contentType: item.contentType,
          windowID: item.windowID,
          monitorID: item.monitorID
        }
        _onSharingStatus(shareInfo)
      }
    }

    /**
     * Callback event of failure to start sharing. 
     * @event onFailedToStartShare
     */
    function onFailedToStartShare() {
      if (_onFailedToStartShare) {
        _onFailedToStartShare()
      }
    }

    /**
     * Callback event of the changed optimizing video status.
     * @event onOptimizingShareForVideoClipStatusChanged
     * @param {Object} shareInfo Sharing information with the following properties:
     *   - userid: User ID
     *   - shareSourceID: Share source ID
     *   - status: The values of sharing status {@link ShareStatus}
     *   - isShowingInFirstView: Display or not on the primary view. Available only for Zoom UI mode
     *   - isShowingInSecondView: Display or not on the secondary view. Available only for Zoom UI mode
     *   - isCanBeRemoteControl: Enable or disable the remote control
     *   - bEnableOptimizingVideoSharing: Enable or disable the optimizing video
     *   - contentType: Type of sharing
     *   - windowID: Handle of sharing application or white-board. It is invalid unless the value of the contentType is SHARE_TYPE_AS or SHARE_TYPE_WB
     *   - monitorID: The ID of screen to be shared. It is invalid unless the value of the contentType is SHARE_TYPE_DS
     */
    function onOptimizingShareForVideoClipStatusChanged(shareInfo) {
      if (_onOptimizingShareForVideoClipStatusChanged) {
        _onOptimizingShareForVideoClipStatusChanged(shareInfo)
      }
    }

    if (_addon) {
      _addon.SetOnSharingStatusCB(onSharingStatus);
      _addon.SetOnFailedToStartShareCB(onFailedToStartShare);
      _addon.SetOnOptimizingShareForVideoClipStatusChangedCB(onOptimizingShareForVideoClipStatusChanged);
    }

    return {
      // Public methods and variables
      /**
       * Set onSharingStatus callback.
       * @method MeetingShare_SetOnSharingStatusCB
       * @param {Function} onSharingStatus
       * @return {Boolean} true or false
       */
      MeetingShare_SetOnSharingStatusCB: function (onSharingStatus) {
        if (_addon && onSharingStatus && onSharingStatus instanceof Function) {
          _onSharingStatus = onSharingStatus;
          return true;
        }
        return false;
      },
      /**
       * Set onFailedToStartShare callback.
       * @method MeetingShare_SetOnFailedToStartShareCB
       * @param {Function} onFailedToStartShare
       * @return {Boolean} true or false
       */
      MeetingShare_SetOnFailedToStartShareCB: function (onFailedToStartShare) {
        if (_addon && onFailedToStartShare && onFailedToStartShare instanceof Function) {
          _onFailedToStartShare = onFailedToStartShare;
          return true;
        }
        return false;
      },
      /**
       * Set onOptimizingShareForVideoClipStatusChanged callback.
       * @method MeetingShare_SetOnOptimizingShareForVideoClipStatusChangedCB
       * @param {Function} onOptimizingShareForVideoClipStatusChanged
       * @return {Boolean} true or false
       */
      MeetingShare_SetOnOptimizingShareForVideoClipStatusChangedCB: function (onOptimizingShareForVideoClipStatusChanged) {
        if (_addon && onOptimizingShareForVideoClipStatusChanged && onOptimizingShareForVideoClipStatusChanged instanceof Function) {
          _onOptimizingShareForVideoClipStatusChanged = onOptimizingShareForVideoClipStatusChanged;
          return true;
        }
        return false;
      },
      /**
       * Share the specified application.
       * @method MeetingShare_StartAppShare
       * @param {String} zn_hShare_app (require hexadecimal) Specify the window handle of the application to be shared. If the hwndSharedApp can't be shared, the return value is the SDKERR_INVALID_PARAMETER error code. If the hwndSharedApp is null, the primary monitor will be shared.
       * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
       * @note Valid for both ZOOM style and user custom interface mode.
       */
      MeetingShare_StartAppShare: function (opts) {
        if (_addon) {
          let clientOpts = opts || {};
          let zn_hShare_app = clientOpts.zn_hShare_app;
          try {
            let StartAppShareParams = new messages.StartAppShareParams();
            StartAppShareParams.setHshareapp(zn_hShare_app);
            let bytes = StartAppShareParams.serializeBinary();
            return _addon.StartAppShare(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * Share the specified monitor.
       * @method MeetingShare_StartMonitorShare
       * @param {String} zn_monitorID Specify the monitor ID to be shared. You may get the value via EnumDisplayMonitors System API. If the monitorID is null, the primary monitor will be shared
       * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
       * @note Valid for both ZOOM style and user custom interface mode.
       */
      MeetingShare_StartMonitorShare: function (opts) {
        if (_addon) {
          let clientOpts = opts || {};
          let zn_monitorID = clientOpts.zn_monitorID;
          try {
            let StartMonitorShareParams = new messages.StartMonitorShareParams();
            StartMonitorShareParams.setMonitorid(zn_monitorID);
            let bytes = StartMonitorShareParams.serializeBinary();
            return _addon.StartMonitorShare(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * Stop the current sharing.
       * @method MeetingShare_StopShare
       * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
       * @note Valid for both ZOOM style and user custom interface mode.
       */
      MeetingShare_StopShare: function () {
        if (_addon) {
          return _addon.StopShare();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * Determine whether the legal notice for white board is available.
       * @method MeetingShare_IsWhiteboardLegalNoticeAvailable
       * @return {Boolean} true indicates the legal notice for white board is available. Otherwise, false.
       */
      MeetingShare_IsWhiteboardLegalNoticeAvailable: function () {
        if (_addon) {
          return _addon.IsWhiteboardLegalNoticeAvailable();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * Get the white board legal notices prompt.
       * @method MeetingShare_GetWhiteboardLegalNoticesPrompt
       * @return {String}
       */
      MeetingShare_GetWhiteboardLegalNoticesPrompt: function () {
        if (_addon) {
          return _addon.GetWhiteboardLegalNoticesPrompt();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * Get the white board legal notices explained.
       * @method MeetingShare_GetWhiteboardLegalNoticesExplained
       * @return {String}
       */
      MeetingShare_GetWhiteboardLegalNoticesExplained: function () {
        if (_addon) {
          return _addon.GetWhiteboardLegalNoticesExplained();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * Set the audio share mode before or during sharing. 
       * @method MeetingShare_SetAudioShareMode
       * @param {Number} mode The mode for audio share {@link AudioShareMode}.
       * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
       * @note Valid for both ZOOM style and user custom interface mode.
       */
      MeetingShare_SetAudioShareMode: function (opts) {
        if (_addon) {
          let clientOpts = opts || {};
          let mode = clientOpts.mode || AudioShareMode.AudioShareMode_Mono;
          try {
            let SetAudioShareModeParams = new messages.SetAudioShareModeParams();
            SetAudioShareModeParams.setMode(mode);
            let bytes = SetAudioShareModeParams.serializeBinary();
            return _addon.SetAudioShareMode(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * Get the audio share mode. 
       * @method MeetingShare_GetAudioShareMode
       * @return {Object} If the function succeeds, the return value is an object with the following properties:
       *   - err: If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
       *   - audioShareMode: The mode for audio share
       * @note Valid for both ZOOM style and user custom interface mode.
       */
      MeetingShare_GetAudioShareMode: function () {
        if (_addon) {
          return _addon.GetAudioShareMode();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      }
    };
  };

  return {
    getInstance: function (opts) {
      if (!instance) {
        instance = init(opts);
      }
      return instance;
    }
  };
})();

module.exports = {
  ZoomMeetingShare: ZoomMeetingShare,
}
