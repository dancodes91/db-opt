let { ZoomSDKError } = require('./settings.js');
const messages = require('./electron_sdk_pb.js');

var ZoomMeetingWebinar = (function () {
  var instance;
  /**
   * Zoom Meeting Webinar
   * @module zoom_meeting_webinar
   * @param {Function} onPromptAttendee2PanelistResult Callback to promote attendees to panelist.
   * @param {Function} onDepromptPanelist2AttendeeResult Callback to demote attendees to panelist.
   * @param {Function} onAllowPanelistStartVideoNotification Callback to enable the panelist to start the video.
   * @param {Function} onDisallowPanelistStartVideoNotification Callback to disable the panelist to start the video.
   * @param {Function} onSelfAllowTalkNotification Callback event that attendees are required to enable the mic in the view-only mode of webinar.
   * @param {Function} onSelfDisallowTalkNotification Callback event that attendees are required to turn off the mic in the view-only mode of webinar.
   * @param {Function} onAllowAttendeeChatNotification Callback to enable the attendees to chat. Available only for the host and the co-host.
   * @param {Function} onDisallowAttendeeChatNotification Callback to disable the attendees to chat. Available only for the host and the co-host.
   * @param {Function} onAllowWebinarReactionStatusChanged Callback to emoji Reactions Status Changed.
   * @param {Function} onAllowAttendeeRaiseHandStatusChanged Callback to attendee raise hand Status Changed.
   * @param {Function} onAllowAttendeeViewTheParticipantCountStatusChanged Callback to attendee view the participant count status Changed.
   * @param {Function} onAttendeeAudioStatusNotification Attendee will receive this callback if his audio status changes.
   * @param {Function} onAttendeePromoteConfirmResult When attendee agree or decline the promote invitation, host will receive this callback.
   * @return {ZoomMeetingWebinar}
   */
  function init(opts) {
    let clientOpts = opts || {};
    // Private methods and variables
    let _addon = clientOpts.addon.GetMeetingWebinarCtrl() || null;
    let _onPromptAttendee2PanelistResult = clientOpts.onPromptAttendee2PanelistResult || null;
    let _onDepromptPanelist2AttendeeResult = clientOpts.onDepromptPanelist2AttendeeResult || null;
    let _onAllowPanelistStartVideoNotification = clientOpts.onAllowPanelistStartVideoNotification || null;
    let _onDisallowPanelistStartVideoNotification = clientOpts.onDisallowPanelistStartVideoNotification || null;
    let _onSelfAllowTalkNotification = clientOpts.onSelfAllowTalkNotification || null;
    let _onSelfDisallowTalkNotification = clientOpts.onSelfDisallowTalkNotification || null;
    let _onAllowAttendeeChatNotification = clientOpts.onAllowAttendeeChatNotification || null;
    let _onDisallowAttendeeChatNotification = clientOpts.onDisallowAttendeeChatNotification || null;
    let _onAllowWebinarReactionStatusChanged = clientOpts.onAllowWebinarReactionStatusChanged || null;
    let _onAllowAttendeeRaiseHandStatusChanged = clientOpts.onAllowAttendeeRaiseHandStatusChanged || null;
    let _onAllowAttendeeViewTheParticipantCountStatusChanged = clientOpts.onAllowAttendeeViewTheParticipantCountStatusChanged || null;
    let _onAttendeeAudioStatusNotification = clientOpts.onAttendeeAudioStatusNotification || null;
    let _onAttendeePromoteConfirmResult = clientOpts.onAttendeePromoteConfirmResult || null;

    /**
     * Callback to promote attendees to panelist.
     * @event onPromptAttendee2PanelistResult
     * @param {Number} result If the promotion is successful, the result is zero(0). Otherwise it is an error code.
     */
    function onPromptAttendee2PanelistResult(result) {
      if (_onPromptAttendee2PanelistResult) {
        _onPromptAttendee2PanelistResult(result)
      }
    }

    /**
     * Callback to demote attendees to panelist.
     * @event onDepromptPanelist2AttendeeResult
     * @param {Number} result If the demotion is successful, the result is zero(0), otherwise an error code.
     */
    function onDepromptPanelist2AttendeeResult(result) {
      if (_onDepromptPanelist2AttendeeResult) {
        _onDepromptPanelist2AttendeeResult(result)
      }
    }

    /**
     * Callback to enable the panelist to start the video.
     * @event onAllowPanelistStartVideoNotification
     */
    function onAllowPanelistStartVideoNotification() {
      if (_onAllowPanelistStartVideoNotification) {
        _onAllowPanelistStartVideoNotification()
      }
    }
  
    /**
     * Callback to disable the panelist to start the video.
     * @event onDisallowPanelistStartVideoNotification
     */
    function onDisallowPanelistStartVideoNotification() {
      if (_onDisallowPanelistStartVideoNotification) {
        _onDisallowPanelistStartVideoNotification()
      }
    }

    /**
     * Callback event that attendees are required to enable the mic in the view-only mode of webinar.
     * @event onSelfAllowTalkNotification
     */
    function onSelfAllowTalkNotification() {
      if (_onSelfAllowTalkNotification) {
        _onSelfAllowTalkNotification()
      }
    }

    /**
     * Callback event that attendees are required to turn off the mic in the view-only mode of webinar.
     * @event onSelfDisallowTalkNotification
     */
    function onSelfDisallowTalkNotification() {
      if (_onSelfDisallowTalkNotification) {
        _onSelfDisallowTalkNotification()
      }
    }

    /**
     * Callback to enable the attendees to chat. Available only for the host and the co-host.
     * @event onAllowAttendeeChatNotification
     */
    function onAllowAttendeeChatNotification() {
      if (_onAllowAttendeeChatNotification) {
        _onAllowAttendeeChatNotification()
      }
    }

    /**
     * Callback to disable the attendees to chat. Available only for the host and the co-host.
     * @event onDisallowAttendeeChatNotification
     */
    function onDisallowAttendeeChatNotification() {
      if (_onDisallowAttendeeChatNotification) {
        _onDisallowAttendeeChatNotification()
      }
    }

    /**
     * Callback to emoji Reactions Status Changed.
     * @event onAllowWebinarReactionStatusChanged
     * @param {Boolean} can_reaction If the Reaction is allowed, the result is true. Otherwise, false.
     */
    function onAllowWebinarReactionStatusChanged(can_reaction) {
      if (_onAllowWebinarReactionStatusChanged) {
        _onAllowWebinarReactionStatusChanged(can_reaction)
      }
    }

    /**
     * Callback to attendee raise hand Status Changed.
     * @event onAllowAttendeeRaiseHandStatusChanged
     * @param {Boolean} can_raiseHand If the raise hand is allowed, the result is true. Otherwise, false.
     */
    function onAllowAttendeeRaiseHandStatusChanged(can_raiseHand) {
      if (_onAllowAttendeeRaiseHandStatusChanged) {
        _onAllowAttendeeRaiseHandStatusChanged(can_raiseHand)
      }
    }

    /**
     * Callback to attendee view the participant count status Changed.
     * @event onAllowAttendeeViewTheParticipantCountStatusChanged
     * @param {Boolean} can_viewParticipantCount If attendee view the participant count is allowed, the result is true. Otherwise, false.
     */
    function onAllowAttendeeViewTheParticipantCountStatusChanged(can_viewParticipantCount) {
      if (_onAllowAttendeeViewTheParticipantCountStatusChanged) {
        _onAllowAttendeeViewTheParticipantCountStatusChanged(can_viewParticipantCount)
      }
    }

    /**
     * Attendee will receive this callback if his audio status changes.
     * @event onAttendeeAudioStatusNotification
     * @param {Number} userid The ID of the user whose audio status changes.
     * @param {Boolean} can_talk true indicates that it is able to use the audio. Otherwise, false.
     * @param {Boolean} is_muted true indicates muted. Otherwise, false. This parameter works only when the value of can_talk is true.
     */
    function onAttendeeAudioStatusNotification(userid, can_talk, is_muted) {
      if (_onAttendeeAudioStatusNotification) {
        _onAttendeeAudioStatusNotification(userid, can_talk, is_muted)
      }
    }

    /**
     * When attendee agree or decline the promote invitation, host will receive this callback.
     * @event onAttendeePromoteConfirmResult
     * @param {Boolean} agree If the attendee agrees, return true; otherwise, false.
     * @param {Number} userid The attendee user id.
     */
    function onAttendeePromoteConfirmResult(agree, userid) {
      if (_onAttendeePromoteConfirmResult) {
        _onAttendeePromoteConfirmResult(agree, userid)
      }
    }

    if (_addon) {
      _addon.SetOnPromptAttendee2PanelistResultCB(onPromptAttendee2PanelistResult);
      _addon.SetOnDepromptPanelist2AttendeeResultCB(onDepromptPanelist2AttendeeResult);
      _addon.SetOnAllowPanelistStartVideoNotificationCB(onAllowPanelistStartVideoNotification);
      _addon.SetOnDisallowPanelistStartVideoNotificationCB(onDisallowPanelistStartVideoNotification);
      _addon.SetOnSelfAllowTalkNotificationCB(onSelfAllowTalkNotification);
      _addon.SetOnSelfDisallowTalkNotificationCB(onSelfDisallowTalkNotification);
      _addon.SetOnAllowAttendeeChatNotificationCB(onAllowAttendeeChatNotification);
      _addon.SetOnDisallowAttendeeChatNotificationCB(onDisallowAttendeeChatNotification);
      _addon.SetOnAllowWebinarReactionStatusChangedCB(onAllowWebinarReactionStatusChanged);
      _addon.SetOnAllowAttendeeRaiseHandStatusChangedCB(onAllowAttendeeRaiseHandStatusChanged);
      _addon.SetOnAllowAttendeeViewTheParticipantCountStatusChangedCB(onAllowAttendeeViewTheParticipantCountStatusChanged);
      _addon.SetOnAttendeeAudioStatusNotificationCB(onAttendeeAudioStatusNotification);
      _addon.SetOnAttendeePromoteConfirmResultCB(onAttendeePromoteConfirmResult);
    }

    return {
      // Public methods and variables
      /**
       * Set onPromptAttendee2PanelistResult callback.
       * @method SetOnPromptAttendee2PanelistResultCB
       * @param {Function} onPromptAttendee2PanelistResult
       * @return {Boolean} true or false
       */
      SetOnPromptAttendee2PanelistResultCB: function (onPromptAttendee2PanelistResult) {
        if (_addon && onPromptAttendee2PanelistResult && onPromptAttendee2PanelistResult instanceof Function) {
          _onPromptAttendee2PanelistResult = onPromptAttendee2PanelistResult;
          return true;
        }
        return false;
      },
      /**
       * Set onDepromptPanelist2AttendeeResult callback.
       * @method SetOnDepromptPanelist2AttendeeResultCB
       * @param {Function} onDepromptPanelist2AttendeeResult
       * @return {Boolean} true or false
       */
      SetOnDepromptPanelist2AttendeeResultCB: function (onDepromptPanelist2AttendeeResult) {
        if (_addon && onDepromptPanelist2AttendeeResult && onDepromptPanelist2AttendeeResult instanceof Function) {
          _onDepromptPanelist2AttendeeResult = onDepromptPanelist2AttendeeResult;
          return true;
        }
        return false;
      },
      /**
       * Set onAllowPanelistStartVideoNotification callback.
       * @method SetOnAllowPanelistStartVideoNotificationCB
       * @param {Function} onAllowPanelistStartVideoNotification
       * @return {Boolean} true or false
       */
      SetOnAllowPanelistStartVideoNotificationCB: function (onAllowPanelistStartVideoNotification) {
        if (_addon && onAllowPanelistStartVideoNotification && onAllowPanelistStartVideoNotification instanceof Function) {
          _onAllowPanelistStartVideoNotification = onAllowPanelistStartVideoNotification;
          return true;
        }
        return false;
      },
      /**
       * Set onDisallowPanelistStartVideoNotification callback.
       * @method SetOnDisallowPanelistStartVideoNotificationCB
       * @param {Function} onDisallowPanelistStartVideoNotification
       * @return {Boolean} true or false
       */
      SetOnDisallowPanelistStartVideoNotificationCB: function (onDisallowPanelistStartVideoNotification) {
        if (_addon && onDisallowPanelistStartVideoNotification && onDisallowPanelistStartVideoNotification instanceof Function) {
          _onDisallowPanelistStartVideoNotification = onDisallowPanelistStartVideoNotification;
          return true;
        }
        return false;
      },
      /**
       * Set onSelfAllowTalkNotification callback.
       * @method SetOnSelfAllowTalkNotificationCB
       * @param {Function} onSelfAllowTalkNotification
       * @return {Boolean} true or false
       */
      SetOnSelfAllowTalkNotificationCB: function (onSelfAllowTalkNotification) {
        if (_addon && onSelfAllowTalkNotification && onSelfAllowTalkNotification instanceof Function) {
          _onSelfAllowTalkNotification = onSelfAllowTalkNotification;
          return true;
        }
        return false;
      },
      /**
       * Set onSelfDisallowTalkNotification callback.
       * @method SetOnSelfDisallowTalkNotificationCB
       * @param {Function} onSelfDisallowTalkNotification
       * @return {Boolean} true or false
       */
      SetOnSelfDisallowTalkNotificationCB: function (onSelfDisallowTalkNotification) {
        if (_addon && onSelfDisallowTalkNotification && onSelfDisallowTalkNotification instanceof Function) {
          _onSelfDisallowTalkNotification = onSelfDisallowTalkNotification;
          return true;
        }
        return false;
      },
      /**
       * Set onAllowAttendeeChatNotification callback.
       * @method SetOnAllowAttendeeChatNotificationCB
       * @param {Function} onAllowAttendeeChatNotification
       * @return {Boolean} true or false
       */
      SetOnAllowAttendeeChatNotificationCB: function (onAllowAttendeeChatNotification) {
        if (_addon && onAllowAttendeeChatNotification && onAllowAttendeeChatNotification instanceof Function) {
          _onAllowAttendeeChatNotification = onAllowAttendeeChatNotification;
          return true;
        }
        return false;
      },
      /**
       * Set onDisallowAttendeeChatNotification callback.
       * @method SetOnDisallowAttendeeChatNotificationCB
       * @param {Function} onDisallowAttendeeChatNotification
       * @return {Boolean} true or false
       */
      SetOnDisallowAttendeeChatNotificationCB: function (onDisallowAttendeeChatNotification) {
        if (_addon && onDisallowAttendeeChatNotification && onDisallowAttendeeChatNotification instanceof Function) {
          _onDisallowAttendeeChatNotification = onDisallowAttendeeChatNotification;
          return true;
        }
        return false;
      },
      /**
       * Set onAllowWebinarReactionStatusChanged callback.
       * @method SetOnAllowWebinarReactionStatusChangedCB
       * @param {Function} onAllowWebinarReactionStatusChanged
       * @return {Boolean} true or false
       */
      SetOnAllowWebinarReactionStatusChangedCB: function (onAllowWebinarReactionStatusChanged) {
        if (_addon && onAllowWebinarReactionStatusChanged && onAllowWebinarReactionStatusChanged instanceof Function) {
          _onAllowWebinarReactionStatusChanged = onAllowWebinarReactionStatusChanged;
          return true;
        }
        return false;
      },
      /**
       * Set onAllowAttendeeRaiseHandStatusChanged callback.
       * @method SetOnAllowAttendeeRaiseHandStatusChangedCB
       * @param {Function} onAllowAttendeeRaiseHandStatusChanged
       * @return {Boolean} true or false
       */
      SetOnAllowAttendeeRaiseHandStatusChangedCB: function (onAllowAttendeeRaiseHandStatusChanged) {
        if (_addon && onAllowAttendeeRaiseHandStatusChanged && onAllowAttendeeRaiseHandStatusChanged instanceof Function) {
          _onAllowAttendeeRaiseHandStatusChanged = onAllowAttendeeRaiseHandStatusChanged;
          return true;
        }
        return false;
      },
      /**
       * Set onAllowAttendeeViewTheParticipantCountStatusChanged callback.
       * @method SetOnAllowAttendeeViewTheParticipantCountStatusChangedCB
       * @param {Function} onAllowAttendeeViewTheParticipantCountStatusChanged
       * @return {Boolean} true or false
       */
      SetOnAllowAttendeeViewTheParticipantCountStatusChangedCB: function (onAllowAttendeeViewTheParticipantCountStatusChanged) {
        if (_addon && onAllowAttendeeViewTheParticipantCountStatusChanged && onAllowAttendeeViewTheParticipantCountStatusChanged instanceof Function) {
          _onAllowAttendeeViewTheParticipantCountStatusChanged = onAllowAttendeeViewTheParticipantCountStatusChanged;
          return true;
        }
        return false;
      },
      /**
       * Set onAttendeeAudioStatusNotification callback.
       * @method SetOnAttendeeAudioStatusNotificationCB
       * @param {Function} onAttendeeAudioStatusNotification
       * @return {Boolean} true or false
       */
      SetOnAttendeeAudioStatusNotificationCB: function (onAttendeeAudioStatusNotification) {
        if (_addon && onAttendeeAudioStatusNotification && onAttendeeAudioStatusNotification instanceof Function) {
          _onAttendeeAudioStatusNotification = onAttendeeAudioStatusNotification;
          return true;
        }
        return false;
      },
      /**
       * Set onAttendeePromoteConfirmResult callback.
       * @method SetOnAttendeePromoteConfirmResultCB
       * @param {Function} onAttendeePromoteConfirmResult
       * @return {Boolean} true or false
       */
      SetOnAttendeePromoteConfirmResultCB: function (onAttendeePromoteConfirmResult) {
        if (_addon && onAttendeePromoteConfirmResult && onAttendeePromoteConfirmResult instanceof Function) {
          _onAttendeePromoteConfirmResult = onAttendeePromoteConfirmResult;
          return true;
        }
        return false;
      },
      /**
      * Promote the attendee to panelist. Available only for the meeting host.
      * @method PromptAttendee2Panelist
      * @param {Number} userid Specifies the user ID to promote.
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      * @note If the function succeeds, the user will receive the onPromptAttendee2PanelistResult() callback event.
      */
      PromptAttendee2Panelist: function (opts) {
        if (_addon) {
          var clientOpts = opts || {};
          var userid = clientOpts.userid;
          try {
            let WebinarAttendeeParams = new messages.WebinarAttendeeParams();
            WebinarAttendeeParams.setUserid(userid);
            let bytes = WebinarAttendeeParams.serializeBinary();
            return _addon.PromptAttendee2Panelist(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Demote the panelist to attendee. Available only for the host.
      * @method DepromptPanelist2Attendee
      * @param {Number} userid Specifies the user ID to demote.
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      * @note If the function succeeds, the user will receive the onDepromptPanelist2AttendeeResult() callback event.
      */
      DepromptPanelist2Attendee: function (opts) {
        if (_addon) {
          var clientOpts = opts || {};
          var userid = clientOpts.userid;
          try {
            let WebinarAttendeeParams = new messages.WebinarAttendeeParams();
            WebinarAttendeeParams.setUserid(userid);
            let bytes = WebinarAttendeeParams.serializeBinary();
            return _addon.DepromptPanelist2Attendee(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Query if the webinar supports the user to use the audio device.
      * @method IsSupportAttendeeTalk
      * @deprecated This interface is marked as deprecated.
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      */
      IsSupportAttendeeTalk: function () {
        if (_addon) {
          return _addon.IsSupportAttendeeTalk();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * The attendee is permitted to use the audio device.
      * @method AllowAttendeeTalk
      * @param {Number} userid Specifies the permitted user ID.
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      * @note If the function succeeds, the user will receive the onAllowAttendeeChatNotification() callback event. Available only for the host.
      */
      AllowAttendeeTalk: function (opts) {
        if (_addon) {
          var clientOpts = opts || {};
          var userid = clientOpts.userid;
          try {
            let WebinarAttendeeParams = new messages.WebinarAttendeeParams();
            WebinarAttendeeParams.setUserid(userid);
            let bytes = WebinarAttendeeParams.serializeBinary();
            return _addon.AllowAttendeeTalk(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Forbid the attendee to use the audio device.
      * @method DisallowAttendeeTalk
      * @param {Number} userid Specifies the forbidden user ID.
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      * @note If the function succeeds, the user will receive the onDisallowAttendeeChatNotification() callback event. Available only for the host.
      */
      DisallowAttendeeTalk: function (opts) {
        if (_addon) {
          var clientOpts = opts || {};
          var userid = clientOpts.userid;
          try {
            let WebinarAttendeeParams = new messages.WebinarAttendeeParams();
            WebinarAttendeeParams.setUserid(userid);
            let bytes = WebinarAttendeeParams.serializeBinary();
            return _addon.DisallowAttendeeTalk(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * The panelist is permitted to start the video.
      * @method AllowPanelistStartVideo
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      * @note If the function succeeds, the user will receive the onAllowPanelistStartVideoNotification() callback event. Available only for the host.
      */
      AllowPanelistStartVideo: function () {
        if (_addon) {
          return _addon.AllowPanelistStartVideo();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Forbid the panelist to start video.
      * @method DisallowPanelistStartVideo
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      * @note If the function succeeds, the user will receive the onDisallowPanelistStartVideoNotification() callback event. Available only for the host.
      */
      DisallowPanelistStartVideo: function () {
        if (_addon) {
          return _addon.DisallowPanelistStartVideo();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Permitted to use emoji reactions.
      * @method AllowWebinarEmojiReaction
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      * @note If the function succeeds, the user will receive the onAllowWebinarReactionStatusChanged(bool) callback event. Available only for the host.
      */
      AllowWebinarEmojiReaction: function () {
        if (_addon) {
          return _addon.AllowWebinarEmojiReaction();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Forbid to use emoji reactions.
      * @method DisallowWebinarEmojiReaction
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      * @note If the function succeeds, the user will receive the onAllowWebinarReactionStatusChanged(bool) callback event. Available only for the host.
      */
      DisallowWebinarEmojiReaction: function () {
        if (_addon) {
          return _addon.DisallowWebinarEmojiReaction();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Determines if current webinar supports emoji reaction.
      * @method IsWebinarEmojiReactionSupported
      * @return {Boolean} true indicates the current webinar supports emoji reactions. Otherwise, false.
      */
      IsWebinarEmojiReactionSupported: function () {
        if (_addon) {
          return _addon.IsWebinarEmojiReactionSupported();
        }
        return false;
      },
      /**
      * The attendee is permitted to use the raise hand.
      * @method AllowAttendeeRaiseHand
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      * @note If the function succeeds, the user will receive the onAllowAttendeeRaiseHandStatusChanged(bool) callback event. Available only for the host.
      */
      AllowAttendeeRaiseHand: function () {
        if (_addon) {
          return _addon.AllowAttendeeRaiseHand();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Forbid the attendee to use the raise hand.
      * @method DisallowAttendeeRaiseHand
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      * @note If the function succeeds, the user will receive the onAllowAttendeeRaiseHandStatusChanged(bool) callback event. Available only for the host.
      */
      DisallowAttendeeRaiseHand: function () {
        if (_addon) {
          return _addon.DisallowAttendeeRaiseHand();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * The attendee is permitted to view the participant count.
      * @method AllowAttendeeViewTheParticipantCount
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      * @note If the function succeeds, the user will receive the onAllowAttendeeViewTheParticipantCountStatusChanged(bool) callback event. Available only for host.
      */
      AllowAttendeeViewTheParticipantCount: function () {
        if (_addon) {
          return _addon.AllowAttendeeViewTheParticipantCount();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Forbid the attendee to view the participant count.
      * @method DisallowAttendeeViewTheParticipantCount
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      * @note If the function succeeds, the user will receive the onAllowAttendeeViewTheParticipantCountStatusChanged(bool) callback event. Available only for host.
      */
      DisallowAttendeeViewTheParticipantCount: function () {
        if (_addon) {
          return _addon.DisallowAttendeeViewTheParticipantCount();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Get the participant count.
      * @method GetParticipantCount
      * @return {Number} The count of participant.
      */
      GetParticipantCount: function () {
        if (_addon) {
          return _addon.GetParticipantCount();
        }
        return null;
      },
      /**
       * Get the webinar status.
       * @method GetWebinarMeetingStatus
       * @return {Object} If the function succeeds, the return value is an object with the following WebinarMeetingStatus properties:
       *   - allow_panellist_start_video: true indicates that the panelist is able to turn on the video. Otherwise, false.
       *   - allow_attendee_chat: true indicates that the attendee is able to chat. Otherwise, false.
       *   - allow_emoji_reaction: true indicates that the attendee is able to emojireaction. Otherwise, false.
       *   - allow_attendee_raise_hand: true indicates that the attendee is able to raise hand. Otherwise, false.
       *   - allow_attendee_view_participant_count: true indicates that the attendee is able to view participant count. Otherwise, false.
       * Otherwise, this function returns an error, the return is null.
       */
      GetWebinarMeetingStatus: function () {
        if (_addon) {
          try {
            return _addon.GetWebinarMeetingStatus()
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * Set the chat privilege of the panelist.
       * @method SetPanelistChatPrivilege
       * @param {Number} privilege The chat privilege of the panelist {@link SDKPanelistChatPrivilege}
       * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
       */
      SetPanelistChatPrivilege: function (opts) {
        if (_addon) {
          var clientOpts = opts || {};
          var privilege = clientOpts.privilege;
          if (privilege == undefined) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
          try {
            let SetPanelistChatPrivilegeParams = new messages.SetPanelistChatPrivilegeParams();
            SetPanelistChatPrivilegeParams.setPrivilege(privilege);
            let bytes = SetPanelistChatPrivilegeParams.serializeBinary();
            return _addon.SetPanelistChatPrivilege(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * Get the chat privilege of the panelist.
       * @method GetPanelistChatPrivilege
       * @return {Number} The chat privilege of the panelist {@link SDKPanelistChatPrivilege}
       */
      GetPanelistChatPrivilege: function () {
        if (_addon) {
          return _addon.GetPanelistChatPrivilege();
        }
        return null;
      },
      /**
       * Set the view mode of the attendee. Available only for zoom ui.
       * @method SetAttendeeViewMode
       * @param {Number} mode The view mode of the attendee {@link SDKAttendeeViewMode}
       * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
       */
      SetAttendeeViewMode: function (opts) {
        if (_addon) {
          var clientOpts = opts || {};
          var mode = clientOpts.mode;
          if (mode == undefined) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
          try {
            let SetAttendeeViewModeParams = new messages.SetAttendeeViewModeParams();
            SetAttendeeViewModeParams.setMode(mode);
            let bytes = SetAttendeeViewModeParams.serializeBinary();
            return _addon.SetAttendeeViewMode(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * Get the view mode of the attendee.Available only for zoom ui.
       * @method GetAttendeeViewMode
       * @return {Number} If the function succeeds, it returns the attendee's view mode {@link SDKAttendeeViewMode}
       */
      GetAttendeeViewMode: function () {
        if (_addon) {
          return _addon.GetAttendeeViewMode();
        }
        return null;
      },
      /**
      *Get the webinar legal notices prompt.
      * @method GetWebinarLegalNoticesPrompt
      * @return {String} The webinar legal notices prompt.
      */
      GetWebinarLegalNoticesPrompt: function () {
        if (_addon) {
          return _addon.GetWebinarLegalNoticesPrompt();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * Get the webinar legal notices explained.
       * @method GetWebinarLegalNoticesExplained
       * @return {Object} The webinar legal notices explained with the following WebinarLegalNoticesExplainedInfo properties:
       *   - explained_content
       *   - url_register_account_owner
       *   - url_register_terms
       *   - url_register_privacy_policy
       */
      GetWebinarLegalNoticesExplained: function () {
        if (_addon) {
          return _addon.GetWebinarLegalNoticesExplained();
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
  ZoomMeetingWebinar: ZoomMeetingWebinar
}
