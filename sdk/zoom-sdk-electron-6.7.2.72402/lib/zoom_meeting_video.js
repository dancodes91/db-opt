const { ZoomSDKError } = require('./settings.js');
const messages = require('./electron_sdk_pb.js');

var ZoomMeetingVideo = (function () {
  var instance;
  /**
   * Zoom Meeting Video
   * @module zoom_meeting_video
   * @param {Function} onUserVideoStatusChange Callback event of the user video status changes.
   * @param {Function} onActiveSpeakerVideoUserChanged Callback event of the active speaker video user changes.
   * @param {Function} onActiveVideoUserChanged Callback event of the active video user changes.
   * @return {ZoomMeetingVideo}
   */
  function init(opts) {
    var clientOpts = opts || {};
    // Private methods and variables
    var _addon = clientOpts.addon.GetMeetingVideoCtrl();
    let _onUserVideoStatusChange = clientOpts.onUserVideoStatusChange || null;
    let _onActiveSpeakerVideoUserChanged = clientOpts.onActiveSpeakerVideoUserChanged || null;
    let _onActiveVideoUserChanged = clientOpts.onActiveVideoUserChanged || null;

    /**
     * Callback event of the user video status changes.
     * @event onUserVideoStatusChange
     * @param {String} userId The user ID whose video status changes
     * @param {String} status New video status {@link ZoomMeetingVideoStatus}
     * @note Valid for both normal user and webinar attendee.
     */
    function onUserVideoStatusChange(userId, status) {
      if (_onUserVideoStatusChange) {
        _onUserVideoStatusChange(userId, status)
      }
    }

    /**
     * Callback event of the active speaker video user changes.
     * @event onActiveSpeakerVideoUserChanged
     * @param {String} userId The ID of user who becomes the new active speaker.
     */
    function onActiveSpeakerVideoUserChanged(userId) {
      if (_onActiveSpeakerVideoUserChanged) {
        _onActiveSpeakerVideoUserChanged(userId)
      }
    }

    /**
     * Callback event of the active video user changes.
     * @event onActiveVideoUserChanged
     * @param {String} userId The ID of user who becomes the new active speaker.
     */
    function onActiveVideoUserChanged(userId) {
      if (_onActiveVideoUserChanged) {
        _onActiveVideoUserChanged(userId)
      }
    }

    if (_addon) {
      _addon.SetMeetingVideoStatusCB(onUserVideoStatusChange);
      _addon.SetActiveSpeakerVideoUserChangedCB(onActiveSpeakerVideoUserChanged);
      _addon.SetActiveVideoUserChangedCB(onActiveVideoUserChanged);
    }

    return {
      // Public methods and variables
      /**
       * Set onUserVideoStatusChange callback.
       * @method MeetingVideo_SetMeetingVideoStatusCB
       * @param {Function} onUserVideoStatusChange
       * @return {Boolean} true or false
       */
      MeetingVideo_SetMeetingVideoStatusCB: function (onUserVideoStatusChange) {
        if (_addon && onUserVideoStatusChange && onUserVideoStatusChange instanceof Function) {
          _onUserVideoStatusChange = onUserVideoStatusChange;
          return true;
        }
        return false;
      },
      /**
       * Set onActiveSpeakerVideoUserChanged callback.
       * @method MeetingVideo_SetActiveSpeakerVideoUserChangedCB
       * @param {Function} onActiveSpeakerVideoUserChanged
       * @return {Boolean} true or false
       */
      MeetingVideo_SetActiveSpeakerVideoUserChangedCB: function (onActiveSpeakerVideoUserChanged) {
        if (_addon && onActiveSpeakerVideoUserChanged && onActiveSpeakerVideoUserChanged instanceof Function) {
          _onActiveSpeakerVideoUserChanged = onActiveSpeakerVideoUserChanged;
          return true;
        }
        return false;
      },
      /**
       * Set onActiveVideoUserChanged callback.
       * @method MeetingVideo_SetActiveVideoUserChangedCB
       * @param {Function} onActiveVideoUserChanged
       * @return {Boolean} true or false
       */
      MeetingVideo_SetActiveVideoUserChangedCB: function (onActiveVideoUserChanged) {
        if (_addon && onActiveVideoUserChanged && onActiveVideoUserChanged instanceof Function) {
          _onActiveVideoUserChanged = onActiveVideoUserChanged;
          return true;
        }
        return false;
      },
      /**
       * Turn off the user's own video.
       * @method MeetingVideo_MuteVideo
       * @param {Number} userid Specifies which the user's video to mute
       * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
       * @note Valid for both Zoom style and customize user interface mode.
       */
      MeetingVideo_MuteVideo: function(opts) {
        if(_addon) {
          let clientOpts = opts || {};
          let userid = clientOpts.userid;
          try {
            let MuteVideoParams = new messages.MuteVideoParams();
            MuteVideoParams.setUserid(Number(userid));
            let bytes = MuteVideoParams.serializeBinary();
            return _addon.MuteVideo(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * Turn on the user's own video.
       * @method MeetingVideo_UnMuteVideo
       * @param {Number} userid Specifies which the user's video to unmute
       * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
       * @note Valid for both Zoom style and customize user interface mode.
       */
      MeetingVideo_UnMuteVideo: function (opts) {
        if(_addon) {
          let clientOpts = opts || {};
          let userid = clientOpts.userid;
          try {
            let UnMuteVideoParams = new messages.UnMuteVideoParams();
            UnMuteVideoParams.setUserid(Number(userid));
            let bytes = UnMuteVideoParams.serializeBinary();
            return _addon.UnMuteVideo(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * Pin the video of the assigned user to the first view.
       * @method MeetingVideo_PinVideoToFirstView
       * @param {Boolean} bPin bPin or not
       * @param {Boolean} bFirstView bFirstView or not
       * @param {Number} userid Specifies which the user's video to pin
       * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
       * @note Valid only for Zoom style user interface mode.
       */
      MeetingVideo_PinVideoToFirstView: function (opts) {
        if (_addon) {
          let clientOpts = opts || {};
          let bPin = clientOpts.bPin;
          let bFirstView = clientOpts.bFirstView;
          let userid = clientOpts.userid;
          try {
            let PinVideoToFirstViewParams = new messages.PinVideoToFirstViewParams();
            PinVideoToFirstViewParams.setBpin(bPin);
            PinVideoToFirstViewParams.setBfirstview(bFirstView);
            PinVideoToFirstViewParams.setUserid(Number(userid));
            let bytes = PinVideoToFirstViewParams.serializeBinary();
            return _addon.PinVideoToFirstView(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * Spotlight the video of the assigned user to the first view.
       * @method MeetingVideo_SpotlightVideo
       * @param {Number} userid Specifies which the user's video to pin
       * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
       * @note Valid for both Zoom style and customize user interface mode.
       */
      MeetingVideo_SpotlightVideo: function (opts) {
        if (_addon) {
          let clientOpts = opts || {};
          let userid = clientOpts.userid;
          try {
            let SpotlightVideoParams = new messages.SpotlightVideoParams();
            SpotlightVideoParams.setUserid(Number(userid));
            let bytes = SpotlightVideoParams.serializeBinary();
            return _addon.SpotlightVideo(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Display or not the user who does not turn on the video in the video all mode.
      * @method MeetingVideo_HideOrShowNoVideoUserOnVideoWall
      * @param {Boolean} bHide bHide or not
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      * @note Valid only for Zoom style user interface mode.
      */
      MeetingVideo_HideOrShowNoVideoUserOnVideoWall: function (opts) {
        if (_addon) {
          let clientOpts = opts || {};
          let bHide = clientOpts.bHide;
          try {
            let HideOrShowNoVideoUserOnVideoWallParams = new messages.HideOrShowNoVideoUserOnVideoWallParams();
            HideOrShowNoVideoUserOnVideoWallParams.setBhide(bHide);
            let bytes = HideOrShowNoVideoUserOnVideoWallParams.serializeBinary();
            return _addon.HideOrShowNoVideoUserOnVideoWall(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * Set the video quality preference that automatically adjust user's video to prioritize frame rate versus resolution based on the current bandwidth available.
       * @method MeetingVideo_SetVideoQualityPreference
       * @param {Number} mode 0: Balance mode; 1: Smoothness mode; 2: Sharpness mode; 3: Custom mode
       * @param {Number} minimumFrameRate 0 for the default value,minimum_frame_rate should be less than maximum_frame_rate, range: from 0 to 30 .out of range for frame-rate will use default frame-rate of Zoom
       * @param {Number} maximumFrameRate 0 for the default value,maximum_frame_rate should be less and equal than 30, range: from 0 to 30.out of range for frame-rate will use default frame-rate of Zoom
       * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
       */
      MeetingVideo_SetVideoQualityPreference: function (opts) {
        if (_addon) {
          let clientOpts = opts || {};
          let mode = clientOpts.mode;
          let minimumFrameRate = clientOpts.minimumFrameRate;
          let maximumFrameRate = clientOpts.maximumFrameRate;
          try {
            let SetVideoQualityPreferenceParams = new messages.SetVideoQualityPreferenceParams();
            SetVideoQualityPreferenceParams.setMode(mode);
            SetVideoQualityPreferenceParams.setMinimumframerate(minimumFrameRate);
            SetVideoQualityPreferenceParams.setMaximumframerate(maximumFrameRate);
            let bytes = SetVideoQualityPreferenceParams.serializeBinary();
            return _addon.SetVideoQualityPreference(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      }
    };
  };

  return {
    getInstance: function(opts) {
      if (!instance) {
        instance = init(opts);
      }
      return instance;
    }
  };
})();

module.exports = {
  ZoomMeetingVideo: ZoomMeetingVideo
}
