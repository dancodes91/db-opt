let { ZoomSDKError } = require("./settings.js");
const messages = require("./electron_sdk_pb.js");

var ZoomMeetingQA = (function () {
  var instance;
  /**
   * Zoom Meeting Q&A
   * @module zoom_meeting_qa
   * @param {Function} onAddQuestion Callback event of adding question
   * @param {Function} onReceiveQuestion Callback event of receiving question
   * @param {Function} onDeleteQuestions Callback event of deleting question(s)
   * @param {Function} onQuestionMarkedAsDismissed Callback event of marking question as dismissed
   * @param {Function} onReopenQuestion Callback event of reopening question
   * @param {Function} onUserLivingReply Callback event of user answering live
   * @param {Function} onRevokeVoteupQuestion Callback event of revoking voting up question
   * @param {Function} onAddAnswer Callback event of adding answer
   * @param {Function} onReceiveAnswer Callback event of receiving answer
   * @param {Function} onDeleteAnswers Callback event of deleting answer(s)
   * @param {Function} onVoteupQuestion Callback event of voting up question
   * @param {Function} onUserEndLiving Callback event of end of user answering live
   * @return {ZoomMeetingQA}
   */
  function init(opts) {
    let clientOpts = opts || {};
    // Private methods and variables
    let _addon = clientOpts.addon.GetMeetingQACtrl() || null;
    let _onAddQuestion = clientOpts.onAddQuestion || null;
    let _onReceiveQuestion = clientOpts.onReceiveQuestion || null;
    let _onDeleteQuestions = clientOpts.onDeleteQuestions || null;
    let _onQuestionMarkedAsDismissed = clientOpts.onQuestionMarkedAsDismissed || null;
    let _onReopenQuestion = clientOpts.onReopenQuestion || null;
    let _onUserLivingReply = clientOpts.onUserLivingReply || null;
    let _onUserEndLiving = clientOpts.onUserEndLiving || null;
    let _onReceiveAnswer = clientOpts.onReceiveAnswer || null;
    let _onAddAnswer = clientOpts.onAddAnswer || null;
    let _onDeleteAnswers = clientOpts.onDeleteAnswers || null;
    let _onVoteupQuestion = clientOpts.onVoteupQuestion || null;
    let _onRevokeVoteupQuestion = clientOpts.onRevokeVoteupQuestion || null;

    /**
     * Callback event of adding question.
     * @event onAddQuestion
     * @param {String} questionID The question id
     * @param {Boolean} bSuccess Add question successfully or not
     */
    function onAddQuestion(questionID, bSuccess) {
      if (_onAddQuestion) {
        _onAddQuestion(questionID, bSuccess);
      }
    }

    /**
     * Callback event of receiving question.
     * @event onReceiveQuestion
     * @param {String} questionID The question id
     */
    function onReceiveQuestion(questionID) {
      if (_onReceiveQuestion) {
        _onReceiveQuestion(questionID);
      }
    }

    /**
     * Callback event of deleting question(s).
     * @event onDeleteQuestions
     * @param {Array} questions The list of question ids
     */
    function onDeleteQuestions(questions) {
      if (_onDeleteQuestions) {
        _onDeleteQuestions(questions);
      }
    }

    /**
     * Callback event of marking question as dismissed.
     * @event onQuestionMarkedAsDismissed
     * @param {String} questionID The question id
     */
    function onQuestionMarkedAsDismissed(questionID) {
      if (_onQuestionMarkedAsDismissed) {
        _onQuestionMarkedAsDismissed(questionID);
      }
    }

    /**
     * Callback event of reopening question.
     * @event onReopenQuestion
     * @param {String} questionID The question id
     */
    function onReopenQuestion(questionID) {
      if (_onReopenQuestion) {
        _onReopenQuestion(questionID);
      }
    }

    /**
     * Callback event of user answering live.
     * @event onUserLivingReply
     * @param {String} questionID The question id
     */
    function onUserLivingReply(questionID) {
      if (_onUserLivingReply) {
        _onUserLivingReply(questionID);
      }
    }

    /**
     * Callback event of end of user answering live.
     * @event onUserEndLiving
     * @param {String} questionID The question id
     */
    function onUserEndLiving(questionID) {
      if (_onUserEndLiving) {
        _onUserEndLiving(questionID);
      }
    }

    /**
     * Callback event of adding answer.
     * @event onAddAnswer
     * @param {String} answerID The answer id
     * @param {Boolean} bSuccess Add answer successfully or not
     */
    function onAddAnswer(answerID, bSuccess) {
      if (_onAddAnswer) {
        _onAddAnswer(answerID, bSuccess);
      }
    }

    /**
     * Callback event of receiving answer.
     * @event onReceiveAnswer
     * @param {String} answerID The answer id
     */
    function onReceiveAnswer(answerID) {
      if (_onReceiveAnswer) {
        _onReceiveAnswer(answerID);
      }
    }

    /**
     * Callback event of deleting answer(s).
     * @event onDeleteAnswers
     * @param {Array} answer The list of answer ids
     */
    function onDeleteAnswers(answer) {
      if (_onDeleteAnswers) {
        _onDeleteAnswers(answer);
      }
    }

    /**
     * Callback event of voting up question.
     * @event onVoteupQuestion
     * @param {String} questionID The vote question id
     * @param {Boolean} isChanged The order of the question in question list is changed or not
     */
    function onVoteupQuestion(questionID, isChanged) {
      if (_onVoteupQuestion) {
        _onVoteupQuestion(questionID, isChanged);
      }
    }

    /**
     * Callback event of revoking voting up question.
     * @event onRevokeVoteupQuestion
     * @param {String} questionID The vote question id
     * @param {Boolean} isChanged The order of the question in question list is changed or not
     */
    function onRevokeVoteupQuestion(questionID, isChanged) {
      if (_onRevokeVoteupQuestion) {
        _onRevokeVoteupQuestion(questionID, isChanged);
      }
    }

    if (_addon) {
      _addon.SetOnAddQuestionCB(onAddQuestion);
      _addon.SetOnReceiveQuestionCB(onReceiveQuestion);
      _addon.SetOnDeleteQuestionsCB(onDeleteQuestions);
      _addon.SetOnQuestionMarkedAsDismissedCB(onQuestionMarkedAsDismissed);
      _addon.SetOnReopenQuestionCB(onReopenQuestion);
      _addon.SetOnUserLivingReplyCB(onUserLivingReply);
      _addon.SetOnUserEndLivingCB(onUserEndLiving);
      _addon.SetOnAddAnswerCB(onAddAnswer);
      _addon.SetOnReceiveAnswerCB(onReceiveAnswer);
      _addon.SetOnDeleteAnswersCB(onDeleteAnswers);
      _addon.SetOnVoteupQuestionCB(onVoteupQuestion);
      _addon.SetOnRevokeVoteupQuestionCB(onRevokeVoteupQuestion);
    }

    return {
      // Public methods and variables
      /**
       * Set onAddQuestion callback.
       * @method SetOnAddQuestionCB
       * @param {Function} onAddQuestion
       * @return {Boolean} true or false
       */
      SetOnAddQuestionCB: function (onAddQuestion) {
        if (_addon && onAddQuestion && onAddQuestion instanceof Function) {
          _onAddQuestion = onAddQuestion;
          return true;
        }
        return false;
      },
      /**
       * Set onReceiveQuestion callback.
       * @method SetOnReceiveQuestionCB
       * @param {Function} onReceiveQuestion
       * @return {Boolean} true or false
       */
      SetOnReceiveQuestionCB: function (onReceiveQuestion) {
        if (
          _addon &&
          onReceiveQuestion &&
          onReceiveQuestion instanceof Function
        ) {
          _onReceiveQuestion = onReceiveQuestion;
          return true;
        }
        return false;
      },
      /**
       * Set onDeleteQuestions callback.
       * @method SetOnDeleteQuestionsCB
       * @param {Function} onDeleteQuestions
       * @return {Boolean} true or false
       */
      SetOnDeleteQuestionsCB: function (onDeleteQuestions) {
        if (
          _addon &&
          onDeleteQuestions &&
          onDeleteQuestions instanceof Function
        ) {
          _onDeleteQuestions = onDeleteQuestions;
          return true;
        }
        return false;
      },
      /**
       * Set onQuestionMarkedAsDismissed callback.
       * @method SetOnQuestionMarkedAsDismissedCB
       * @param {Function} onQuestionMarkedAsDismissed
       * @return {Boolean} true or false
       */
      SetOnQuestionMarkedAsDismissedCB: function (onQuestionMarkedAsDismissed) {
        if (
          _addon &&
          onQuestionMarkedAsDismissed &&
          onQuestionMarkedAsDismissed instanceof Function
        ) {
          _onQuestionMarkedAsDismissed = onQuestionMarkedAsDismissed;
          return true;
        }
        return false;
      },
      /**
       * Set onReopenQuestion callback.
       * @method SetOnReopenQuestionCB
       * @param {Function} onReopenQuestion
       * @return {Boolean} true or false
       */
      SetOnReopenQuestionCB: function (onReopenQuestion) {
        if (
          _addon &&
          onReopenQuestion &&
          onReopenQuestion instanceof Function
        ) {
          _onReopenQuestion = onReopenQuestion;
          return true;
        }
        return false;
      },
      /**
       * Set onUserLivingReply callback.
       * @method SetOnUserLivingReplyCB
       * @param {Function} onUserLivingReply
       * @return {Boolean} true or false
       */
      SetOnUserLivingReplyCB: function (onUserLivingReply) {
        if (
          _addon &&
          onUserLivingReply &&
          onUserLivingReply instanceof Function
        ) {
          _onUserLivingReply = onUserLivingReply;
          return true;
        }
        return false;
      },
      /**
       * Set onUserEndLiving callback.
       * @method SetOnUserEndLivingCB
       * @param {Function} onUserEndLiving
       * @return {Boolean} true or false
       */
      SetOnUserEndLivingCB: function (onUserEndLiving) {
        if (_addon && onUserEndLiving && onUserEndLiving instanceof Function) {
          _onUserEndLiving = onUserEndLiving;
          return true;
        }
        return false;
      },
      /**
       * Set onAddAnswer callback.
       * @method SetOnAddAnswerCB
       * @param {Function} onAddAnswer
       * @return {Boolean} true or false
       */
      SetOnAddAnswerCB: function (onAddAnswer) {
        if (_addon && onAddAnswer && onAddAnswer instanceof Function) {
          _onAddAnswer = onAddAnswer;
          return true;
        }
        return false;
      },
      /**
       * Set onReceiveAnswer callback.
       * @method SetOnReceiveAnswerCB
       * @param {Function} onReceiveAnswer
       * @return {Boolean} true or false
       */
      SetOnReceiveAnswerCB: function (onReceiveAnswer) {
        if (_addon && onReceiveAnswer && onReceiveAnswer instanceof Function) {
          _onReceiveAnswer = onReceiveAnswer;
          return true;
        }
        return false;
      },
      /**
       * Set onDeleteAnswers callback.
       * @method SetOnDeleteAnswersCB
       * @param {Function} onDeleteAnswers
       * @return {Boolean} true or false
       */
      SetOnDeleteAnswersCB: function (onDeleteAnswers) {
        if (_addon && onDeleteAnswers && onDeleteAnswers instanceof Function) {
          _onDeleteAnswers = onDeleteAnswers;
          return true;
        }
        return false;
      },
      /**
       * Set onVoteupQuestion callback.
       * @method SetOnVoteupQuestionCB
       * @param {Function} onVoteupQuestion
       * @return {Boolean} true or false
       */
      SetOnVoteupQuestionCB: function (onVoteupQuestion) {
        if (
          _addon &&
          onVoteupQuestion &&
          onVoteupQuestion instanceof Function
        ) {
          _onVoteupQuestion = onVoteupQuestion;
          return true;
        }
        return false;
      },
      /**
       * Set onRevokeVoteupQuestion callback.
       * @method SetOnRevokeVoteupQuestionCB
       * @param {Function} onRevokeVoteupQuestion
       * @return {Boolean} true or false
       */
      SetOnRevokeVoteupQuestionCB: function (onRevokeVoteupQuestion) {
        if (
          _addon &&
          onRevokeVoteupQuestion &&
          onRevokeVoteupQuestion instanceof Function
        ) {
          _onRevokeVoteupQuestion = onRevokeVoteupQuestion;
          return true;
        }
        return false;
      },
      /**
       * Gets a certain question.
       * @method GetQuestion
       * @param {String} questionID Specify the question id
       * @return {Object} If the function succeeds, the return value is a question item object with the following properties:
       *   - timeStamp: The timestamp of the question
       *   - upvoteNum: The number of the up_voters of the question
       *   - text: The text of the question
       *   - senderName: The sender's name of the question
       *   - questionID: The question id
       *   - isAnonymous: Whether the question is anonymous
       *   - isMarkedAsAnswered: Whether the question is marked as answered
       *   - isMarkedAsDismissed: Whether the question is marked as dismissed
       *   - isSenderMyself: Whether the question's sender is the user himself
       *   - isMySelfUpvoted: Whether the user himself is an up_voter of the question
       *   - hasLiveAnswers: Whether the question has live answers
       *   - hasTextAnswers: Whether the question has text answers
       *   - amILiveAnswering: Whether the user himself is answering the question live
       *   - liveAnswerName: All the users' names who answers the question live
       *   - isLiveAnswering: Whether the question is being answered live
       *   - answerList: The list of all the answers to the question
       */
      GetQuestion: function (opts) {
        if (_addon) {
          var clientOpts = opts || {};
          var questionID = clientOpts.questionID;
          if (!questionID) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
          try {
            let QuestionIDParams = new messages.QuestionIDParams();
            QuestionIDParams.setQid(questionID);
            let bytes = QuestionIDParams.serializeBinary();
            let questionList = _addon.GetQuestion(bytes),
              questionObj = {};
            if (questionList) {
              questionObj = questionList[0];
              let answerList = questionList[1];
              questionObj.answerList = answerList;
            }
            return questionObj;
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
      },
      /**
       * Gets a certain answer.
       * @method GetAnswer
       * @param {String} answerID Specify the answer id
       * @return {Object} If the function succeeds, the return value is an answer item object with the following properties:
       *   - timeStamp: The timestamp of the answer
       *   - text: The text of the answer
       *   - senderName: The sender's name of the answer
       *   - questionID: The related question's id of the answer
       *   - answerID: The answer id
       *   - isPrivate: Whether the answer is private
       *   - isLiveAnswer: Whether the answer is live
       *   - isSenderMyself: Whether the answer's sender is the user himself
       */
      GetAnswer: function (opts) {
        if (_addon) {
          var clientOpts = opts || {};
          if (!clientOpts) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
          try {
            let AnswerIDParams = new messages.AnswerIDParams();
            AnswerIDParams.setAnswerid(clientOpts);
            let bytes = AnswerIDParams.serializeBinary();
            let answerList = _addon.GetAnswer(bytes),
              answerObj = {};
            if (answerList) {
              answerObj = answerList[0];
            }
            return answerObj;
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
      },
      /**
       * The host answers the question publicly.
       * @method AnswerQuestionPublicWithQuestionID
       * @param {String} questionID Specify the question id
       * @param {String} questionContent Specify the content of the answer
       * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
       * @note The answer will be cut off if it is over long.
       */
      AnswerQuestionPublicWithQuestionID: function (opts) {
        if (_addon) {
          var clientOpts = opts || {};
          var questionID = clientOpts.questionID;
          var content = clientOpts.questionContent;
          if (!questionID || !content) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
          try {
            let AnswerQuestionParams = new messages.AnswerQuestionParams();
            AnswerQuestionParams.setQid(questionID);
            AnswerQuestionParams.setContent(content);
            let bytes = AnswerQuestionParams.serializeBinary();
            return _addon.AnswerQuestionPublicWithQuestionID(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
      },
      /**
       * The host answers the question to the question sender privately.
       * @method AnswerQuestionPrivateWithQuestionID
       * @param {String} questionID Specify the question id
       * @param {String} questionContent Specify the content of the answer
       * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
       * @note The answer will be cut off if it is over long.
       */
      AnswerQuestionPrivateWithQuestionID: function (opts) {
        if (_addon) {
          var clientOpts = opts || {};
          var questionID = clientOpts.questionID;
          var content = clientOpts.questionContent;
          if (!questionID || !content) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
          try {
            let AnswerQuestionParams = new messages.AnswerQuestionParams();
            AnswerQuestionParams.setQid(questionID);
            AnswerQuestionParams.setContent(content);
            let bytes = AnswerQuestionParams.serializeBinary();
            return _addon.AnswerQuestionPrivateWithQuestionID(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
      },
      /**
       * Gets the list of all the questions.
       * @method GetAllQuestionList
       * @return {Array} If the function succeeds, the return value is a list of question item objects, each with the following properties:
       *   - timeStamp: The timestamp of the question
       *   - upvoteNum: The number of the up_voters of the question
       *   - text: The text of the question
       *   - senderName: The sender's name of the question
       *   - questionID: The question id
       *   - isAnonymous: Whether the question is anonymous
       *   - isMarkedAsAnswered: Whether the question is marked as answered
       *   - isMarkedAsDismissed: Whether the question is marked as dismissed
       *   - isSenderMyself: Whether the question's sender is the user himself
       *   - isMySelfUpvoted: Whether the user himself is an up_voter of the question
       *   - hasLiveAnswers: Whether the question has live answers
       *   - hasTextAnswers: Whether the question has text answers
       *   - amILiveAnswering: Whether the user himself is answering the question live
       *   - liveAnswerName: All the users' names who answers the question live
       *   - isLiveAnswering: Whether the question is being answered live
       *   - answerList: The list of all the answers to the question
       */
      GetAllQuestionList: function () {
        if (_addon) {
          try {
            let questionList = _addon.GetAllQuestionList();
            if (questionList) {
              return questionList.map(([question, answerList], index) => {
                return { ...question, answerList };
              });
            }
            return [];
          } catch (error) {
            return ZoomSDKError.SDKERR_UNINITIALIZE;
          }
        }
      },
      /**
       * Set the question can be answered live.
       * @method StartLiving
       * @param {String} questionID Specify the question id
       * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
       */
      StartLiving: function (opts) {
        if (_addon) {
          var clientOpts = opts || {};
          var questionID = clientOpts.questionID;
          if (!questionID) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
          try {
            let QuestionIDParams = new messages.QuestionIDParams();
            QuestionIDParams.setQid(questionID);
            let bytes = QuestionIDParams.serializeBinary();
            return _addon.StartLiving(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * Set the question can not be answered live.
       * @method EndLiving
       * @param {String} questionID Specify the question id
       * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
       */
      EndLiving: function (opts) {
        if (_addon) {
          var clientOpts = opts || {};
          var questionID = clientOpts.questionID;
          if (!questionID) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
          try {
            let QuestionIDParams = new messages.QuestionIDParams();
            QuestionIDParams.setQid(questionID);
            let bytes = QuestionIDParams.serializeBinary();
            return _addon.EndLiving(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * The host dismisses the question.
       * @method DismissQuestionWithQuestionID
       * @param {String} questionID Specify the question id
       * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
       */
      DismissQuestionWithQuestionID: function (opts) {
        if (_addon) {
          var clientOpts = opts || {};
          var questionID = clientOpts.questionID;
          if (!questionID) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
          try {
            let QuestionIDParams = new messages.QuestionIDParams();
            QuestionIDParams.setQid(questionID);
            let bytes = QuestionIDParams.serializeBinary();
            return _addon.DismissQuestionWithQuestionID(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * The host deletes the question.
       * @method DeleteQuestion
       * @param {String} questionID Specify the question id
       * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
       */
      DeleteQuestion: function (opts) {
        if (_addon) {
          var clientOpts = opts || {};
          var questionID = clientOpts.questionID;
          if (!questionID) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
          try {
            let QuestionIDParams = new messages.QuestionIDParams();
            QuestionIDParams.setQid(questionID);
            let bytes = QuestionIDParams.serializeBinary();
            return _addon.DeleteQuestion(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * The host deletes the answerID.
       * @method DeleteAnswer
       * @param {String} answerID Specify the answer id
       * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
       */
      DeleteAnswer: function (opts) {
        if (_addon) {
          var clientOpts = opts || {};
          var answerID = clientOpts.answerID;
          if (!answerID) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
          try {
            let AnswerIDParams = new messages.AnswerIDParams();
            AnswerIDParams.setAnswerid(answerID);
            let bytes = AnswerIDParams.serializeBinary();
            return _addon.DeleteAnswer(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * The host reopens the question.
       * @method ReopenQuestionWithQuestionID
       * @param {String} questionID Specify the question id
       * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
       */
      ReopenQuestionWithQuestionID: function (opts) {
        if (_addon) {
          var clientOpts = opts || {};
          var questionID = clientOpts.questionID;
          if (!questionID) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
          try {
            let QuestionIDParams = new messages.QuestionIDParams();
            QuestionIDParams.setQid(questionID);
            let bytes = QuestionIDParams.serializeBinary();
            return _addon.ReopenQuestionWithQuestionID(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * Vote up or revoke voting up the question.
       * @method VoteupQuestionWithQuestionID
       * @param {String} questionID Specify the question id
       * @param {Boolean} enabled true indicates to vote up, false indicates to revoke voting up.
       * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
       */
      VoteupQuestionWithQuestionID: function (opts) {
        if (_addon) {
          var clientOpts = opts || {};
          var questionID = clientOpts.questionID;
          var enableQuestion = clientOpts.enabled;
          if (!questionID) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
          if (enableQuestion == null ) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
          try {
            let VoteQuestionParams = new messages.VoteQuestionParams();
            VoteQuestionParams.setQid(questionID);
            VoteQuestionParams.setEnabled(enableQuestion);
            let bytes = VoteQuestionParams.serializeBinary();
            return _addon.VoteupQuestionWithQuestionID(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
      }
    };
  }

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
  ZoomMeetingQA: ZoomMeetingQA
};
