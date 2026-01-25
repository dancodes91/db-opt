const { ZoomSDKError, SDKUserInfoType } = require('./settings.js');
const messages = require('./electron_sdk_pb.js');

var ZoomMeetingParticipantsCtrl = (function () {
  var instance;
  /**
   * Zoom Meeting Participants Ctrl
   * @module zoom_meeting_participants_ctrl
   * @param {Function} meetinguserjoincb Callback event of notification of users who are in the meeting.
   * @param {Function} meetinguserleftcb Callback event of notification of user who leaves the meeting.
   * @param {Function} meetinghostchangecb Callback event of notification of the new host.
   * @param {Function} onAllowParticipantsRequestCloudRecording Callback event that lets participants request that the host starts cloud recording.
   * @param {Function} onBotAuthorizerRelationChanged Callback event that the bot relationship changed in the meeting.
   * @return {ZoomMeetingParticipantsCtrl}
   */
  function init(opts) {
    var clientOpts = opts || {};

    // Private methods and variables
    var _addon = clientOpts.addon.GetMeetingParticipantsCtrl() || null;
    let _onUserJoin = clientOpts.meetinguserjoincb || null;
    let _onUserLeft = clientOpts.meetinguserleftcb || null;
    let _onHostChangeNotification = clientOpts.meetinghostchangecb || null;
    let _onAllowParticipantsRequestCloudRecording = clientOpts.onAllowParticipantsRequestCloudRecording || null;
    let _onBotAuthorizerRelationChanged = clientOpts.onBotAuthorizerRelationChanged || null;

    /**
     * Callback event of notification of users who are in the meeting.
     * @event onUserJoin
     * @param {Array} lstUserID List of user IDs.
     * @param {String} strUserList List of users in JSON format. This function is currently invalid, hereby only for reservations.
     * @note Valid for both normal user and webinar attendee.
     */
    function onUserJoin(lstUserID, strUserList) {
      if (_onUserJoin) {
        _onUserJoin(lstUserID, strUserList)
      }
    }

    /**
     * Callback event of notification of user who leaves the meeting.
     * @event onUserLeft
     * @param {Array} lstUserID List of the user ID who leaves the meeting.
     * @param {String} strUserList List of the users in JSON format. This function is currently invalid, hereby only for reservations.
     * @note Valid for both normal user and webinar attendee.
     */
    function onUserLeft(lstUserID, strUserList) {
      if (_onUserLeft) {
        _onUserLeft(lstUserID, strUserList)
      }
    }

    /**
     * Callback event of notification of the new host.
     * @event onHostChangeNotification
     * @param {Number} userId Specify the ID of the new host.
     */
    function onHostChangeNotification(userId) {
      if (_onHostChangeNotification) {
        _onHostChangeNotification(userId)
      }
    }

    /**
     * Callback event that lets participants request that the host starts cloud recording.
     * @event onAllowParticipantsRequestCloudRecording
     * @param {Boolean} bAllow true allow. If false, disallow.
     */
    function onAllowParticipantsRequestCloudRecording(bAllow) {
      if (_onAllowParticipantsRequestCloudRecording) {
        _onAllowParticipantsRequestCloudRecording(bAllow)
      }
    }

    /**
     * Callback event that the bot relationship changed in the meeting.
     * @event onBotAuthorizerRelationChanged
     * @param {Number} authorizeUserID Specify the authorizer user ID.
     */
    function onBotAuthorizerRelationChanged(authorizeUserID) {
      if (_onBotAuthorizerRelationChanged) {
        _onBotAuthorizerRelationChanged(authorizeUserID)
      }
    }

    if (_addon) {
      _addon.SetMeetingUserJoinCB(onUserJoin);
      _addon.SetMeetingUserLeftCB(onUserLeft);
      _addon.SetMeetingHostChangeCB(onHostChangeNotification);
      _addon.SetOnAllowParticipantsRequestCloudRecordingCB(onAllowParticipantsRequestCloudRecording);
      _addon.SetOnBotAuthorizerRelationChangedCB(onBotAuthorizerRelationChanged);
    }

    return {
      // Public methods and variables
      /**
       * Set meetinguserjoincb callback.
       * @method SetMeetingUserJoinCB
       * @param {Function} meetinguserjoincb
       * @return {Boolean} true or false
       */
      SetMeetingUserJoinCB: function(onUserJoin) {
        if (_addon && onUserJoin && onUserJoin instanceof Function) {
          _onUserJoin = onUserJoin;
          return true;
        }
        return false;
      },
      /**
       * Set meetinguserleftcb callback.
       * @method SetMeetingUserLeftCB
       * @param {Function} meetinguserleftcb
       * @return {Boolean} true or false
       */
      SetMeetingUserLeftCB: function(onUserLeft) {
        if (_addon && onUserLeft && onUserLeft instanceof Function) {
          _onUserLeft = onUserLeft;
          return true
        }
        return false
      },
      /**
       * Set meetinghostchangecb callback.
       * @method SetMeetingHostChangeCB
       * @param {Function} meetinghostchangecb
       * @return {Boolean} true or false
       */
      SetMeetingHostChangeCB: function(onHostChangeNotification) {
        if (_addon && onHostChangeNotification && onHostChangeNotification instanceof Function) {
          _onHostChangeNotification = onHostChangeNotification;
          return true;
        }
        return false;
      },
      /**
       * Set onAllowParticipantsRequestCloudRecording callback.
       * @method SetOnAllowParticipantsRequestCloudRecordingCB
       * @param {Function} onAllowParticipantsRequestCloudRecording
       * @return {Boolean} true or false
       */
      SetOnAllowParticipantsRequestCloudRecordingCB: function(onAllowParticipantsRequestCloudRecording) {
        if (_addon && onAllowParticipantsRequestCloudRecording && onAllowParticipantsRequestCloudRecording instanceof Function) {
          _onAllowParticipantsRequestCloudRecording = onAllowParticipantsRequestCloudRecording;
          return true;
        }
        return false;
      },
      /**
       * Set onBotAuthorizerRelationChanged callback.
       * @method SetOnBotAuthorizerRelationChangedCB
       * @param {Function} onBotAuthorizerRelationChanged
       * @return {Boolean} true or false
       */
      SetOnBotAuthorizerRelationChangedCB: function(onBotAuthorizerRelationChanged) {
        if (_addon && onBotAuthorizerRelationChanged && onBotAuthorizerRelationChanged instanceof Function) {
          _onBotAuthorizerRelationChanged = onBotAuthorizerRelationChanged;
          return true;
        }
        return false;
      },
      /**
       * Get the list of all the panelists in the meeting.
       * @method GetParticipantsList
       * @return {Array} If the function succeeds, the return value is the list of the panelists in the meeting. Otherwise the function fails and the return value is null.
       * @note Valid for both ZOOM style and user custom interface mode. Valid for both normal user and webinar attendee.
       */
      GetParticipantsList: function () {
        if (_addon) {
          return _addon.GetParticipantsList();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * Get the information of specified user.
       * @method GetUserInfoByUserID
       * @param {Number} userid Specify the user ID for which you want to get the information. Zero(0) indicates to get the information of the current user.
       * @return {Object} If the function succeeds, the return value is an object which includes the user's information with the following properties:
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
       * @note Valid for both ZOOM style and user custom interface mode. Valid for both normal user and webinar attendee.
       */
      GetUserInfoByUserID: function(userid) {
        if (_addon) {
          try {
            let GetUserInfoByUserIDParams = new messages.GetUserInfoByUserIDParams();
            GetUserInfoByUserIDParams.setUserid(Number(userid));
            let bytes = GetUserInfoByUserIDParams.serializeBinary();
            let userInfo = _addon.GetUserInfoByUserID(bytes);
            if (userInfo.userInfoType == SDKUserInfoType.FAKE_USERINFO) {
              return {}
            } else {
              return userInfo
            }
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * Get the information about the bot's authorized user.
       * @method GetBotAuthorizedUserInfoByUserID
       * @param {Number} userid Specify the user ID for which to get the information.
       * @return {Object} If the function succeeds, the return value is an object which includes the user's information with the following properties:
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
       * @note Valid for both ZOOM style and user custom interface mode.
       */
      GetBotAuthorizedUserInfoByUserID: function(opts) {
        if (_addon) {
          let clientOpts = opts || {};
          let userid = clientOpts.userid;
          try {
            let GetBotAuthorizedUserInfoByUserIDParams = new messages.GetBotAuthorizedUserInfoByUserIDParams();
            GetBotAuthorizedUserInfoByUserIDParams.setUserid(Number(userid));
            let bytes = GetBotAuthorizedUserInfoByUserIDParams.serializeBinary();
            return _addon.GetBotAuthorizedUserInfoByUserID(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * Get the authorizer's bot list.
       * @method GetAuthorizedBotListByUserID
       * @param {Number} userid Specify the user ID for which to get the information.
       * @return {Array} If the function succeeds, the return value is the authorizer's bot list in the meeting. Otherwise the function fails and the return value is an empty list.
       * @note Valid for both ZOOM style and user custom interface mode.
       */
      GetAuthorizedBotListByUserID: function(opts) {
        if (_addon) {
          let clientOpts = opts || {};
          let userid = clientOpts.userid;
          try {
            let GetAuthorizedBotListByUserIDParams = new messages.GetAuthorizedBotListByUserIDParams();
            GetAuthorizedBotListByUserIDParams.setUserid(Number(userid));
            let bytes = GetAuthorizedBotListByUserIDParams.serializeBinary();
            return _addon.GetAuthorizedBotListByUserID(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * Determine if the current user can enable participant request cloud recording.
       * @method CanEnableParticipantRequestCloudRecording
       * @return {Boolean} true if the current user can enable participant request cloud recording. Otherwise, false.
       */
      CanEnableParticipantRequestCloudRecording: function () {
        if (_addon) {
          return _addon.CanEnableParticipantRequestCloudRecording();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * Check whether the current meeting allows participants to send cloud recording privilege request, This can only be used in regular meetings and webinar(no breakout rooms).
       * @method IsParticipantRequestCloudRecordingAllowed
       * @return {Boolean} If allows participants to send request, the return value is true.
       */
      IsParticipantRequestCloudRecordingAllowed: function () {
        if (_addon) {
          return _addon.IsParticipantRequestCloudRecordingAllowed();
        }
        return false;
      },
      /**
       * Toggle whether attendees can requests for the host to start a cloud recording. This can only be used in regular meetings and webinar(no breakout rooms).
       * @method AllowParticipantsToRequestCloudRecording
       * @param {Boolean} bAllow true indicates that participants are allowed to send cloud recording privilege requests.
       * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
       */
      AllowParticipantsToRequestCloudRecording: function (opts) {
        if (_addon) {
          var clientOpts = opts || {};
          var bAllow = clientOpts.bAllow;
          try {
            let AllowParticipantsToRequestCloudRecordingParams = new messages.AllowParticipantsToRequestCloudRecordingParams();
            AllowParticipantsToRequestCloudRecordingParams.setBallow(bAllow);
            let bytes = AllowParticipantsToRequestCloudRecordingParams.serializeBinary();
            return _addon.AllowParticipantsToRequestCloudRecording(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
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
      return instance
    }
  };
})();

module.exports = {
  ZoomMeetingParticipantsCtrl: ZoomMeetingParticipantsCtrl
}
