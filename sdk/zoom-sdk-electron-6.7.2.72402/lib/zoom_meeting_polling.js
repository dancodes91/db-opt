let { ZoomSDKError } = require("./settings.js");
const messages = require("./electron_sdk_pb.js");

var ZoomMeetingPolling = (function () {
  var instance;
  /**
   * Zoom Meeting Polling
   * @module zoom_meeting_polling
   * @param {Function} onPollingStatusChanged Polling status changed callback. Use this function to inform the user that the polling has been started, share result or stopped.
   * @param {Function} onPollingResultUpdated Polling result updated callback. This is triggered when a participant submits polling.
   * @param {Function} onPollingListUpdated Polling list updated callback. This is triggered when a host adds, edits, duplicates or deletes a polling.
   * @param {Function} onPollingActionResult Polling action result callback. This is triggered when a user perform an action for a poll.
   * @return {ZoomMeetingPolling}
   */
  function init(opts) {
    let clientOpts = opts || {};
    // Private methods and variables
    let _addon = clientOpts.addon.GetMeetingPollingCtrl() || null;
    let _onPollingStatusChanged = clientOpts.onPollingStatusChanged || null;
    let _onPollingResultUpdated = clientOpts.onPollingResultUpdated || null;
    let _onPollingListUpdated = clientOpts.onPollingListUpdated || null;
    let _onPollingActionResult = clientOpts.onPollingActionResult || null;

    /**
     * Polling status changed callback. Use this function to inform the user that the polling has been started, share result or stopped.
     * @event onPollingStatusChanged
     * @param {String} pollingID Specify the status changed poll's ID.
     * @param {Number} status Specify current polling status.
     */
    function onPollingStatusChanged(pollingID, status) {
      if (_onPollingStatusChanged) {
        _onPollingStatusChanged(pollingID, status);
      }
    }

    /**
     * Polling result updated callback. This is triggered when a participant submits polling.
     * @event onPollingResultUpdated
     * @param {String} pollingID Specify the result updated poll's ID.
     */
    function onPollingResultUpdated(pollingID) {
      if (_onPollingResultUpdated) {
        _onPollingResultUpdated(pollingID);
      }
    }

    /**
     * Polling list updated callback. This is triggered when a host adds, edits, duplicates or deletes a polling.
     * @event onPollingListUpdated
     */
    function onPollingListUpdated() {
      if (_onPollingListUpdated) {
        _onPollingListUpdated();
      }
    }

    /**
     * Polling action result callback. This is triggered when a user perform an action for a poll.
     * @event onPollingActionResult
     * @param {Number} actionType Specify the action type.
     * @param {String} pollingID Specify the action poll's ID.
     * @param {Boolean} bSuccess Specify whether the action succeeds.
     * @param {String} errorMsg Specify the error message when the action fails. It is only for SDKPollingActionType_Error.
     * @note If actionType is SDKPollingActionType_Error, use errorMsg. This errorMsg may be triggered by any action.
     */
    function onPollingActionResult(actionType, pollingID, bSuccess, errorMsg) {
      if (_onPollingActionResult) {
        _onPollingActionResult(actionType, pollingID, bSuccess, errorMsg);
      }
    }

    if (_addon) {
      _addon.SetOnPollingStatusChangedCB(onPollingStatusChanged);
      _addon.SetOnPollingResultUpdatedCB(onPollingResultUpdated);
      _addon.SetOnPollingListUpdatedCB(onPollingListUpdated);
      _addon.SetOnPollingActionResultCB(onPollingActionResult);
    }

    return {
      // Public methods and variables
      /**
       * Set onPollingStatusChanged callback.
       * @method SetOnPollingStatusChangedCB
       * @param {Function} onPollingStatusChanged
       * @return {Boolean} true or false
       */
      SetOnPollingStatusChangedCB: function (onPollingStatusChanged) {
        if (
          _addon &&
          onPollingStatusChanged &&
          onPollingStatusChanged instanceof Function
        ) {
          _onPollingStatusChanged = onPollingStatusChanged;
          return true;
        }
        return false;
      },
      /**
       * Set onPollingResultUpdated callback.
       * @method SetOnPollingResultUpdatedCB
       * @param {Function} onPollingResultUpdated
       * @return {Boolean} true or false
       */
      SetOnPollingResultUpdatedCB: function (onPollingResultUpdated) {
        if (
          _addon &&
          onPollingResultUpdated &&
          onPollingResultUpdated instanceof Function
        ) {
          _onPollingResultUpdated = onPollingResultUpdated;
          return true;
        }
        return false;
      },
      /**
       * Set onPollingListUpdated callback.
       * @method SetOnPollingListUpdatedCB
       * @param {Function} onPollingListUpdated
       * @return {Boolean} true or false
       */
      SetOnPollingListUpdatedCB: function (onPollingListUpdated) {
        if (
          _addon &&
          onPollingListUpdated &&
          onPollingListUpdated instanceof Function
        ) {
          _onPollingListUpdated = onPollingListUpdated;
          return true;
        }
        return false;
      },
      /**
       * Set onPollingActionResult callback.
       * @method SetOnPollingActionResultCB
       * @param {Function} onPollingActionResult
       * @return {Boolean} true or false
       */
      SetOnPollingActionResultCB: function (onPollingActionResult) {
        if (
          _addon &&
          onPollingActionResult &&
          onPollingActionResult instanceof Function
        ) {
          _onPollingActionResult = onPollingActionResult;
          return true;
        }
        return false;
      },
      /**
       * Determine if the right answer item list can be allowed to get.
       * @method CanGetRightAnswerItemList
       * @param {String} pollingID Specify the right answer's polling ID
       * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
       */
      CanGetRightAnswerItemList: function (opts) {
        if (_addon) {
          var clientOpts = opts || {};
          var pollingID = clientOpts.pollingID;
          if (!pollingID) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
          try {
            let PollingIDParams = new messages.PollingIDParams();
            PollingIDParams.setPid(pollingID);
            let bytes = PollingIDParams.serializeBinary();
            return _addon.CanGetRightAnswerItemList(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * Get the list of poll's question.
       * @method GetPollingQuestionItemList
       * @param {String} pollingID Specify the question's polling ID
       * @return {Array} If the function succeeds, the return value is a list of polling question item objects, each with the following properties:
       *   - pollingID
       *   - pollingQuestionID
       *   - pollingQuestionName
       *   - pollingQuestionType
       *   - answeredCount
       *   - isRequired
       */
      GetPollingQuestionItemList: function (opts) {
        if (_addon) {
          var clientOpts = opts || {};
          var pollingID = clientOpts.pollingID;
          if (!pollingID) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
          try {
            let PollingIDParams = new messages.PollingIDParams();
            PollingIDParams.setPid(pollingID);
            let bytes = PollingIDParams.serializeBinary();
            let pollingQuestionList = _addon.GetPollingQuestionItemList(bytes),
              final_pollingQuestionList = [];
            if (pollingQuestionList) {
              for (let item of pollingQuestionList) {
                let questionObj = {};
                questionObj = item[0];
                let pollingSubQuestionItemList = item[1];
                let final_subQuestionItemList = [];

                for (let subQuestionItem of pollingSubQuestionItemList) {
                  let subQuestionObj = {};
                  subQuestionObj = subQuestionItem[0];
                  let subsSubQuestionList = subQuestionItem[1];
                  let subsAnswerList = subQuestionItem[2];
                  subQuestionObj.pollingSubQuestionItemList = subsSubQuestionList;
                  subQuestionObj.pollingAnswerItemList = subsAnswerList;
                  final_subQuestionItemList.push(subQuestionObj);
                }

                let pollingAnswerItemList = item[2];
                questionObj.pollingSubQuestionItemList = final_subQuestionItemList;
                questionObj.pollingAnswerItemList = pollingAnswerItemList;
                final_pollingQuestionList.push(questionObj);
              }
              return final_pollingQuestionList;
            } else {
              return [];
            }
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
      },
      /**
       * Get the list of polling question or subquestion's right answer.
       * @method GetPollingRightAnswerItemList
       * @param {String} pollingID Specify the right answer's polling ID
       * @return {Array} If the function succeeds, the return value is a list of polling answer item objects, each with the following properties:
       *   - pollingID
       *   - pollingQuestionID
       *   - pollingSubQuestionID
       *   - pollingAnswerID
       *   - pollingAnswerName
       *   - pollingAnsweredContent
       *   - isChecked: This property has no meaning for the correct answer.
       */
      GetPollingRightAnswerItemList: function (opts) {
        if (_addon) {
          var clientOpts = opts || {};
          var pollingID = clientOpts.pollingID;
          if (!pollingID) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
          try {
            let PollingIDParams = new messages.PollingIDParams();
            PollingIDParams.setPid(pollingID);
            let bytes = PollingIDParams.serializeBinary();
            let pollingRightAnswerList = _addon.GetPollingRightAnswerItemList(bytes);
            if (pollingRightAnswerList) {
              return pollingRightAnswerList;
            } else {
              return [];
            }
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
      },
      /**
       * Get the list of polling answer result item.
       * @method GetPollingAnswerResultItemList
       * @param {String} pollingID Specify the answer result's polling ID
       * @return {Array} If the function succeeds, the return value is a list of polling answer result item objects, each with the following properties:
       *   - pollingID
       *   - pollingQuestionID
       *   - pollingSubQuestionID
       *   - pollingAnswerID
       *   - pollingAnswerName
       *   - selectedCount: How many participants selected this answer.
       */
      GetPollingAnswerResultItemList: function (opts) {
        if (_addon) {
          var clientOpts = opts || {};
          var pollingID = clientOpts.pollingID;
          if (!pollingID) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
          try {
            let PollingIDParams = new messages.PollingIDParams();
            PollingIDParams.setPid(pollingID);
            let bytes = PollingIDParams.serializeBinary();
            let pollingResultAnswerList = _addon.GetPollingAnswerResultItemList(bytes);
            if (pollingResultAnswerList) {
              return pollingResultAnswerList;
            } else {
              return [];
            }
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
      },
      /**
       * Get the polling item object of specified polling ID.
       * @method GetPollingItemByID
       * @param {String} pollingID Specify the polling ID where you want to get the information
       * @return {Object} If the function succeeds, the return value is a polling item object with the following properties:
       *   - pollingID
       *   - pollingName
       *   - pollingType
       *   - pollingStatus
       *   - pollingQuestionCount
       *   - totalVotedUserCount
       *   - isLibraryPolling
       */
      GetPollingItemByID: function (opts) {
        if (_addon) {
          var clientOpts = opts || {};
          var pollingID = clientOpts.pollingID;
          if (!pollingID) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
          try {
            let PollingIDParams = new messages.PollingIDParams();
            PollingIDParams.setPid(pollingID);
            let bytes = PollingIDParams.serializeBinary();
            let pollingList = _addon.GetPollingItemByID(bytes),
              pollingObj = {};
            if (pollingList) {
              pollingObj = pollingList[0];
            }
            return pollingObj;
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
      },
      /**
       * Determine whether the current meeting can do the polling.
       * @method CanDoPolling
       * @return {Boolean} true indicates you can do polling
       */
      CanDoPolling: function () {
        if (_addon) {
          return _addon.CanDoPolling();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * Get the list of poll item.
       * @method GetPollingItemList
       * @return {Array} If the function succeeds, the return value is a list of polling item objects, each with the following properties:
       *   - pollingID
       *   - pollingName
       *   - pollingType
       *   - pollingStatus
       *   - pollingQuestionCount
       *   - totalVotedUserCount
       *   - isLibraryPolling
       */
      GetPollingItemList: function () {
        if (_addon) {
          return _addon.GetPollingItemList();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * Start the polling.
       * @method StartPolling
       * @param {String} pollingID Specify the poll's polling ID
       * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
       */
      StartPolling: function (opts) {
        if (_addon) {
          var clientOpts = opts || {};
          var pollingID = clientOpts.pollingID;
          if (!pollingID) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
          try {
            let PollingIDParams = new messages.PollingIDParams();
            PollingIDParams.setPid(pollingID);
            let bytes = PollingIDParams.serializeBinary();
            return _addon.StartPolling(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_INVALID_PARAMETER;
      },
      /**
       * Stop the polling.
       * @method StopPolling
       * @param {String} pollingID Specify the poll's polling ID
       * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
       */
      StopPolling: function (opts) {
        if (_addon) {
          var clientOpts = opts || {};
          var pollingID = clientOpts.pollingID;
          if (!pollingID) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
          try {
            let PollingIDParams = new messages.PollingIDParams();
            PollingIDParams.setPid(pollingID);
            let bytes = PollingIDParams.serializeBinary();
            return _addon.StopPolling(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_INVALID_PARAMETER;
      },
      /**
       * Restart the polling.
       * @method RestartPolling
       * @param {String} pollingID Specify the poll's polling ID
       * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
       */
      RestartPolling: function (opts) {
        if (_addon) {
          var clientOpts = opts || {};
          var pollingID = clientOpts.pollingID;
          if (!pollingID) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
          try {
            let PollingIDParams = new messages.PollingIDParams();
            PollingIDParams.setPid(pollingID);
            let bytes = PollingIDParams.serializeBinary();
            return _addon.RestartPolling(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_INVALID_PARAMETER;
      },
      /**
       * Determine if the question is case sensitive.
       * @method IsQuestionCaseSensitive
       * @param {String} pollingID Specify the question's polling ID
       * @param {String} questionID Specify the question's question ID
       * @return {Boolean} true indicates the question is case sensitive, Otherwise, false
       * @note This function can only be used by fill blank questions
       */
      IsQuestionCaseSensitive: function (opts) {
        if (_addon) {
          var clientOpts = opts || {};
          var pollingID = clientOpts.pollingID;
          var questionID = clientOpts.questionID;
          if (!pollingID || !questionID) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
          try {
            let QuestionCaseSensitiveParams = new messages.QuestionCaseSensitiveParams();
            QuestionCaseSensitiveParams.setPid(pollingID);
            QuestionCaseSensitiveParams.setQid(questionID);
            let bytes = QuestionCaseSensitiveParams.serializeBinary();
            return _addon.IsQuestionCaseSensitive(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * Get the polling question's image path.
       * @method GetPollingQuestionImagePath
       * @param {String} pollingID Specify the answer's polling ID
       * @param {String} questionID Specify the answer's question ID
       * @return {String} If the function succeeds, the return value is the question's image path. Otherwise the function fails and the return value is null.
       */
      GetPollingQuestionImagePath: function (opts) {
        if (_addon) {
          var clientOpts = opts || {};
          var pollingID = clientOpts.pollingID;
          var questionID = clientOpts.questionID;
          if (!pollingID || !questionID) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
          try {
            let QuestionImagePathParams = new messages.QuestionImagePathParams();
            QuestionImagePathParams.setPid(pollingID);
            QuestionImagePathParams.setQid(questionID);
            let bytes = QuestionImagePathParams.serializeBinary();
            return _addon.GetPollingQuestionImagePath(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      }
    };
  }

  return {
    getInstance: function (opts) {
      if (!instance) {
        instance = init(opts);
      }
      return instance;
    },
  };
})();

module.exports = {
  ZoomMeetingPolling: ZoomMeetingPolling,
};
