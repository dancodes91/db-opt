const { ZoomSDKError } = require('./settings.js');
const messages = require('./electron_sdk_pb.js');

var ZoomMeetingAudio = (function () {
  var instance;
  /**
   * Zoom Meeting Audio
   * @module zoom_meeting_audio
   * @param {Function} onUserAudioStatusChange User's audio status changed callback.
   * @param {Function} onUserActiveAudioChange The callback event that users whose audio is active changed.
   * @param {Function} onMuteOnEntryStatusChange Callback event for the mute on entry status change.
   * @return {ZoomMeetingAudio}
   */
  function init(opts) {
    var clientOpts = opts || {};

    // Private methods and variables
    var _addon = clientOpts.addon.GetMeetingAudioCtrl() || null;
    let _onUserAudioStatusChange = clientOpts.onUserAudioStatusChange || null;
    let _onUserActiveAudioChange = clientOpts.onUserActiveAudioChange || null;
    let _onMuteOnEntryStatusChange = clientOpts.onMuteOnEntryStatusChange || null;

    /**
      * User's audio status changed callback.
      * @event onUserAudioStatusChange
      * @param {Array} lstAudioStatusChange List of the user information with audio status changed. The list will be emptied once the function calls end. Each item contains:
      *   - userId: The user ID.
      *   - audioStauts: The audio status of the user {@link ZNAudioStatus}.
      * @param {String} strAudioStatusList List of the user information whose audio status changes, saved in json format. This parameter is currently invalid, hereby only for reservations.
      */
    function onUserAudioStatusChange(lstAudioStatusChange, strAudioStatusList) {
      if (_onUserAudioStatusChange) {
        _onUserAudioStatusChange(lstAudioStatusChange, strAudioStatusList)
      }
    }

    /**
      * The callback event that users whose audio is active changed.
      * @event onUserActiveAudioChange
      * @param {Array} lstActiveAudio List to store the ID of user whose audio is active.
      */
    function onUserActiveAudioChange(lstActiveAudio) {
      if (_onUserActiveAudioChange) {
        _onUserActiveAudioChange(lstActiveAudio)
      }
    }

    /**
      * Callback event for the mute on entry status change.
      * @event onMuteOnEntryStatusChange
      * @param {Boolean} bEnabled Specify whether mute on entry is enabled or not.
      */
    function onMuteOnEntryStatusChange(bEnabled) {
      if (_onMuteOnEntryStatusChange) {
        _onMuteOnEntryStatusChange(bEnabled)
      }
    }

    if (_addon) {
      _addon.SetMeetingAudioStatusCB(onUserAudioStatusChange);
      _addon.SetUserActiveAudioChangeCB(onUserActiveAudioChange);
      _addon.SetOnMuteOnEntryStatusChangeCB(onMuteOnEntryStatusChange);
    }

    return {
      // Public methods and variables
      /**
       * Set onUserAudioStatusChange callback.
       * @method MeetingAudio_SetMeetingAudioStatusCB
       * @param {Function} onUserAudioStatusChange
       * @return {Boolean} true or false
       */
      MeetingAudio_SetMeetingAudioStatusCB: function (onUserAudioStatusChange) {
        if (_addon && onUserAudioStatusChange && onUserAudioStatusChange instanceof Function) {
          _onUserAudioStatusChange = onUserAudioStatusChange;
          return true
        }
        return false
      },
      /**
       * Set onUserActiveAudioChange callback.
       * @method MeetingAudio_SetUserActiveAudioChangeCB
       * @param {Function} onUserActiveAudioChange
       * @return {Boolean} true or false
       */
      MeetingAudio_SetUserActiveAudioChangeCB: function (onUserActiveAudioChange) {
        if (_addon && onUserActiveAudioChange && onUserActiveAudioChange instanceof Function) {
          _onUserActiveAudioChange = onUserActiveAudioChange;
          return true
        }
        return false
      },
      /**
       * Set onMuteOnEntryStatusChange callback.
       * @method MeetingAudio_SetOnMuteOnEntryStatusChangeCB
       * @param {Function} onMuteOnEntryStatusChange
       * @return {Boolean} true or false
       */
      MeetingAudio_SetOnMuteOnEntryStatusChangeCB: function (onMuteOnEntryStatusChange) {
        if (_addon && onMuteOnEntryStatusChange && onMuteOnEntryStatusChange instanceof Function) {
          _onMuteOnEntryStatusChange = onMuteOnEntryStatusChange;
          return true
        }
        return false
      },
      /**
      * Mute the assigned user.
      * @method MeetingAudio_MuteAudio
      * @param {Number} userid Specify the user ID to mute. ZERO(0) indicates to mute all the participants.
      * @param {Boolean} allowunmutebyself The user may unmute himself when everyone is muted.
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      * @note Valid for both ZOOM style and user custom interface mode.
      */
      MeetingAudio_MuteAudio: function (opts) {
        if (_addon) {
          let clientOpts = opts || {};
          let userid = clientOpts.userid || '';
          let allowunmutebyself = clientOpts.allowunmutebyself;
          try {
            let MuteAudioParams = new messages.MuteAudioParams();
            MuteAudioParams.setUserid(userid);
            MuteAudioParams.setAllowunmutebyself(allowunmutebyself);
            let bytes = MuteAudioParams.serializeBinary();
            return _addon.MuteAudio(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Unmute the assigned user.
      * @method MeetingAudio_UnMuteAudio
      * @param {Number} userid Specify the user ID to unmute.
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      * @note Valid for both ZOOM style and user custom interface mode.
      */
      MeetingAudio_UnMuteAudio: function (opts) {
        if (_addon) {
          var clientOpts = opts || {};
          var userid = clientOpts.userid;
          try {
            let UnmuteAudioParams = new messages.UnmuteAudioParams();
            UnmuteAudioParams.setUserid(userid);
            let bytes = UnmuteAudioParams.serializeBinary();
            return _addon.UnMuteAudio(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Join VoIP meeting.
      * @method MeetingAudio_JoinVoip
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      * @note Valid for both ZOOM style and user custom interface mode.
      */
      MeetingAudio_JoinVoip: function () {
        if (_addon){
          return _addon.JoinVoip();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Leave VoIP meeting.
      * @method MeetingAudio_LeaveVoip
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      * @note Valid for both ZOOM style and user custom interface mode.
      */
      MeetingAudio_LeaveVoip: function () {
        if (_addon) {
          return _addon.LeaveVoip();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * User joins or leaves the meeting in silence or no.
      * @method MeetingAudio_EnablePlayChimeWhenEnterOrExit
      * @param {Boolean} bEnable true indicates to play chime when the user joins or leaves the meeting.
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      * @note Valid for both ZOOM style and user custom interface mode.
      */
      MeetingAudio_EnablePlayChimeWhenEnterOrExit: function (opts) {
        if (_addon) {
          var clientOpts = opts || {};
          var bEnable = clientOpts.bEnable;
          try {
            let EnablePlayChimeWhenEnterOrExitParams = new messages.EnablePlayChimeWhenEnterOrExitParams();
            EnablePlayChimeWhenEnterOrExitParams.setBenable(bEnable);
            let bytes = EnablePlayChimeWhenEnterOrExitParams.serializeBinary();
            return _addon.EnablePlayChimeWhenEnterOrExit(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Mute or umute the user after joining the meeting.
      * @method MeetingAudio_EnableMuteOnEntry
      * @param {Boolean} bEnable true indicates to mute the user after joining the meeting.
      * @param {Boolean} allowUnmuteBySelf
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      * @note Valid for both ZOOM style and user custom interface mode.
      */
      MeetingAudio_EnableMuteOnEntry: function (opts) {
        if (_addon) {
          var clientOpts = opts || {};
          var bEnable = clientOpts.bEnable;
          var allowUnmuteBySelf = clientOpts.allowUnmuteBySelf;
          try {
            let EnableMuteOnEntryParams = new messages.EnableMuteOnEntryParams();
            EnableMuteOnEntryParams.setBenable(bEnable);
            EnableMuteOnEntryParams.setAllowunmutebyself(allowUnmuteBySelf);
            let bytes = EnableMuteOnEntryParams.serializeBinary();
            return _addon.EnableMuteOnEntry(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * Check if the host or cohost can enable mute on entry.
       * @method MeetingAudio_CanEnableMuteOnEntry
       * @return {Boolean} true if the host or cohost can enable mute on entry. Otherwise, false.
       * @note Valid for both ZOOM style and user custom interface mode.
       */
      MeetingAudio_CanEnableMuteOnEntry: function () {
        if (_addon) {
          return _addon.CanEnableMuteOnEntry();
        }
        return false;
      },
      /**
      * Determine if mute on entry is enabled.
      * @method MeetingAudio_IsMuteOnEntryEnabled
      * @return {Boolean} true indicates that mute on entry is enabled. 
      */
      MeetingAudio_IsMuteOnEntryEnabled: function () {
        if (_addon) {
          return _addon.IsMuteOnEntryEnabled();
        }
        return false;
      },
      /**
      * Enable or disable SDK to play meeting audio.
      * @method MeetingAudio_EnablePlayMeetingAudio
      * @note SDK will not support sharing computer sound when disabling playing meeting audio.
      * @param {Boolean} bEnable true to enable SDK to play meeting audio, false to disable.
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      */
      MeetingAudio_EnablePlayMeetingAudio: function (opts) {
        if (_addon) {
          var clientOpts = opts || {};
          var bEnable = clientOpts.bEnable;
          try {
            let EnablePlayMeetingAudioParams = new messages.EnablePlayMeetingAudioParams();
            EnablePlayMeetingAudioParams.setBenable(bEnable);
            let bytes = EnablePlayMeetingAudioParams.serializeBinary();
            return _addon.EnablePlayMeetingAudio(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Determine if play meeting audio is enabled or not.
      * @method MeetingAudio_IsPlayMeetingAudioEnabled
      * @return {Boolean} true if enabled. Otherwise, false.
      */
      MeetingAudio_IsPlayMeetingAudioEnabled: function () {
        if (_addon) {
          return _addon.IsPlayMeetingAudioEnabled();
        }
        return false;
      }
    };
  }

  return {
    getInstance: function (opts) {
      if (!instance) {
        instance = init(opts);
      }
      return instance
    }
  };
})();

module.exports = {
  ZoomMeetingAudio: ZoomMeetingAudio
};
