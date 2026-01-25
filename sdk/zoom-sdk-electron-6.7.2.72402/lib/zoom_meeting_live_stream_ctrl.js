const { ZoomSDKError } = require('./settings.js');
const messages = require('./electron_sdk_pb.js');

var ZoomMeetingLiveStreamCtrl = (function () {
  let instance;
  /**
   * Zoom Meeting Live Stream Ctrl
   * @module zoom_meeting_live_stream_ctrl
   * @return {ZoomMeetingLiveStreamCtrl}
   */
  function init(opts) {
    
    let clientOpts = opts || {};

    // Private methods and variables
    let _addon = clientOpts.addon.GetMeetingLiveStreamCtrl() || null;
    let _onLiveStreamStatusChange = clientOpts.onLiveStreamStatusChange || null;
    let _onRawLiveStreamPrivilegeChanged = clientOpts.onRawLiveStreamPrivilegeChanged || null;
    let _onUserRawLiveStreamPrivilegeChanged = clientOpts.onUserRawLiveStreamPrivilegeChanged || null;
    let _onRawLiveStreamPrivilegeRequested = clientOpts.onRawLiveStreamPrivilegeRequested || null;
    let _onUserRawLiveStreamingStatusChanged = clientOpts.onUserRawLiveStreamingStatusChanged || null;
    let _onRawLiveStreamPrivilegeRequestTimeout = clientOpts.onRawLiveStreamPrivilegeRequestTimeout || null;
    let _onLiveStreamReminderStatusChanged = clientOpts.onLiveStreamReminderStatusChanged || null;
    let _onLiveStreamReminderStatusChangeFailed = clientOpts.onLiveStreamReminderStatusChangeFailed || null;
    let _onUserThresholdReachedForLiveStream = clientOpts.onUserThresholdReachedForLiveStream || null;

    /**
     * Callback event when live stream status changes.
     * @event onLiveStreamStatusChange
     * @param {String} status Live stream status {@link LiveStreamStatus}.
     */
    function onLiveStreamStatusChange(status) {
      if (_onLiveStreamStatusChange) {
        _onLiveStreamStatusChange(status)
      }
    }

    /**
     * Callback event when the current user's raw live streaming privilege changes.
     * @event onRawLiveStreamPrivilegeChanged
     * @param {Boolean} hasPrivilege Specify whether or not the user has privilege.
     */
    function onRawLiveStreamPrivilegeChanged(hasPrivilege) {
      if (_onRawLiveStreamPrivilegeChanged) {
        _onRawLiveStreamPrivilegeChanged(hasPrivilege)
      }
    }

    /**
     * Callback event when another user's raw live streaming privilege has changed.
     * @event onUserRawLiveStreamPrivilegeChanged
     * @param {Number} userid The ID of the user whose privilege has changed.
     * @param {Boolean} hasPrivilege Specify whether the user has privilege or not.
     */
    function onUserRawLiveStreamPrivilegeChanged(userid, hasPrivilege) {
      if (_onUserRawLiveStreamPrivilegeChanged) {
        _onUserRawLiveStreamPrivilegeChanged(userid, hasPrivilege)
      }
    }

    /**
     * Callback event when a user requests raw live streaming privilege.
     * @event onRawLiveStreamPrivilegeRequested
     */
    function onRawLiveStreamPrivilegeRequested() {
      if (_onRawLiveStreamPrivilegeRequested) {
        _onRawLiveStreamPrivilegeRequested()
      }
    }

    /**
     * Callback event when users start/stop raw live streaming.
     * @event onUserRawLiveStreamingStatusChanged
     * @param {Array} liveStreamList A list of users with an active raw live stream, each with the following properties:
     *   - userId: User ID.
     *   - broadcastUrl: Broadcast URL.
     *   - broadcastName: Broadcast name.
     */
    function onUserRawLiveStreamingStatusChanged(liveStreamList) {
      if (_onUserRawLiveStreamingStatusChanged) {
        _onUserRawLiveStreamingStatusChanged(liveStreamList)
      }
    }

    /**
     * Callback event when the current user's request has time out.
     * @event onRawLiveStreamPrivilegeRequestTimeout
     */
    function onRawLiveStreamPrivilegeRequestTimeout() {
      if (_onRawLiveStreamPrivilegeRequestTimeout) {
        _onRawLiveStreamPrivilegeRequestTimeout()
      }
    }

    /**
     * Callback event when the live stream reminder enable status changes.
     * @event onLiveStreamReminderStatusChanged
     * @param {Boolean} enable true indicates the live stream reminder is enabled.
     */
    function onLiveStreamReminderStatusChanged(enable) {
      if (_onLiveStreamReminderStatusChanged) {
        _onLiveStreamReminderStatusChanged(enable)
      }
    }

    /**
     * Callback event when the live stream reminder enable status change fails.
     * @event onLiveStreamReminderStatusChangeFailed
     */
    function onLiveStreamReminderStatusChangeFailed() {
      if (_onLiveStreamReminderStatusChangeFailed) {
        _onLiveStreamReminderStatusChangeFailed()
      }
    }

    /**
     * Callback event when the meeting or webinar user has nearly reached the meeting capacity, like 80% or 100% for the meeting or webinar capacity. The host can start live stream to let unjoined user watch live stream.
     * @event onUserThresholdReachedForLiveStream
     * @param {Number} percent Proportion of joined users to the total capacity.
     */
    function onUserThresholdReachedForLiveStream(percent) {
      if (_onUserThresholdReachedForLiveStream) {
        _onUserThresholdReachedForLiveStream(percent)
      }
    }

    if (_addon) {
      _addon.SetOnLiveStreamStatusChangeCB(onLiveStreamStatusChange);
      _addon.SetOnRawLiveStreamPrivilegeChangedCB(onRawLiveStreamPrivilegeChanged);
      _addon.SetOnUserRawLiveStreamPrivilegeChangedCB(onUserRawLiveStreamPrivilegeChanged);
      _addon.SetOnRawLiveStreamPrivilegeRequestedCB(onRawLiveStreamPrivilegeRequested);
      _addon.SetOnUserRawLiveStreamingStatusChangedCB(onUserRawLiveStreamingStatusChanged);
      _addon.SetOnRawLiveStreamPrivilegeRequestTimeoutCB(onRawLiveStreamPrivilegeRequestTimeout);
      _addon.SetOnLiveStreamReminderStatusChangedCB(onLiveStreamReminderStatusChanged);
      _addon.SetOnLiveStreamReminderStatusChangeFailedCB(onLiveStreamReminderStatusChangeFailed);
      _addon.SetOnUserThresholdReachedForLiveStreamCB(onUserThresholdReachedForLiveStream);
    }

    return {
      /**
       * Set onLiveStreamStatusChange callback.
       * @method SetOnLiveStreamStatusChangeCB
       * @param {Function} onLiveStreamStatusChange
       * @return {Boolean} true or false
       */
      SetOnLiveStreamStatusChangeCB: function (onLiveStreamStatusChange) {
        if (_addon && onLiveStreamStatusChange && onLiveStreamStatusChange instanceof Function) {
          _onLiveStreamStatusChange = onLiveStreamStatusChange;
          return true
        }
        return false
      },
      /**
       * Set onRawLiveStreamPrivilegeChanged callback.
       * @method SetOnRawLiveStreamPrivilegeChangedCB
       * @param {Function} onRawLiveStreamPrivilegeChanged
       * @return {Boolean} true or false
       */
      SetOnRawLiveStreamPrivilegeChangedCB: function (onRawLiveStreamPrivilegeChanged) {
        if (_addon && onRawLiveStreamPrivilegeChanged && onRawLiveStreamPrivilegeChanged instanceof Function) {
          _onRawLiveStreamPrivilegeChanged = onRawLiveStreamPrivilegeChanged;
          return true
        }
        return false
      },
      /**
       * Set onUserRawLiveStreamPrivilegeChanged callback.
       * @method SetOnUserRawLiveStreamPrivilegeChangedCB
       * @param {Function} onUserRawLiveStreamPrivilegeChanged
       * @return {Boolean} true or false
       */
      SetOnUserRawLiveStreamPrivilegeChangedCB: function (onUserRawLiveStreamPrivilegeChanged) {
        if (_addon && onUserRawLiveStreamPrivilegeChanged && onUserRawLiveStreamPrivilegeChanged instanceof Function) {
          _onRawLiveStreamPrivilegeChanged = onUserRawLiveStreamPrivilegeChanged;
          return true
        }
        return false
      },
      /**
       * Set onRawLiveStreamPrivilegeRequested callback.
       * @method SetOnRawLiveStreamPrivilegeRequestedCB
       * @param {Function} onRawLiveStreamPrivilegeRequested
       * @return {Boolean} true or false
       */
      SetOnRawLiveStreamPrivilegeRequestedCB: function (onRawLiveStreamPrivilegeRequested) {
        if (_addon && onRawLiveStreamPrivilegeRequested && onRawLiveStreamPrivilegeRequested instanceof Function) {
          _onRawLiveStreamPrivilegeRequested = onRawLiveStreamPrivilegeRequested;
          return true
        }
        return false
      },
      /**
       * Set onUserRawLiveStreamingStatusChanged callback.
       * @method SetOnUserRawLiveStreamingStatusChangedCB
       * @param {Function} onUserRawLiveStreamingStatusChanged
       * @return {Boolean} true or false
       */
      SetOnUserRawLiveStreamingStatusChangedCB: function (onUserRawLiveStreamingStatusChanged) {
        if (_addon && onUserRawLiveStreamingStatusChanged && onUserRawLiveStreamingStatusChanged instanceof Function) {
          _onUserRawLiveStreamingStatusChanged = onUserRawLiveStreamingStatusChanged;
          return true
        }
        return false
      },
      /**
       * Set onRawLiveStreamPrivilegeRequestTimeout callback.
       * @method SetOnRawLiveStreamPrivilegeRequestTimeoutCB
       * @param {Function} onRawLiveStreamPrivilegeRequestTimeout
       * @return {Boolean} true or false
       */
      SetOnRawLiveStreamPrivilegeRequestTimeoutCB: function (onRawLiveStreamPrivilegeRequestTimeout) {
        if (_addon && onRawLiveStreamPrivilegeRequestTimeout && onRawLiveStreamPrivilegeRequestTimeout instanceof Function) {
          _onRawLiveStreamPrivilegeRequestTimeout = onRawLiveStreamPrivilegeRequestTimeout;
          return true
        }
        return false
      },
      /**
       * Set onLiveStreamReminderStatusChanged callback.
       * @method SetOnLiveStreamReminderStatusChangedCB
       * @param {Function} onLiveStreamReminderStatusChanged
       * @return {Boolean} true or false
       */
      SetOnLiveStreamReminderStatusChangedCB: function (onLiveStreamReminderStatusChanged) {
        if (_addon && onLiveStreamReminderStatusChanged && onLiveStreamReminderStatusChanged instanceof Function) {
          _onLiveStreamReminderStatusChanged = onLiveStreamReminderStatusChanged;
          return true
        }
        return false
      },
      /**
       * Set onLiveStreamReminderStatusChangeFailed callback.
       * @method SetOnLiveStreamReminderStatusChangeFailedCB
       * @param {Function} onLiveStreamReminderStatusChangeFailed
       * @return {Boolean} true or false
       */
      SetOnLiveStreamReminderStatusChangeFailedCB: function (onLiveStreamReminderStatusChangeFailed) {
        if (_addon && onLiveStreamReminderStatusChangeFailed && onLiveStreamReminderStatusChangeFailed instanceof Function) {
          _onLiveStreamReminderStatusChangeFailed = onLiveStreamReminderStatusChangeFailed;
          return true
        }
        return false
      },
      /**
       * Set onUserThresholdReachedForLiveStream callback.
       * @method SetOnUserThresholdReachedForLiveStreamCB
       * @param {Function} onUserThresholdReachedForLiveStream
       * @return {Boolean} true or false
       */
      SetOnUserThresholdReachedForLiveStreamCB: function (onUserThresholdReachedForLiveStream) {
        if (_addon && onUserThresholdReachedForLiveStream && onUserThresholdReachedForLiveStream instanceof Function) {
          _onUserThresholdReachedForLiveStream = onUserThresholdReachedForLiveStream;
          return true
        }
        return false
      },
      /** 
       * Determines if it is able to start live streaming.
       * @method CanStartLiveStream
       * @return {Number} If it is enabled to start the live streaming, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
       */
      CanStartLiveStream: function () {
        if (_addon) {
          return _addon.CanStartLiveStream();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE
      },
      /** 
       * Start live streaming.
       * @method StartLiveStream
       * @param {Number} liveStreamHandle The handle of live stream item.
       * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
       */
      StartLiveStream: function (opts) {
        if (_addon) {
          let clientOpts = opts || {};
          let liveStreamHandle = clientOpts.liveStreamHandle;
          if (!liveStreamHandle) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER; 
          }
          try {
            let StartLiveStreamParams = new messages.StartLiveStreamParams();
            StartLiveStreamParams.setLivestreamhandle(Number(liveStreamHandle));
            let bytes = StartLiveStreamParams.serializeBinary();
            return _addon.StartLiveStream(bytes);            
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE
      },
      /** 
       * Start live streaming.
       * @method StartLiveStreamWithSteamingURL
       * @param {String} streamingURL The URL of live streaming.
       * @param {String} streamingKey The key of live streaming. 
       * @param {String} broadcastURL The broadcast URL of live-stream.
       * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
       * @note Get the parameters from the third party of live stream service.
       */
      StartLiveStreamWithSteamingURL: function (opts) {
        if (_addon) {
          let clientOpts = opts || {};
          let streamingURL = clientOpts.streamingURL;
          let streamingKey = clientOpts.streamingKey;
          let broadcastURL = clientOpts.broadcastURL;
          try {
            let StartLiveStreamWithSteamingURLParams = new messages.StartLiveStreamWithSteamingURLParams();
            StartLiveStreamWithSteamingURLParams.setStreamingurl(streamingURL);
            StartLiveStreamWithSteamingURLParams.setStreamingkey(streamingKey);
            StartLiveStreamWithSteamingURLParams.setBroadcasturl(broadcastURL);
            let bytes = StartLiveStreamWithSteamingURLParams.serializeBinary();
            return _addon.StartLiveStreamWithSteamingURL(bytes);            
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE
      },
      /** 
       * Stop live streaming.
       * @method StopLiveStream
       * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
       */
      StopLiveStream: function () {
        if (_addon) {
          return _addon.StopLiveStream();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE
      },
      /** 
       * Get the list of live stream information items in the current meeting.
       * @method GetSupportLiveStreamItems
       * @return {Array} If the function succeeds, the return value is a list of live stream item objects, each with the following properties:
       *   - liveStreamURL: The URL of the live stream meeting.
       *   - liveStreamURLDescription: The descriptions of live stream.
       *   - liveStreamViewerURL: The viewer URL of the live stream meeting.
       */
      GetSupportLiveStreamItems: function () {
        if (_addon) {
          return _addon.GetSupportLiveStreamItems();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE
      },
      /** 
       * Get the current live stream object. 
       * @method GetCurrentLiveStreamItem
       * @return {Object} If the function succeeds, the return value is the current live stream object with the following properties:
       *   - liveStreamURL: The URL of the live stream meeting.
       *   - liveStreamURLDescription: The descriptions of live stream.
       *   - liveStreamViewerURL: The viewer URL of the live stream meeting.
       */
      GetCurrentLiveStreamItem: function () {
        if (_addon) {
          return _addon.GetCurrentLiveStreamItem();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE
      },
      /** 
       * Get live stream status of current meeting.
       * @method GetCurrentLiveStreamStatus
       * @return {Number} If the function succeeds, the return value is the live stream status of current meeting. Otherwise, this function returns an error.
       */
      GetCurrentLiveStreamStatus: function () {
        if (_addon) {
          return _addon.GetCurrentLiveStreamStatus();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE
      },
      /** 
       * Stop raw live streaming.
       * @method StopRawLiveStream
       * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
       */
      StopRawLiveStream: function () {
        if (_addon) {
          return _addon.StopRawLiveStream();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE
      },
      /** 
       * Get the live stream item info.
       * @method GetLiveStreamItemInfo
       * @param {Number} liveStreamHandle The handle of live stream.
       * @return {Object} If the function succeeds, the return value is a live stream item object with the following properties:
       *   - liveStreamURL: The URL of the live stream meeting.
       *   - liveStreamURLDescription: The descriptions of live stream.
       *   - liveStreamViewerURL: The viewer URL of the live stream meeting.
       */
      GetLiveStreamItemInfo: function (opts) {
        if (_addon) {
          let clientOpts = opts || {};
          let liveStreamHandle = clientOpts.liveStreamHandle;
          if (!liveStreamHandle) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER; 
          }
          try {
            let GetLiveStreamItemInfoParams = new messages.GetLiveStreamItemInfoParams();
            GetLiveStreamItemInfoParams.setLivestreamhandle(Number(liveStreamHandle));
            let bytes = GetLiveStreamItemInfoParams.serializeBinary();
            return _addon.GetLiveStreamItemInfo(bytes);            
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE
      },
      /** 
       * Query whether the meeting supports raw live streams.
       * @method IsRawLiveStreamSupported
       * @return {Boolean} true if supported, false if not supported.
       */
      IsRawLiveStreamSupported: function () {
        if (_addon) {
          return _addon.IsRawLiveStreamSupported();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE
      },
      /** 
       * Whether if the current user is able to start raw live streaming.
       * @method CanStartRawLiveStream
       * @return {Number} If the current user is able to start raw live streaming, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
       */
      CanStartRawLiveStream: function () {
        if (_addon) {
          return _addon.CanStartRawLiveStream();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE
      },
      /** 
       * Remove the raw live stream privilege.
       * @method RemoveRawLiveStreamPrivilege
       * @param {Number} userID Specify the ID of the user whose privilege will be removed.
       * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
       */
      RemoveRawLiveStreamPrivilege: function (opts) {
        if (_addon) {
          let clientOpts = opts || {};
          let userID = clientOpts.userID;
          if (!userID) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER; 
          }
          try {
            let RemoveRawLiveStreamPrivilegeParams = new messages.RemoveRawLiveStreamPrivilegeParams();
            RemoveRawLiveStreamPrivilegeParams.setUserid(Number(userID));
            let bytes = RemoveRawLiveStreamPrivilegeParams.serializeBinary();
            return _addon.RemoveRawLiveStreamPrivilege(bytes);            
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE
      },
      /** 
       * Get a list of current active raw live streams.
       * @method GetRawLiveStreamingInfoList
       * @return {Array} If the function succeeds, the return value is a list of raw live stream info objects, each with the following properties:
       *   - userId: The user ID.
       *   - broadcastUrl: The broadcast URL.
       *   - broadcastName: The broadcast name.
       */
      GetRawLiveStreamingInfoList: function () {
        if (_addon) {
          return _addon.GetRawLiveStreamingInfoList();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE
      },
      /** 
       * Get the list of users'IDs who have raw live stream privileges.
       * @method GetRawLiveStreamPrivilegeUserList
       * @return {Array} If the function succeeds, the return value is a list of user IDs who have raw live stream privileges.
       */
      GetRawLiveStreamPrivilegeUserList: function () {
        if (_addon) {
          return _addon.GetRawLiveStreamPrivilegeUserList();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE
      },
      /** 
       * Check if the live stream reminder is enabled.
       * @method IsLiveStreamReminderEnabled
       * @return {Boolean} true indicates the live stream reminder is enabled.
       * @note When the live stream reminder is enabled, the new join user is notified that the meeting is at capacity but that they can watch the meeting live stream with the callback onMeetingFullToWatchLiveStream when the meeting user has reached the meeting capability.
       */
      IsLiveStreamReminderEnabled: function () {
        if (_addon) {
          return _addon.IsLiveStreamReminderEnabled();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE
      },
      /** 
       * Check if the current user can enable/disable the live stream reminder.
       * @method CanEnableLiveStreamReminder
       * @return {Boolean} true indicates the current user can enable/disable the live stream reminder.
       */
      CanEnableLiveStreamReminder: function () {
        if (_addon) {
          return _addon.CanEnableLiveStreamReminder();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE
      },
      /** 
       * Enable or disable the live stream reminder.
       * @method EnableLiveStreamReminder
       * @param {Boolean} enable true indicates enable the live stream reminder. false indicates disable the live stream reminder.
       * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
       */
      EnableLiveStreamReminder: function (opts) {
        if (_addon) {
          let clientOpts = opts || {};
          let enable = clientOpts.enable;
          try {
            let EnableLiveStreamReminderParams = new messages.EnableLiveStreamReminderParams();
            EnableLiveStreamReminderParams.setEnable(enable);
            let bytes = EnableLiveStreamReminderParams.serializeBinary();
            return _addon.EnableLiveStreamReminder(bytes);            
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
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
  ZoomMeetingLiveStreamCtrl: ZoomMeetingLiveStreamCtrl
}