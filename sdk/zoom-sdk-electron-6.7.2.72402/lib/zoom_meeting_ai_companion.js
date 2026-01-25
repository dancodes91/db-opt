let { ZoomSDKError } = require('./settings.js');
const messages = require('./electron_sdk_pb.js');

var ZoomMeetingAICompanion = (function () {
  var instance;
  /**
   * Zoom Meeting AI Companion
   * @module zoom_meeting_ai_companion
   * @param {Function} onAICompanionFeatureTurnOffByParticipant Callback when the auto start AI Companion feature is turned off by a participant before the host join. Only the host or cohost can receive this callback.
   * @param {Function} onAICompanionFeatureSwitchRequested Callback when host receives the request to turn the AI Companion features on or off.
   * @param {Function} onAICompanionFeatureSwitchRequestResponse Callback when the host handles the request to turn the AI Companion features on or off.
   * @param {Function} onAICompanionFeatureCanNotBeTurnedOff Callback when the started AI Companion feature can't be turned off.
   * @param {Function} onHostUnsupportedStopNotesRequest Sink the event when the host's client does not support handling the stop Notes request.
   * @param {Function} onSmartSummaryStateNotSupported Callback notify the meting does not support smart summary.
   * @param {Function} onSmartSummaryStateSupportedButDisabled Callback notify the meeting support smart summary but smart summary feature is disabled.
   * @param {Function} onSmartSummaryStateEnabledButNotStarted Callback notify the meeting smart summary is not started.
   * @param {Function} onSmartSummaryStateStarted Callback notify the meeting smart summary is started.
   * @param {Function} onFailedToStartSmartSummary Callback notify failed to start the smart summary.
   * @param {Function} onSmartSummaryEnableRequestReceived Callback notify receive request to enable smart summary.
   * @param {Function} onSmartSummaryStartRequestReceived Callback notify receive request to start smart summary.
   * @param {Function} onSmartSummaryEnableActionCallback Callback notify receive request to start smart summary.
   * @param {Function} onQueryStateNotSupported Callback event that the meeting does not support query.
   * @param {Function} onQueryStateSupportedButDisabled Callback event that the meeting supports query but query feature is disabled.
   * @param {Function} onQueryStateEnabledButNotStarted Callback event that the query is not started.
   * @param {Function} onQueryStateStarted Callback event that the query is started.
   * @param {Function} onQuerySettingChanged Callback event that the query setting is changed.
   * @param {Function} onFailedToStartQuery Callback event that the query failed to start.
   * @param {Function} onReceiveRequestToEnableQuery Callback event that receiving request to enable query.
   * @param {Function} onReceiveRequestToStartQuery Callback event that receiving request to start query.
   * @param {Function} onReceiveQueryAnswer Callback event that receiving query answer.
   * @param {Function} onQueryEnableActionCallback Callback event that receiving query enable action callback.
   * @param {Function} onSendQueryPrivilegeChanged Callback event that getting or losing send query question privilege.
   * @param {Function} onFailedToRequestSendQuery Callback event that failed to request send query.
   * @param {Function} onReceiveRequestToSendQuery Callback event that receiving request to send query.
   * @return {ZoomMeetingAICompanion}
   */
  function init(opts) {
    let clientOpts = opts || {};
    // Private methods and variables
    let _addon = clientOpts.addon.GetMeetingAICompanionCtrl() || null;
    let _onAICompanionFeatureTurnOffByParticipant = clientOpts.onAICompanionFeatureTurnOffByParticipant || null;
    let _onAICompanionFeatureSwitchRequested = clientOpts.onAICompanionFeatureSwitchRequested || null;
    let _onAICompanionFeatureSwitchRequestResponse = clientOpts.onAICompanionFeatureSwitchRequestResponse || null;
    let _onAICompanionFeatureCanNotBeTurnedOff = clientOpts.onAICompanionFeatureCanNotBeTurnedOff || null;
    let _onHostUnsupportedStopNotesRequest = clientOpts.onHostUnsupportedStopNotesRequest || null;
    let _onSmartSummaryStateNotSupported = clientOpts.onSmartSummaryStateNotSupported || null;
    let _onSmartSummaryStateSupportedButDisabled = clientOpts.onSmartSummaryStateSupportedButDisabled || null;
    let _onSmartSummaryStateEnabledButNotStarted = clientOpts.onSmartSummaryStateEnabledButNotStarted || null;
    let _onSmartSummaryStateStarted = clientOpts.onSmartSummaryStateStarted || null;
    let _onFailedToStartSmartSummary = clientOpts.onFailedToStartSmartSummary || null;
    let _onSmartSummaryEnableRequestReceived = clientOpts.onSmartSummaryEnableRequestReceived || null;
    let _onSmartSummaryStartRequestReceived = clientOpts.onSmartSummaryStartRequestReceived || null;
    let _onSmartSummaryEnableActionCallback = clientOpts.onSmartSummaryEnableActionCallback || null;
    let _onQueryStateNotSupported = clientOpts.onQueryStateNotSupported || null
    let _onQueryStateSupportedButDisabled = clientOpts.onQueryStateSupportedButDisabled || null
    let _onQueryStateEnabledButNotStarted = clientOpts.onQueryStateEnabledButNotStarted || null;
    let _onQueryStateStarted = clientOpts.onQueryStateStarted || null;
    let _onQuerySettingChanged = clientOpts.onQuerySettingChanged || null;
    let _onFailedToStartQuery = clientOpts.onFailedToStartQuery || null;
    let _onReceiveRequestToEnableQuery = clientOpts.onReceiveRequestToEnableQuery || null;
    let _onReceiveRequestToStartQuery = clientOpts.onReceiveRequestToStartQuery || null;
    let _onReceiveQueryAnswer = clientOpts.onReceiveQueryAnswer || null;
    let _onQueryEnableActionCallback = clientOpts.onQueryEnableActionCallback || null;
    let _onSendQueryPrivilegeChanged = clientOpts.onSendQueryPrivilegeChanged || null;
    let _onFailedToRequestSendQuery = clientOpts.onFailedToRequestSendQuery || null;
    let _onReceiveRequestToSendQuery = clientOpts.onReceiveRequestToSendQuery || null;

    /**
      Callback when the auto start AI Companion feature is turned off by a participant before the host join. Only the host or cohost can receive this callback.
      @event onAICompanionFeatureTurnOffByParticipant
    */
    function onAICompanionFeatureTurnOffByParticipant() {
      if (_onAICompanionFeatureTurnOffByParticipant) {
        _onAICompanionFeatureTurnOffByParticipant()
      }
    }

    /**
      Callback when host receives the request to turn the AI Companion features on or off.
      @event onAICompanionFeatureSwitchRequested
    */
    function onAICompanionFeatureSwitchRequested() {
      if (_onAICompanionFeatureSwitchRequested) {
        _onAICompanionFeatureSwitchRequested()
      }
    }

    /**
      Callback when the host handles the request to turn the AI Companion features on or off.
      @event onAICompanionFeatureSwitchRequestResponse
      @param {Boolean} bTimeout Specify the host not handle the request until timeout.
      @param {Boolean} bAgree Specify the host agrees to the request to turn the AI companion features on or off.
      @param {Boolean} bTurnOn Specify the host respond the request of turn on or off.
    */
    function onAICompanionFeatureSwitchRequestResponse(bTimeout, bAgree, bTurnOn) {
      if (_onAICompanionFeatureSwitchRequestResponse) {
        _onAICompanionFeatureSwitchRequestResponse(bTimeout, bAgree, bTurnOn)
      }
    }
  
    /**
      Callback when the started AI Companion feature can't be turned off.
      @event onAICompanionFeatureCanNotBeTurnedOff
      @param {Array} features Specify the AI Companion features that can't be turned off.
    */
    function onAICompanionFeatureCanNotBeTurnedOff(features) {
      if (_onAICompanionFeatureCanNotBeTurnedOff) {
        _onAICompanionFeatureCanNotBeTurnedOff(features)
      }
    }

    /**
      Sink the event when the host's client does not support handling the stop Notes request.
      @event onHostUnsupportedStopNotesRequest
      @note This callback is triggered when a participant requests to stop Notes, but the meeting host's client version does not support processing this request.
    */
    function onHostUnsupportedStopNotesRequest() {
      if (_onHostUnsupportedStopNotesRequest) {
        _onHostUnsupportedStopNotesRequest()
      }
    }

    /**
      Callback notify the meting does not support smart summary.
      @event onSmartSummaryStateNotSupported
    */
    function onSmartSummaryStateNotSupported() {
      if (_onSmartSummaryStateNotSupported) {
        _onSmartSummaryStateNotSupported()
      }
    }

    /**
      Callback notify the meeting support smart summary but smart summary feature is disabled.
      @event onSmartSummaryStateSupportedButDisabled
    */
    function onSmartSummaryStateSupportedButDisabled() {
      if (_onSmartSummaryStateSupportedButDisabled) {
        _onSmartSummaryStateSupportedButDisabled()
      }
    }

    /**
      Callback notify the meeting smart summary is not started.
      @event onSmartSummaryStateEnabledButNotStarted
    */
    function onSmartSummaryStateEnabledButNotStarted() {
      if (_onSmartSummaryStateEnabledButNotStarted) {
        _onSmartSummaryStateEnabledButNotStarted()
      }
    }
  
    /**
      Callback notify the meeting smart summary is started.
      @event onSmartSummaryStateStarted
    */
    function onSmartSummaryStateStarted() {
      if (_onSmartSummaryStateStarted) {
        _onSmartSummaryStateStarted()
      }
    }

    /**
      Callback notify failed to start the smart summary.
      @event onFailedToStartSmartSummary
      @param {Boolean} bTimeout true indicates timeout. Otherwise no timeout. May be declined by host or cohost.
    */
    function onFailedToStartSmartSummary(bTimeout) {
      if (_onFailedToStartSmartSummary) {
        _onFailedToStartSmartSummary(bTimeout)
      }
    }

    /**
      Callback notify receive request to enable smart summary.
      @event onSmartSummaryEnableRequestReceived
    */
    function onSmartSummaryEnableRequestReceived() {
      if (_onSmartSummaryEnableRequestReceived) {
        _onSmartSummaryEnableRequestReceived()
      }
    }

    /**
      Callback notify receive request to start smart summary.
      @event onSmartSummaryStartRequestReceived
    */
    function onSmartSummaryStartRequestReceived() {
      if (_onSmartSummaryStartRequestReceived) {
        _onSmartSummaryStartRequestReceived()
      }
    }

    /**
      Callback notify receive request to start smart summary.
      @event onSmartSummaryEnableActionCallback
    */
    function onSmartSummaryEnableActionCallback() {
      if (_onSmartSummaryEnableActionCallback) {
        _onSmartSummaryEnableActionCallback()
      }
    }

    /**
     * Callback event that the meeting does not support query.
     * @event onQueryStateNotSupported
    */
    function onQueryStateNotSupported() {
      if (_onQueryStateNotSupported) {
        _onQueryStateNotSupported()
      }
    }

    /**
     * Callback event that the meeting supports query but query feature is disabled.
     * @event onQueryStateSupportedButDisabled
    */
    function onQueryStateSupportedButDisabled() {
      if (_onQueryStateSupportedButDisabled) {
        _onQueryStateSupportedButDisabled()
      }
    }

    /**
     * Callback event that the query is not started.
     * @event onQueryStateEnabledButNotStarted
     */
    function onQueryStateEnabledButNotStarted() {
      if (_onQueryStateEnabledButNotStarted) {
        _onQueryStateEnabledButNotStarted();
      }
    }

    /**
     * Callback event that the query is started.
     * @event onQueryStateStarted
     */
    function onQueryStateStarted() {
      if (_onQueryStateStarted) {
        _onQueryStateStarted();
      }
    }

    /**
     * Callback event that the query setting is changed.
     * @event onQuerySettingChanged
     */
    function onQuerySettingChanged(eSetting) {
      if (_onQuerySettingChanged) {
        _onQuerySettingChanged(eSetting);
      }
    }

    /**
     * Callback event that the query failed to start.
     * @event onFailedToStartQuery
     * @param {Boolean} bTimeout true if timeout. Otherwise, false.
     */
    function onFailedToStartQuery(bTimeout) {
      if (_onFailedToStartQuery) {
        _onFailedToStartQuery(bTimeout);
      }
    }

    /**
     * Callback event that receiving request to enable query.
     * @event onReceiveRequestToEnableQuery
     */
    function onReceiveRequestToEnableQuery() {
      if (_onReceiveRequestToEnableQuery) {
        _onReceiveRequestToEnableQuery();
      }
    }

    /**
     * Callback event that receiving request to start query.
     * @event onReceiveRequestToStartQuery
     */
    function onReceiveRequestToStartQuery() {
      if (_onReceiveRequestToStartQuery) {
        _onReceiveRequestToStartQuery();
      }
    }

    /**
     * Callback event that receiving query answer.
     * @event onReceiveQueryAnswer
     * @param {Object} queryItem
     */
    function onReceiveQueryAnswer(queryItem) {
      if (_onReceiveQueryAnswer) {
        _onReceiveQueryAnswer(queryItem);
      }
    }

    /**
     * Callback event that receiving query enable action callback.
     * @event onQueryEnableActionCallback
     */
    function onQueryEnableActionCallback() {
      if (_onQueryEnableActionCallback) {
        _onQueryEnableActionCallback();
      }
    }

    /**
     * Callback event that getting or losing send query question privilege.
     * @event onSendQueryPrivilegeChanged
     * @param {Boolean} canSendQuery true indicates can send. Otherwise, false.
     */
    function onSendQueryPrivilegeChanged(canSendQuery) {
      if (_onSendQueryPrivilegeChanged) {
        _onSendQueryPrivilegeChanged(canSendQuery);
      }
    }

    /**
     * Callback event that failed to request send query.
     * @event onFailedToRequestSendQuery
     * @param {Boolean} bTimeout true indicates that the request timed out. Otherwise, it indicates that the user declines the request.
     */
    function onFailedToRequestSendQuery(bTimeout) {
      if (_onFailedToRequestSendQuery) {
        _onFailedToRequestSendQuery(bTimeout);
      }
    }

    /**
     * Callback event that receiving request to send query.
     * @event onReceiveRequestToSendQuery
     */
    function onReceiveRequestToSendQuery() {
      if (_onReceiveRequestToSendQuery) {
        _onReceiveRequestToSendQuery();
      }
    }

    if (_addon) {
      _addon.SetOnAICompanionFeatureTurnOffByParticipantCB(onAICompanionFeatureTurnOffByParticipant);
      _addon.SetOnAICompanionFeatureSwitchRequestedCB(onAICompanionFeatureSwitchRequested);
      _addon.SetOnAICompanionFeatureSwitchRequestResponseCB(onAICompanionFeatureSwitchRequestResponse);
      _addon.SetOnAICompanionFeatureCanNotBeTurnedOffCB(onAICompanionFeatureCanNotBeTurnedOff);
      _addon.SetOnHostUnsupportedStopNotesRequestCB(onHostUnsupportedStopNotesRequest);
      _addon.SetOnSmartSummaryStateNotSupportedCB(onSmartSummaryStateNotSupported);
      _addon.SetOnSmartSummaryStateSupportedButDisabledCB(onSmartSummaryStateSupportedButDisabled);
      _addon.SetOnSmartSummaryStateEnabledButNotStartedCB(onSmartSummaryStateEnabledButNotStarted);
      _addon.SetOnSmartSummaryStateStartedCB(onSmartSummaryStateStarted);
      _addon.SetOnFailedToStartSmartSummaryCB(onFailedToStartSmartSummary);
      _addon.SetOnSmartSummaryEnableRequestReceivedCB(onSmartSummaryEnableRequestReceived);
      _addon.SetOnSmartSummaryStartRequestReceivedCB(onSmartSummaryStartRequestReceived);
      _addon.SetOnSmartSummaryEnableActionCallbackCB(onSmartSummaryEnableActionCallback);
      _addon.SetOnQueryStateNotSupportedCB(onQueryStateNotSupported);
      _addon.SetOnQueryStateSupportedButDisabledCB(onQueryStateSupportedButDisabled)
      _addon.SetOnQueryStateEnabledButNotStartedCB(onQueryStateEnabledButNotStarted);
      _addon.SetOnQueryStateStartedCB(onQueryStateStarted);
      _addon.SetOnQuerySettingChangedCB(onQuerySettingChanged);
      _addon.SetOnFailedToStartQueryCB(onFailedToStartQuery);
      _addon.SetOnReceiveRequestToEnableQueryCB(onReceiveRequestToEnableQuery);
      _addon.SetOnReceiveRequestToStartQueryCB(onReceiveRequestToStartQuery);
      _addon.SetOnReceiveQueryAnswerCB(onReceiveQueryAnswer);
      _addon.SetOnQueryEnableActionCallback(onQueryEnableActionCallback);
      _addon.SetOnSendQueryPrivilegeChangedCB(onSendQueryPrivilegeChanged);
      _addon.SetOnFailedToRequestSendQueryCB(onFailedToRequestSendQuery);
      _addon.SetOnReceiveRequestToSendQueryCB(onReceiveRequestToSendQuery);
    }

    return {
      // Public methods and variables
      /**
      * Set onAICompanionFeatureTurnOffByParticipant callback.
      * @method SetOnAICompanionFeatureTurnOffByParticipantCB
      * @param {Function} onAICompanionFeatureTurnOffByParticipant
      * @return {Boolean} true or false
      */
      SetOnAICompanionFeatureTurnOffByParticipantCB: function (onAICompanionFeatureTurnOffByParticipant) {
        if (_addon && onAICompanionFeatureTurnOffByParticipant && onAICompanionFeatureTurnOffByParticipant instanceof Function) {
          _onAICompanionFeatureTurnOffByParticipant = onAICompanionFeatureTurnOffByParticipant;
          return true;
        }
        return false;
      },
      /**
      * Set onAICompanionFeatureSwitchRequested callback.
      * @method SetOnAICompanionFeatureSwitchRequestedCB
      * @param {Function} onAICompanionFeatureSwitchRequested
      * @return {Boolean} true or false
      */
      SetOnAICompanionFeatureSwitchRequestedCB: function (onAICompanionFeatureSwitchRequested) {
        if (_addon && onAICompanionFeatureSwitchRequested && onAICompanionFeatureSwitchRequested instanceof Function) {
          _onAICompanionFeatureSwitchRequested = onAICompanionFeatureSwitchRequested;
          return true;
        }
        return false;
      },
      /**
      * Set onAICompanionFeatureSwitchRequestResponse callback.
      * @method SetOnAICompanionFeatureSwitchRequestResponseCB
      * @param {Function} onAICompanionFeatureSwitchRequestResponse
      * @return {Boolean} true or false
      */
      SetOnAICompanionFeatureSwitchRequestResponseCB: function (onAICompanionFeatureSwitchRequestResponse) {
        if (_addon && onAICompanionFeatureSwitchRequestResponse && onAICompanionFeatureSwitchRequestResponse instanceof Function) {
          _onAICompanionFeatureSwitchRequestResponse = onAICompanionFeatureSwitchRequestResponse;
          return true;
        }
        return false;
      },
      /**
      * Set onAICompanionFeatureCanNotBeTurnedOff callback.
      * @method SetOnAICompanionFeatureCanNotBeTurnedOffCB
      * @param {Function} onAICompanionFeatureCanNotBeTurnedOff
      * @return {Boolean} true or false
      */
      SetOnAICompanionFeatureCanNotBeTurnedOffCB: function (onAICompanionFeatureCanNotBeTurnedOff) {
        if (_addon && onAICompanionFeatureCanNotBeTurnedOff && onAICompanionFeatureCanNotBeTurnedOff instanceof Function) {
          _onAICompanionFeatureCanNotBeTurnedOff = onAICompanionFeatureCanNotBeTurnedOff;
          return true;
        }
        return false;
      },
      /**
      * Set onHostUnsupportedStopNotesRequest callback.
      * @method SetOnHostUnsupportedStopNotesRequestCB
      * @param {Function} onHostUnsupportedStopNotesRequest
      */
      SetOnHostUnsupportedStopNotesRequestCB: function (onHostUnsupportedStopNotesRequest) {
        if (_addon && onHostUnsupportedStopNotesRequest && onHostUnsupportedStopNotesRequest instanceof Function) {
          _onHostUnsupportedStopNotesRequest = onHostUnsupportedStopNotesRequest;
          return true;
        }
        return false;
      },
      /**
      * Set onSmartSummaryStateNotSupported callback.
      * @method SetOnSmartSummaryStateNotSupportedCB
      * @param {Function} onSmartSummaryStateNotSupported
      * @return {Boolean} true or false
      */
      SetOnSmartSummaryStateNotSupportedCB: function (onSmartSummaryStateNotSupported) {
        if (_addon && onSmartSummaryStateNotSupported && onSmartSummaryStateNotSupported instanceof Function) {
          _onSmartSummaryStateNotSupported = onSmartSummaryStateNotSupported;
          return true;
        }
        return false;
      },
      /**
      * Set onSmartSummaryStateSupportedButDisabled callback.
      * @method SetOnSmartSummaryStateSupportedButDisabledCB
      * @param {Function} onSmartSummaryStateSupportedButDisabled
      * @return {Boolean} true or false
      */
      SetOnSmartSummaryStateSupportedButDisabledCB: function (onSmartSummaryStateSupportedButDisabled) {
        if (_addon && onSmartSummaryStateSupportedButDisabled && onSmartSummaryStateSupportedButDisabled instanceof Function) {
          _onSmartSummaryStateSupportedButDisabled = onSmartSummaryStateSupportedButDisabled;
          return true;
        }
        return false;
      },
      /**
      * Set onSmartSummaryStateEnabledButNotStarted callback.
      * @method SetOnSmartSummaryStateEnabledButNotStartedCB
      * @param {Function} onSmartSummaryStateEnabledButNotStarted
      * @return {Boolean} true or false
      */
      SetOnSmartSummaryStateEnabledButNotStartedCB: function (onSmartSummaryStateEnabledButNotStarted) {
        if (_addon && onSmartSummaryStateEnabledButNotStarted && onSmartSummaryStateEnabledButNotStarted instanceof Function) {
          _onSmartSummaryStateEnabledButNotStarted = onSmartSummaryStateEnabledButNotStarted;
          return true;
        }
        return false;
      },
      /**
      * Set onSmartSummaryStateStarted callback.
      * @method SetOnSmartSummaryStateStartedCB
      * @param {Function} onSmartSummaryStateStarted
      * @return {Boolean} true or false
      */
      SetOnSmartSummaryStateStartedCB: function (onSmartSummaryStateStarted) {
        if (_addon && onSmartSummaryStateStarted && onSmartSummaryStateStarted instanceof Function) {
          _onSmartSummaryStateStarted = onSmartSummaryStateStarted;
          return true;
        }
        return false;
      },
      /**
      * Set onFailedToStartSmartSummary callback.
      * @method SetOnFailedToStartSmartSummaryCB
      * @param {Function} onFailedToStartSmartSummary
      * @return {Boolean} true or false
      */
      SetOnFailedToStartSmartSummaryCB: function (onFailedToStartSmartSummary) {
        if (_addon && onFailedToStartSmartSummary && onFailedToStartSmartSummary instanceof Function) {
          _onFailedToStartSmartSummary = onFailedToStartSmartSummary;
          return true;
        }
        return false;
      },
      /**
      * Set onSmartSummaryEnableRequestReceived callback.
      * @method SetOnSmartSummaryEnableRequestReceivedCB
      * @param {Function} onSmartSummaryEnableRequestReceived
      * @return {Boolean} true or false
      */
      SetOnSmartSummaryEnableRequestReceivedCB: function (onSmartSummaryEnableRequestReceived) {
        if (_addon && onSmartSummaryEnableRequestReceived && onSmartSummaryEnableRequestReceived instanceof Function) {
          _onSmartSummaryEnableRequestReceived= onSmartSummaryEnableRequestReceived;
          return true;
        }
        return false;
      },
      /**
      * Set onSmartSummaryStartRequestReceived callback.
      * @method SetOnSmartSummaryStartRequestReceivedCB
      * @param {Function} onSmartSummaryStartRequestReceived
      * @return {Boolean} true or false
      */
      SetOnSmartSummaryStartRequestReceivedCB: function (onSmartSummaryStartRequestReceived) {
        if (_addon && onSmartSummaryStartRequestReceived && onSmartSummaryStartRequestReceived instanceof Function) {
          _onSmartSummaryStartRequestReceived= onSmartSummaryStartRequestReceived;
          return true;
        }
        return false;
      },
      /**
      * Set onSmartSummaryEnableActionCallback callback.
      * @method SetOnSmartSummaryEnableActionCallbackCB
      * @param {Function} onSmartSummaryEnableActionCallback
      * @return {Boolean} true or false
      */
      SetOnSmartSummaryEnableActionCallbackCB: function (onSmartSummaryEnableActionCallback) {
        if (_addon && onSmartSummaryEnableActionCallback && onSmartSummaryEnableActionCallback instanceof Function) {
          _onSmartSummaryEnableActionCallback = onSmartSummaryEnableActionCallback;
          return true;
        }
        return false;
      },
      /**
      * Set onQueryStateNotSupported callback.
      * @method SetOnQueryStateNotSupportedCB
      * @param {Function} onQueryStateNotSupported
      * @return {Boolean} true or false
      */
      SetOnQueryStateNotSupportedCB: function (onQueryStateNotSupported) {
        if (_addon && onQueryStateNotSupported && onQueryStateNotSupported instanceof Function) {
          _onQueryStateNotSupported = onQueryStateNotSupported;
          return true;
        }
        return false;
      },
      /**
       * Set onQueryStateSupportedButDisabled callback.
       * @method SetOnQueryStateSupportedButDisabledCB
       * @param {Function} onQueryStateSupportedButDisabled
       * @return {Boolean} true or false
       */
      SetOnQueryStateSupportedButDisabledCB: function (onQueryStateSupportedButDisabled) {
        if (_addon && onQueryStateSupportedButDisabled && onQueryStateSupportedButDisabled instanceof Function) {
          _onQueryStateSupportedButDisabled = onQueryStateSupportedButDisabled;
          return true;
        }
        return false;
      }, 
      /**
       * Set onQueryStateEnabledButNotStarted callback.
       * @method SetOnQueryStateEnabledButNotStartedCB
       * @param {Function} onQueryStateEnabledButNotStarted
       * @return {Boolean} true or false
       */
      SetOnQueryStateEnabledButNotStartedCB: function (onQueryStateEnabledButNotStarted) {
        if (_addon && onQueryStateEnabledButNotStarted && onQueryStateEnabledButNotStarted instanceof Function) {
          _onQueryStateEnabledButNotStarted = onQueryStateEnabledButNotStarted;
          return true;
        }
        return false;
      }, 
      /**
       * Set onQueryStateStarted callback.
       * @method SetOnQueryStateStartedCB
       * @param {Function} onQueryStateStarted
       * @return {Boolean} true or false
       */
      SetOnQueryStateStartedCB: function (onQueryStateStarted) {
        if (_addon && onQueryStateStarted && onQueryStateStarted instanceof Function) {
          _onQueryStateStarted = onQueryStateStarted;
          return true;
        }
        return false;
      }, 
      /**
       * Set onQuerySettingChanged callback.
       * @method SetOnQuerySettingChangedCB
       * @param {Function} onQuerySettingChanged
       * @return {Boolean} true or false
       */
      SetOnQuerySettingChangedCB: function (onQuerySettingChanged) {
        if (_addon && onQuerySettingChanged && onQuerySettingChanged instanceof Function) {
          _onQuerySettingChanged = onQuerySettingChanged;
          return true;
        }
        return false;
      }, 
      /**
       * Set onFailedToStartQuery callback.
       * @method SetOnFailedToStartQueryCB
       * @param {Function} onFailedToStartQuery
       * @return {Boolean} true or false
       */
      SetOnFailedToStartQueryCB: function (onFailedToStartQuery) {
        if (_addon && onFailedToStartQuery && onFailedToStartQuery instanceof Function) {
          _onFailedToStartQuery = onFailedToStartQuery;
          return true;
        }
        return false;
      }, 
      /**
       * Set onReceiveRequestToEnableQuery callback.
       * @method SetOnReceiveRequestToEnableQueryCB
       * @param {Function} onReceiveRequestToEnableQuery
       * @return {Boolean} true or false
       */
      SetOnReceiveRequestToEnableQueryCB: function (onReceiveRequestToEnableQuery) {
        if (_addon && onReceiveRequestToEnableQuery && onReceiveRequestToEnableQuery instanceof Function) {
          _onReceiveRequestToEnableQuery = onReceiveRequestToEnableQuery;
          return true;
        }
        return false;
      }, 
      /**
       * Set onReceiveRequestToStartQuery callback.
       * @method SetOnReceiveRequestToStartQueryCB
       * @param {Function} onReceiveRequestToStartQuery
       * @return {Boolean} true or false
       */
      SetOnReceiveRequestToStartQueryCB: function (onReceiveRequestToStartQuery) {
        if (_addon && onReceiveRequestToStartQuery && onReceiveRequestToStartQuery instanceof Function) {
          _onReceiveRequestToStartQuery = onReceiveRequestToStartQuery;
          return true;
        }
        return false;
      }, 
      /**
       * Set onReceiveQueryAnswer callback.
       * @method SetOnReceiveQueryAnswerCB
       * @param {Function} onReceiveQueryAnswer
       * @return {Boolean} true or false
       */
      SetOnReceiveQueryAnswerCB: function (onReceiveQueryAnswer) {
        if (_addon && onReceiveQueryAnswer && onReceiveQueryAnswer instanceof Function) {
          _onReceiveQueryAnswer = onReceiveQueryAnswer;
          return true;
        }
        return false;
      }, 
      /**
       * Set onQueryEnableActionCallback callback.
       * @method SetOnQueryEnableActionCallback
       * @param {Function} onQueryEnableActionCallback
       * @return {Boolean} true or false
       */
      SetOnQueryEnableActionCallback: function (onQueryEnableActionCallback) {
        if (_addon && onQueryEnableActionCallback && onQueryEnableActionCallback instanceof Function) {
          _onQueryEnableActionCallback = onQueryEnableActionCallback;
          return true;
        }
        return false;
      },
      /**
       * Set onSendQueryPrivilegeChanged callback.
       * @method SetOnSendQueryPrivilegeChangedCB
       * @param {Function} onSendQueryPrivilegeChanged
       * @return {Boolean} true or false
       */
      SetOnSendQueryPrivilegeChangedCB: function (onSendQueryPrivilegeChanged) {
        if (_addon && onSendQueryPrivilegeChanged && onSendQueryPrivilegeChanged instanceof Function) {
          _onSendQueryPrivilegeChanged = onSendQueryPrivilegeChanged;
          return true;
        }
        return false;
      }, 
      /**
       * Set onFailedToRequestSendQuery callback.
       * @method SetOnFailedToRequestSendQueryCB
       * @param {Function} onFailedToRequestSendQuery
       * @return {Boolean} true or false
       */
      SetOnFailedToRequestSendQueryCB: function (onFailedToRequestSendQuery) {
        if (_addon && onFailedToRequestSendQuery && onFailedToRequestSendQuery instanceof Function) {
          _onFailedToRequestSendQuery = onFailedToRequestSendQuery;
          return true;
        }
        return false;
      },
      /**
       * Set onReceiveRequestToSendQuery callback.
       * @method SetOnReceiveRequestToSendQueryCB
       * @param {Function} onReceiveRequestToSendQuery
       * @return {Boolean} true or false
       */
      SetOnReceiveRequestToSendQueryCB: function (onReceiveRequestToSendQuery) {
        if (_addon && onReceiveRequestToSendQuery && onReceiveRequestToSendQuery instanceof Function) {
          _onReceiveRequestToSendQuery = onReceiveRequestToSendQuery;
          return true;
        }
        return false;
      }, 
      /**
      * Determines whether the current meeting supports turning off the AI Companion features.
      * @method IsTurnoffAllAICompanionsSupported
      * @return {Boolean} true if supported. Otherwise, false.
      */
      IsTurnoffAllAICompanionsSupported: function () {
        if (_addon) {
          return _addon.IsTurnoffAllAICompanionsSupported();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Determines whether the current meeting supports turning on the AI Companion features.
      * @method IsTurnOnAllAICompanionsSupported
      * @return {Boolean} true if supported. Otherwise, false.
      */
      IsTurnOnAllAICompanionsSupported: function () {
        if (_addon) {
          return _addon.IsTurnOnAllAICompanionsSupported();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Determines whether the current user can turn off the AI Companion features. 
      * @method CanTurnOffAllAICompanions
      * @return {Boolean} true indicates the user can turn off the AI Companion features.
      */
      CanTurnOffAllAICompanions: function () {
        if (_addon) {
          return _addon.CanTurnOffAllAICompanions();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Determines whether the current user can turn on the AI Companion features. 
      * @method CanTurnOnAllAICompanions
      * @return {Boolean} true indicates the user can turn on the AI Companion features.
      */
      CanTurnOnAllAICompanions: function () {
        if (_addon) {
          return _addon.CanTurnOnAllAICompanions();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Turn off the AI Companion features.
      * @method TurnOffAllAICompanions
      * @note All AI features including smart summary, smart recording and query can be turned off at once.
      * @param {Boolean} deleteAssets Specify whether delete the meeting assets when turn off the AI Companion features.
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      */
      TurnOffAllAICompanions: function (opts) {
        if (_addon) {
          let clientOpts = opts || {};
          let deleteAssets = clientOpts.deleteAssets;
          try {
            let TurnOffAllAICompanionsParams = new messages.TurnOffAllAICompanionsParams();
            TurnOffAllAICompanionsParams.setDeleteassets(deleteAssets);
            let bytes = TurnOffAllAICompanionsParams.serializeBinary();
            return _addon.TurnOffAllAICompanions(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Turn on the AI Companion features.
      * @method TurnOnAllAICompanions
      * @note Only smart summary and query can be turned on at once.
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      */
      TurnOnAllAICompanions: function () {
        if (_addon) {
          return _addon.TurnOnAllAICompanions();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Determines whether the current user can request host to turn off all started AI Companion features.
      * @method CanRequestTurnoffAllAICompanions
      * @note All AI features include smart summary, smart recording and query can be requested to turn off at once.
      * @note If the current user join the meeting before the host, they can check CanTurnOffAllAICompanions to turn off the AI Companion features by himself/herself.
      * @return {Boolean} true indicates the user can request host to turn off all started AI Companion features.
      */
      CanRequestTurnoffAllAICompanions: function () {
        if (_addon) {
          return _addon.CanRequestTurnoffAllAICompanions();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Determines whether the current user can request host to turn on all AI Companion features if they are enabled for the current meeting.
      * @method CanRequestTurnOnAllAICompanions
      * @note Only smart summary and query can be requested to turn on at once.
      * @return {Boolean} true indicates the user can request host to turn on the AI Companion features.
      */
      CanRequestTurnOnAllAICompanions: function () {
        if (_addon) {
          return _addon.CanRequestTurnOnAllAICompanions();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * request host to turn off all started AI Companion features.
      * @method RequestTurnoffAllAICompanions
      * @note All AI features include smart summary, smart recording and query can be requested to turn off at once.
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      */
      RequestTurnoffAllAICompanions: function () {
        if (_addon) {
          return _addon.RequestTurnoffAllAICompanions();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * request host to turn on all AI Companion features if they are enabled for the current meeting.
      * @method RequestTurnOnAllAICompanions
      * @note Only smart summary and query can be requested to turn on at once.
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      */
      RequestTurnOnAllAICompanions: function () {
        if (_addon) {
          return _addon.RequestTurnOnAllAICompanions();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Get the list of features that the participant turns off.
      * @method GetFeatureList
      * @return {Array}
      */
      GetFeatureList: function () {
        if (_addon) {
          return _addon.GetFeatureList();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Get the list of features that the assets are deleted when the feature is turned off by participant.
      * @method GetAssetsDeletedFeatureList
      * @return {Array}
      */
      GetAssetsDeletedFeatureList: function () {
        if (_addon) {
          return _addon.GetAssetsDeletedFeatureList();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Turn on the auto AI Companion feature which was stopped by the participant before the host or cohost joined meeting.
      * @method TurnOnAgain
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      */
      TurnOnAgain: function () {
        if (_addon) {
          return _addon.TurnOnAgain();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Agree the auto AI Companion feature turn off status. Keep the AI Companion feature off.
      * @method AgreeTurnOff
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      */
      AgreeTurnOff: function () {
        if (_addon) {
          return _addon.AgreeTurnOff();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Get the user ID who requests host to turn the AI Companion features on or off.
      * @method GetRequestUserID
      * @return {Number} the request user ID.
      */
      GetRequestUserID: function () {
        if (_addon) {
          return _addon.GetRequestUserID();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Turn the AI Companion features on or off.
      * @method IsTurnOn
      * @return {Boolean} true if turn on the AI Companion features. Otherwise, false.
      */
      IsTurnOn: function () {
        if (_addon) {
          return _addon.IsTurnOn();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Agree the request to turn the AI companion features on or off.
      * @method Agree
      * @param {Boolean} deleteAssets Specify whether delete the meeting assets when turning off the AI Companion features.
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      */
      Agree: function (opts) {
        if (_addon) {
          let clientOpts = opts || {};
          let deleteAssets = clientOpts.deleteAssets;
          try {
            let AgreeAICompanionFeatureSwitchParams = new messages.AgreeAICompanionFeatureSwitchParams();
            AgreeAICompanionFeatureSwitchParams.setDeleteassets(deleteAssets);
            let bytes = AgreeAICompanionFeatureSwitchParams.serializeBinary();
            return _addon.Agree(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Decline the request to turn the AI companion features on or off.
      * @method Decline
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      */
      Decline: function () {
        if (_addon) {
          return _addon.Decline();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Enable smart summary.
      * @method EnableSmartSummary
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      */
      EnableSmartSummary: function () {
        if (_addon) {
          return _addon.EnableSmartSummary();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Determines if this handler is requesting enable smart summary.
      * @method IsForRequestEnableSmartSummary
      * @return {Boolean} true if this handler is for requesting enable smart summary. Otherwise, false.
      */
      IsForRequestEnableSmartSummary: function () {
        if (_addon) {
          return _addon.IsForRequestEnableSmartSummary();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Start smart summary.
      * @method StartSmartSummary
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      */
      StartSmartSummary: function () {
        if (_addon) {
          return _addon.StartSmartSummary();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Determines if this handler is for requesting to start the smart summary.
      * @method IsForRequestStartSmartSummary
      * @return {Boolean} true if this handler is requesting to start the smart summary. Otherwise, false.
      */
      IsForRequestStartSmartSummary: function () {
        if (_addon) {
          return _addon.IsForRequestStartSmartSummary();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Stop smart summary.
      * @method StopSmartSummary
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      */
      StopSmartSummary: function () {
        if (_addon) {
          return _addon.StopSmartSummary();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Get the user ID of the requester.
      * @method GetSenderEnableSmartSummaryUserID
      * @return {Number} The user ID of the requester.
      */
      GetSenderEnableSmartSummaryUserID: function () {
        if (_addon) {
          return _addon.GetSenderEnableSmartSummaryUserID();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Continue approve action.
      * @method ContinueApproveEnableSmartSummary
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      */
      ContinueApproveEnableSmartSummary: function () {
        if (_addon) {
          return _addon.ContinueApproveEnableSmartSummary();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Get the user ID of the requester.
      * @method GetSenderStartSmartSummaryUserID
      * @return {Number} The user ID of the requester.
      */
      GetSenderStartSmartSummaryUserID: function () {
        if (_addon) {
          return _addon.GetSenderStartSmartSummaryUserID();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Approve request.
      * @method ApproveStartSmartSummary
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      */
      ApproveStartSmartSummary: function () {
        if (_addon) {
          return _addon.ApproveStartSmartSummary();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * ConfirmEnableSmartSummaryAction request.
      * @method DeclineStartSmartSummary
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      */
      DeclineStartSmartSummary: function () {
        if (_addon) {
          return _addon.DeclineStartSmartSummary();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Get the title of tip.
      * @method GetEnableSmartSummaryActionTipTitle
      * @return {String} The title of tip.
      */
      GetEnableSmartSummaryActionTipTitle: function () {
        if (_addon) {
          return _addon.GetEnableSmartSummaryActionTipTitle();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Get the string of tip.
      * @method GetEnableSmartSummaryActionTipString
      * @return {String} The string of tip.
      */
      GetEnableSmartSummaryActionTipString: function () {
        if (_addon) {
          return _addon.GetEnableSmartSummaryActionTipString();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Confirm enabling smart summary.
      * @method ConfirmEnableSmartSummaryAction
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      */
      ConfirmEnableSmartSummaryAction: function () {
        if (_addon) {
          return _addon.ConfirmEnableSmartSummaryAction();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Cancel enabling smart summary.
      * @method CancelEnableSmartSummaryAction
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      */
      CancelEnableSmartSummaryAction: function () {
        if (_addon) {
          return _addon.CancelEnableSmartSummaryAction();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Change query setting.
      * @return {Object} bCan true if it can change the setting. Otherwise, false.
      */
      CanChangeQuerySetting: function () {
        if (_addon) {
          return _addon.CanChangeQuerySetting();
        }
        return {};
      },
      /**
      * Change query setting.
      * @method ChangeQuerySettings
      * @param {Number} setting The query setting, For more details, see {@link MeetingAICompanionQuerySettingOptions}
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      */
      ChangeQuerySettings: function (opts) {
        if (_addon) {
          let clientOpts = opts || {};
          let setting = clientOpts.setting;
          try {
            let ChangeQuerySettingsParams = new messages.ChangeQuerySettingsParams();
            ChangeQuerySettingsParams.setSetting(setting);
            let bytes = ChangeQuerySettingsParams.serializeBinary();
            return _addon.ChangeQuerySettings(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Get the selected query setting.
      * @method GetSelectedQuerySetting
      * @return {Number} If the function succeeds, it returns the selected query setting. Otherwise, this function returns an error.
      */
      GetSelectedQuerySetting: function () {
        if (_addon) {
          return _addon.GetSelectedQuerySetting();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Determines whether the legal notice for the AI Companion query is available.
      * @return {Object} bAvailable true indicates the legal notice for the AI Companion query is available. Otherwise the legal notice is not available.
      */
      IsAICompanionQueryLegalNoticeAvailable: function () {
        if (_addon) {
          return _addon.IsAICompanionQueryLegalNoticeAvailable();
        }
        return {};
      },
      /**
      * Get the AI Companion query legal notices prompt.
      * @return {String} If the function succeeds, it returns the AI Companion query legal notices prompt. Otherwise, this function returns an empty string.
      */
      GetAICompanionQueryLegalNoticesPrompt: function () {
        if (_addon) {
          return _addon.GetAICompanionQueryLegalNoticesPrompt();
        }
        return "";
      },
      /**
      * Get the AI Companion query legal notices explained.
      * @return {String} If the function succeeds, it returns the AI Companion query legal notices explained. Otherwise, this function returns an empty string.
      */
      GetAICompanionQueryLegalNoticesExplained: function () {
        if (_addon) {
          return _addon.GetAICompanionQueryLegalNoticesExplained();
        }
        return "";
      },
      /**
      * Determines whether the legal notice for the AI Companion query privacy is available.
      * @return {Object} bAvailable true indicates the legal notice for the AI Companion query privacy is available. Otherwise the legal notice is not available.
      */
      IsAICompanionQueryPrivacyLegalNoticeAvailable: function () {
        if (_addon) {
          return _addon.IsAICompanionQueryPrivacyLegalNoticeAvailable();
        }
        return {};
      },
      /**
      * Get the AI Companion query privacy legal notices prompt.
      * @return {String} If the function succeeds, it returns the AI Companion query privacy legal notices prompt. Otherwise, this function returns an empty string.
      */
      GetAICompanionQueryPrivacyLegalNoticesPrompt: function () {
        if (_addon) {
          return _addon.GetAICompanionQueryPrivacyLegalNoticesPrompt();
        }
        return "";
      },
      /**
      * Enable meeting query.
      * @method EnableQuery
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      */
      EnableQuery: function () {
        if (_addon) {
          return _addon.EnableQuery();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Determines if this handler for request enable query.
      * @method IsForRequestEnableQuery
      * @return {Boolean} true if this handler is for request enable query. Otherwise, false.
      */
      IsForRequestEnableQuery: function () {
        if (_addon) {
          return _addon.IsForRequestEnableQuery();
        }
        return false;
      },
      /**
      * Start meeting query.
      * @method StartMeetingQuery
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      */
      StartMeetingQuery: function () {
        if (_addon) {
          return _addon.StartMeetingQuery();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Determines if this handler for request start query.
      * @method IsForRequestStartMeetingQuery
      * @return {Boolean} true if this handler is for request start query. Otherwise, false.
      */
      IsForRequestStartMeetingQuery: function () {
        if (_addon) {
          return _addon.IsForRequestStartMeetingQuery();
        }
        return false;
      },
      /**
      * Get default query questions.
      * @method GetDefaultQueryQuestions
      * @return {Array} If the function succeeds, it returns the array of questions. Otherwise, this function returns an empty array.
      */
      GetDefaultQueryQuestions: function () {
        if (_addon) {
          return _addon.GetDefaultQueryQuestions();
        }
        return [];
      },
      /**
      * Send query question.
      * @method SendQueryQuestion
      * @param {String} question The query question.
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      */
      SendQueryQuestion: function (opts) {
        if (_addon) {
          let clientOpts = opts || {};
          let question = clientOpts.question;
          try {
            let SendQueryQuestionParams = new messages.SendQueryQuestionParams();
            SendQueryQuestionParams.setQuestion(question);
            let bytes = SendQueryQuestionParams.serializeBinary();
            return _addon.SendQueryQuestion(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Stop meeting query.
      * @method StopMeetingQuery
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      */
      StopMeetingQuery: function () {
        if (_addon) {
          return _addon.StopMeetingQuery();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Determines if can send query question.
      * @method CanSendQuery
      * @return {Boolean} true if the current user can send query. Otherwise, false.
      */
      CanSendQuery: function () {
        if (_addon) {
          return _addon.CanSendQuery();
        }
        return false;
      },
      /**
      * Request send query privilege.
      * @method RequestSendQueryPrivilege
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      */
      RequestSendQueryPrivilege: function () {
        if (_addon) {
          return _addon.RequestSendQueryPrivilege();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Get the user ID of the requester.
      * @method GetSenderEnableQueryUserID
      * @return {Number} The user ID of the requester.
      */
      GetSenderEnableQueryUserID: function () {
        if (_addon) {
          return _addon.GetSenderEnableQueryUserID();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Continue approve action.
      * @method ContinueApproveEnableQuery
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      */
      ContinueApproveEnableQuery: function () {
        if (_addon) {
          return _addon.ContinueApproveEnableQuery();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Get the user ID of the requester.
      * @method GetSenderStartQueryUserID
      * @return {Number} The user ID of the requester.
      */
      GetSenderStartQueryUserID: function () {
        if (_addon) {
          return _addon.GetSenderStartQueryUserID();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Approve request.
      * @method ApproveStartQuery
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      */
      ApproveStartQuery: function () {
        if (_addon) {
          return _addon.ApproveStartQuery();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Decline request.
      * @method DeclineStartQuery
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      */
      DeclineStartQuery: function () {
        if (_addon) {
          return _addon.DeclineStartQuery();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Send feedback of query answer.
      * @method AICompanionQueryFeedback
      * @param {Number} feedbackType The feedback type. For more details, see {@link MeetingAICompanionQueryFeedbackType}
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      */
      AICompanionQueryFeedback: function (opts) {
        if (_addon) {
          let clientOpts = opts || {};
          let feedbackType = clientOpts.feedbackType;
          if (feedbackType == undefined) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
          try {
            let AICompanionQueryFeedbackParams = new messages.AICompanionQueryFeedbackParams();
            AICompanionQueryFeedbackParams.setFeedbacktype(feedbackType);
            let bytes = AICompanionQueryFeedbackParams.serializeBinary();
            return _addon.AICompanionQueryFeedback(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Get the title of the tip.
      * @return {String}
      */
      GetEnableQueryActionTipTitle: function () {
        if (_addon) {
          return _addon.GetEnableQueryActionTipTitle();
        }
        return "";
      },
      /**
      * Get the tip string.
      * @return {String}
      */
      GetEnableQueryActionTipString: function () {
        if (_addon) {
          return _addon.GetEnableQueryActionTipString();
        }
        return "";
      },
      /**
      * Confirm enable query. The object will be deleted after this interface call.
      * @method ConfirmEnableQueryAction
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      */
      ConfirmEnableQueryAction: function () {
        if (_addon) {
          return _addon.ConfirmEnableQueryAction();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Cancel enable query. The object will be deleted after this interface call.
      * @method CancelEnableQueryAction
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      */
      CancelEnableQueryAction: function () {
        if (_addon) {
          return _addon.CancelEnableQueryAction();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Get the requester's user ID.
      * @method GetSenderQueryUserID
      * @return {Number} the requester's user ID.
      */
      GetSenderQueryUserID: function () {
        if (_addon) {
          return _addon.GetSenderQueryUserID();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Approve the request.
      * @method ApproveSendQuery
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      */
      ApproveSendQuery: function () {
        if (_addon) {
          return _addon.ApproveSendQuery();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Decline the request.
      * @method DeclineSendQuery
      * @param {Boolean} bDeclineAll true indicates decline all requests.
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      */
      DeclineSendQuery: function (opts) {
        if (_addon) {
          let clientOpts = opts || {};
          let bDeclineAll = clientOpts.bDeclineAll;
          try {
            let DeclineSendQueryParams = new messages.DeclineSendQueryParams();
            DeclineSendQueryParams.setBdeclineall(bDeclineAll);
            let bytes = DeclineSendQueryParams.serializeBinary();
            return _addon.DeclineSendQuery(bytes);
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
      return instance;
    }
  };
})();

module.exports = {
  ZoomMeetingAICompanion: ZoomMeetingAICompanion
}