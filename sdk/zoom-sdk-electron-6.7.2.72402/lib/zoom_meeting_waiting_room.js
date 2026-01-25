let { ZoomSDKError } = require('./settings.js');
const messages = require('./electron_sdk_pb.js');

var ZoomMeetingWaitingRoom = (function () {
  var instance;
  /**
   * Zoom Meeting Waiting Room
   * @module zoom_meeting_waiting_room
   * @param {Function} onWaitingRoomUserJoin Callback event of notification that user joins the waiting room.
   * @param {Function} onWaitingRoomUserLeft Callback event of notification that user leaves the waiting room.
   * @param {Function} onWaitingRoomPresetAudioStatusChanged During the waiting room, this callback event will be triggered when host change audio status.
   * @param {Function} onWaitingRoomPresetVideoStatusChanged During the waiting room, this callback event will be triggered when host change video status.
   * @param {Function} onCustomWaitingRoomDataUpdated During the waiting room, this callback event will be triggered when RequestCustomWaitingRoomData called.
   * @param {Function} onWaitingRoomUserNameChanged Callback indicating that the name of a user in the waiting room has changed.
   * @param {Function} onWaitingRoomEntranceEnabled This callback event will be triggered when host or cohost enables or disables waiting room entrance.
   * @return {ZoomMeetingWaitingRoom}
   */
  function init(opts) {
    let clientOpts = opts || {};
    // Private methods and variables
    let _addon = clientOpts.addon.GetMeetingWaitingRoomCtrl() || null;
    let _onWaitingRoomUserJoin = clientOpts.onWaitingRoomUserJoin || null;
    let _onWaitingRoomUserLeft = clientOpts.onWaitingRoomUserLeft || null;
    let _onWaitingRoomPresetAudioStatusChanged = clientOpts.onWaitingRoomPresetAudioStatusChanged || null;
    let _onWaitingRoomPresetVideoStatusChanged = clientOpts.onWaitingRoomPresetVideoStatusChanged || null;
    let _onCustomWaitingRoomDataUpdated = clientOpts.onCustomWaitingRoomDataUpdated || null;
    let _onWaitingRoomUserNameChanged = clientOpts.onWaitingRoomUserNameChanged || null;
    let _onWaitingRoomEntranceEnabled = clientOpts.onWaitingRoomEntranceEnabled || null;

    /**
     * Callback event of notification that user joins the waiting room.
     * @event onWaitingRoomUserJoin
     * @param {Number} userID The ID of user who joins the waiting room.
     */
    function onWaitingRoomUserJoin(userID) {
      if (_onWaitingRoomUserJoin) {
        _onWaitingRoomUserJoin(userID)
      }
    }

    /**
     * Callback event of notification that user leaves the waiting room.
     * @event onWaitingRoomUserLeft
     * @param {Number} userID The ID of user who leaves the waiting room.
     */
    function onWaitingRoomUserLeft(userID) {
      if (_onWaitingRoomUserLeft) {
        _onWaitingRoomUserLeft(userID)
      }
    }

    /**
     * During the waiting room, this callback event will be triggered when host change audio status.
     * @event onWaitingRoomPresetAudioStatusChanged
     * @param {Boolean} bAudioCanTurnOn true if audio can be turned on, false otherwise.
     */
    function onWaitingRoomPresetAudioStatusChanged(bAudioCanTurnOn) {
      if (_onWaitingRoomPresetAudioStatusChanged) {
        _onWaitingRoomPresetAudioStatusChanged(bAudioCanTurnOn)
      }
    }
  
    /**
     * During the waiting room, this callback event will be triggered when host change video status.
     * @event onWaitingRoomPresetVideoStatusChanged
     * @param {Boolean} bVideoCanTurnOn true if video can be turned on, false otherwise.
     */
    function onWaitingRoomPresetVideoStatusChanged(bVideoCanTurnOn) {
      if (_onWaitingRoomPresetVideoStatusChanged) {
        _onWaitingRoomPresetVideoStatusChanged(bVideoCanTurnOn)
      }
    }

    /**
     * During the waiting room, this callback event will be triggered when RequestCustomWaitingRoomData called.
     * @event onCustomWaitingRoomDataUpdated
     * @param {Object} bData The WaitingRoom Customize Data Info with the following properties:
     *   - title
     *   - description
     *   - logo_path
     *   - video_path
     *   - image_path
     *   - type: 0: Default; 1: Logo; 2: Video
     *   - status: 0: Init; 1: Downloading; 2: Download_OK; 3: Download_Failed
     *   - page_color
     *   - text_color
     *   - button_color
     */
    function onCustomWaitingRoomDataUpdated(bData) {
      let obj = {
        title: bData.title,
        description: bData.description,
        logo_path: bData.logo_path,
        video_path: bData.video_path,
        image_path: bData.image_path,
        type: bData.type,
        status: bData.status,
        page_color: bData.page_color,
        text_color: bData.text_color,
        button_color: bData.button_color
      }
      if (_onCustomWaitingRoomDataUpdated) {
        _onCustomWaitingRoomDataUpdated(obj)
      }
    }

    /**
     * Callback indicating that the name of a user in the waiting room has changed.
     * @event onWaitingRoomUserNameChanged
     * @param {Number} userID The ID of the user whose user name have has changed.
     * @param {String} userName The new user name.
     */
    function onWaitingRoomUserNameChanged(userID, userName) {
      if (_onWaitingRoomUserNameChanged) {
        _onWaitingRoomUserNameChanged(userID, userName)
      }
    }

    /**
     * This callback event will be triggered when host or cohost enables or disables waiting room entrance.
     * @event onWaitingRoomEntranceEnabled
     * @param {Boolean} bIsEnabled true indicates waiting room entrance is enabled, false indicates waiting room entrance is disabled.
     */
    function onWaitingRoomEntranceEnabled(bIsEnabled) {
      if (_onWaitingRoomEntranceEnabled) {
        _onWaitingRoomEntranceEnabled(bIsEnabled)
      }
    }

    if (_addon) {
      _addon.SetOnWaitingRoomUserJoinCB(onWaitingRoomUserJoin);
      _addon.SetOnWaitingRoomUserLeftCB(onWaitingRoomUserLeft);
      _addon.SetOnWaitingRoomPresetAudioStatusChangedCB(onWaitingRoomPresetAudioStatusChanged);
      _addon.SetOnWaitingRoomPresetVideoStatusChangedCB(onWaitingRoomPresetVideoStatusChanged);
      _addon.SetOnCustomWaitingRoomDataUpdatedCB(onCustomWaitingRoomDataUpdated);
      _addon.SetOnWaitingRoomUserNameChangedCB(onWaitingRoomUserNameChanged);
      _addon.SetOnWaitingRoomEntranceEnabledCB(onWaitingRoomEntranceEnabled);
    }

    return {
      // Public methods and variables
      /**
       * Set onWaitingRoomUserJoin callback.
       * @method SetOnWaitingRoomUserJoinCB
       * @param {Function} onWaitingRoomUserJoin
       * @return {Boolean} true or false
       */
      SetOnWaitingRoomUserJoinCB: function (onWaitingRoomUserJoin) {
        if (_addon && onWaitingRoomUserJoin && onWaitingRoomUserJoin instanceof Function) {
          _onWaitingRoomUserJoin = onWaitingRoomUserJoin;
          return true;
        }
        return false;
      },
      /**
       * Set onWaitingRoomUserLeft callback.
       * @method SetOnWaitingRoomUserLeftCB
       * @param {Function} onWaitingRoomUserLeft
       * @return {Boolean} true or false
       */
      SetOnWaitingRoomUserLeftCB: function (onWaitingRoomUserLeft) {
        if (_addon && onWaitingRoomUserLeft && onWaitingRoomUserLeft instanceof Function) {
          _onWaitingRoomUserLeft = onWaitingRoomUserLeft;
          return true;
        }
        return false;
      },
      /**
       * Set onWaitingRoomPresetAudioStatusChanged callback.
       * @method SetOnWaitingRoomPresetAudioStatusChangedCB
       * @param {Function} onWaitingRoomPresetAudioStatusChanged
       * @return {Boolean} true or false
       */
      SetOnWaitingRoomPresetAudioStatusChangedCB: function (onWaitingRoomPresetAudioStatusChanged) {
        if (_addon && onWaitingRoomPresetAudioStatusChanged && onWaitingRoomPresetAudioStatusChanged instanceof Function) {
          _onWaitingRoomPresetAudioStatusChanged = onWaitingRoomPresetAudioStatusChanged;
          return true;
        }
        return false;
      },
      /**
       * Set onWaitingRoomPresetVideoStatusChanged callback.
       * @method SetOnWaitingRoomPresetVideoStatusChangedCB
       * @param {Function} onWaitingRoomPresetVideoStatusChanged
       * @return {Boolean} true or false
       */
      SetOnWaitingRoomPresetVideoStatusChangedCB: function (onWaitingRoomPresetVideoStatusChanged) {
        if (_addon && onWaitingRoomPresetVideoStatusChanged && onWaitingRoomPresetVideoStatusChanged instanceof Function) {
          _onWaitingRoomPresetVideoStatusChanged = onWaitingRoomPresetVideoStatusChanged;
          return true;
        }
        return false;
      },
      /**
       * Set onCustomWaitingRoomDataUpdated callback.
       * @method SetOnCustomWaitingRoomDataUpdatedCB
       * @param {Function} onCustomWaitingRoomDataUpdated
       * @return {Boolean} true or false
       */
      SetOnCustomWaitingRoomDataUpdatedCB: function (onCustomWaitingRoomDataUpdated) {
        if (_addon && onCustomWaitingRoomDataUpdated && onCustomWaitingRoomDataUpdated instanceof Function) {
          _onCustomWaitingRoomDataUpdated = onCustomWaitingRoomDataUpdated;
          return true;
        }
        return false;
      },
      /**
       * Set onWaitingRoomUserNameChanged callback.
       * @method SetOnWaitingRoomUserNameChangedCB
       * @param {Function} onWaitingRoomUserNameChanged
       * @return {Boolean} true or false
       */
      SetOnWaitingRoomUserNameChangedCB: function (onWaitingRoomUserNameChanged) {
        if (_addon && onWaitingRoomUserNameChanged && onWaitingRoomUserNameChanged instanceof Function) {
          _onWaitingRoomUserNameChanged = onWaitingRoomUserNameChanged;
          return true;
        }
        return false;
      },
      /**
       * Set onWaitingRoomEntranceEnabled callback.
       * @method SetOnWaitingRoomEntranceEnabledCB
       * @param {Function} onWaitingRoomEntranceEnabled
       * @return {Boolean} true or false
       */
      SetOnWaitingRoomEntranceEnabledCB: function (onWaitingRoomEntranceEnabled) {
        if (_addon && onWaitingRoomEntranceEnabled && onWaitingRoomEntranceEnabled instanceof Function) {
          _onWaitingRoomEntranceEnabled = onWaitingRoomEntranceEnabled;
          return true;
        }
        return false;
      },
      /**
      * Determines whether the current meeting supports the waiting room or not.
      * @method IsSupportWaitingRoom
      * @return {Boolean} true indicates to support.
      */
      IsSupportWaitingRoom: function () {
        if (_addon) {
          return _addon.IsSupportWaitingRoom();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Determines if the attendee is enabled to enter the waiting room when joining the meeting.
      * @method IsWaitingRoomOnEntryFlagOn
      * @return {Boolean} true indicates to enable to enter.
      */
      IsWaitingRoomOnEntryFlagOn: function () {
        if (_addon) {
          return _addon.IsWaitingRoomOnEntryFlagOn();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Sets to enable the attendee to enter the waiting room when joining the meeting.
      * @method EnableWaitingRoomOnEntry
      * @param {Boolean} bEnable true indicates to enable to enter. Otherwise, false.
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      */
      EnableWaitingRoomOnEntry: function (opts) {
        if (_addon) {
          var clientOpts = opts || {};
          var bEnable = clientOpts.bEnable;
          try {
            let EnableWaitingRoomOnEntryParams = new messages.EnableWaitingRoomOnEntryParams();
            EnableWaitingRoomOnEntryParams.setBenable(bEnable);
            let bytes = EnableWaitingRoomOnEntryParams.serializeBinary();
            return _addon.EnableWaitingRoomOnEntry(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Gets the list of attendees who are in the waiting room.
      * @method GetWaitingRoomList
      * @return {Array} If the function succeeds, the return value is the list of attendees. Otherwise, this function returns null.
      */
      GetWaitingRoomList: function () {
        if (_addon) {
          return _addon.GetWaitingRoomList();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * Gets the attendee information in the waiting room via user ID.
       * @method GetWaitingRoomUserInfoByID
       * @param {Number} userid Specifies the user ID.
       * @return {Object} If the function succeeds, the return value is an object with the following IUserInfo properties:
       *   - userName: The username matched with the current user information
       *   - isHost: Whether the member corresponding with the current information is the host
       *   - userID: The user ID matched with the current user information
       *   - avatarPath: The avatar file path matched with the current user information
       *   - persistentId: The user persistent id matched with the current user information
       *   - customerKey: The customer_key matched with the current user information
       *   - isVideoOn: Whether the video status of the user is turned on
       *   - isAudioMuted: Whether the audio status of the user is muted
       *   - audioJoinType: The type of audio when the user joins the meeting
       *   - isMySelf: Whether the current information corresponds to the user himself
       *   - isInWaitingRoom: Whether the user is in the waiting room
       *   - isRaiseHand: Whether the user raises hand
       *   - userRole: The type of role of the user
       *   - isPurePhoneUser: Whether the user joins the meeting by telephone
       *   - audioVoiceLevel: The mic level of the user
       *   - isClosedCaptionSender: Whether the user is the sender of Closed Caption
       *   - isTalking: Whether the user is talking
       *   - isH323User: Whether the user is H323 user
       *   - webinarAttendeeStatus: The webinar status of the user
       *   - isInterpreter: Whether the user is a interpreter (Windows only)
       *   - isSignLanguageInterpreter: Whether the user is a sign language interpreter (Windows only)
       *   - interpreterActiveLanguage: The active language if the user is a interpreter (Windows only)
       *   - emojiFeedbackType: The emoji feedback type of the user (Windows only)
       *   - isCompanionModeUser: Whether the user is in companion mode (Windows only)
       *   - localRecordingStatus: The status of the local recording status
       *   - isRawLiveStreaming: Whether the user has started a raw live stream
       *   - hasRawLiveStreamPrivilege: Whether the user has raw live stream privilege
       *   - hasCamera: Whether the participant has a camera
       *   - isProductionStudioUser: Whether the user is production studio user
       *   - isInWebinarBackstage: Whether the user is in the webinar backstage
       *   - productionStudioParent: The parent user ID of the production studio user
       *   - isBotUser: Whether the user is bot user
       *   - botAppName: The bot app name
       *   - isVirtualNameTagEnabled: Whether the participant enabled virtual name tag
       *   - isAudioOnlyUser: Whether the specified user is an audio only user.
       */
      GetWaitingRoomUserInfoByID: function (opts) {
        if (_addon) {
          var clientOpts = opts || {};
          var userid = clientOpts.userid;
          if (userid == undefined) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
          try {
            let GetWaitingRoomUserInfoByIDParams = new messages.GetWaitingRoomUserInfoByIDParams();
            GetWaitingRoomUserInfoByIDParams.setUserid(userid);
            let bytes = GetWaitingRoomUserInfoByIDParams.serializeBinary();
            return _addon.GetWaitingRoomUserInfoByID(bytes)
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Permit the specified user to join the meeting.
      * @method AdmitToMeeting
      * @param {Number} userid Specifies the user ID.
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      */
      AdmitToMeeting: function (opts) {
        if (_addon) {
          var clientOpts = opts || {};
          var userid = clientOpts.userid;
          if (userid == undefined) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
          try {
            let AdmitToMeetingParams = new messages.AdmitToMeetingParams();
            AdmitToMeetingParams.setUserid(userid);
            let bytes = AdmitToMeetingParams.serializeBinary();
            return _addon.AdmitToMeeting(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Permit all of the users currently in the waiting room to join the meeting.
      * @method AdmitAllToMeeting
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      */
      AdmitAllToMeeting: function () {
        if (_addon) {
          return _addon.AdmitAllToMeeting();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Enable the specified user to enter the waiting room.
      * @method PutInWaitingRoom
      * @param {Number} userid Specifies the user ID.
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      */
      PutInWaitingRoom: function (opts) {
        if (_addon) {
          var clientOpts = opts || {};
          var userid = clientOpts.userid;
          if (userid == undefined) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
          try {
            let PutInWaitingRoomParams = new messages.PutInWaitingRoomParams();
            PutInWaitingRoomParams.setUserid(userid);
            let bytes = PutInWaitingRoomParams.serializeBinary();
            return _addon.PutInWaitingRoom(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Determines if the attendee is enabled to turn on audio when joining the meeting.
      * @method IsAudioEnabledInWaitingRoom
      * @return {Boolean} true indicates to enable to turn on.
      */
      IsAudioEnabledInWaitingRoom: function () {
        if (_addon) {
          return _addon.IsAudioEnabledInWaitingRoom();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Determines if the attendee is enabled to turn on video when joining the meeting.
      * @method IsVideoEnabledInWaitingRoom
      * @return {Boolean} true indicates to enable to turn on.
      */
      IsVideoEnabledInWaitingRoom: function () {
        if (_addon) {
          return _addon.IsVideoEnabledInWaitingRoom();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Get the WaitingRoom CustomizeData information in the waiting room.
      * @method RequestCustomWaitingRoomData
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      */
      RequestCustomWaitingRoomData: function () {
        if (_addon) {
          return _addon.RequestCustomWaitingRoomData();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Determines if the host or cohost can rename users in the waiting room.
      * @method CanRenameUser
      * @return {Boolean} true indicates the host or cohost can rename users in the waiting room. Otherwise they can't.
      */
      CanRenameUser: function () {
        if (_addon) {
          return _addon.CanRenameUser();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Change a user's screen name in the waiting room.
      * @method RenameUser
      * @param {Number} userid The ID of users put into the waiting room by a host or cohost.
      * @param {String} newName The new user name.
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      */
      RenameUser: function (opts) {
        if (_addon) {
          var clientOpts = opts || {};
          var userid = clientOpts.userid;
          var newName = clientOpts.newName;
          try {
            let RenameUserParams = new messages.RenameUserParams();
            RenameUserParams.setUserid(userid);
            RenameUserParams.setNewname(newName);
            let bytes = RenameUserParams.serializeBinary();
            return _addon.RenameUser(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Determines if a host or cohost can expel user(s) in the waiting room.
      * @method CanExpelUser
      * @return {Boolean} true indicates that a host or cohost can expel user(s) in the waiting room. Otherwise they may not
      */
      CanExpelUser: function () {
        if (_addon) {
          return _addon.CanExpelUser();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Remove a specified user from the waiting room.
      * @method ExpelUser
      * @param {Number} userid The ID of the user removed from the waiting room by a host or cohost.
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      */
      ExpelUser: function (opts) {
        if (_addon) {
          var clientOpts = opts || {};
          var userid = clientOpts.userid;
          try {
            let ExpelUserParams = new messages.ExpelUserParams();
            ExpelUserParams.setUserid(userid);
            let bytes = ExpelUserParams.serializeBinary();
            return _addon.ExpelUser(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * Retry to Download the WaitingRoom CustomizeData information in the waiting room.
       * @method Retry
       * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
       */
      Retry: function () {
        if (_addon) {
          return _addon.Retry();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * Ignore to Download the WaitingRoom CustomizeData information in the waiting room.
       * @method Ignore
       * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
       */
      Ignore: function () {
        if (_addon) {
          return _addon.Ignore();
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
  ZoomMeetingWaitingRoom: ZoomMeetingWaitingRoom
}
