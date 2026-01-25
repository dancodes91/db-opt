let { ZoomSDKError } = require("./settings.js");
const messages = require("./electron_sdk_pb.js");

var ZoomMeetingCloseCaption = (function () {
    var instance;
  /**
   * Zoom Close Captions
   * @module zoom_meeting_close_caption
   * @param {Function} onLiveTranscriptionMsgInfoReceived Callback event used to inform the user once a live transcription message is received.
   * @param {Function} onOriginalLanguageMsgReceived Callback event used to inform the user once the original language message is received.
   * @return {ZoomMeetingCloseCaption}
   */
  function init(opts) {
    let clientOpts = opts || {};
    // Private methods and variables
    let _addon = clientOpts.addon.GetMeetingCloseCaptionCtrl() || null;

    let _onLiveTranscriptionMsgInfoReceived = clientOpts.onLiveTranscriptionMsgInfoReceived || null;
    let _onOriginalLanguageMsgReceived = clientOpts.onOriginalLanguageMsgReceived || null;

    /**
     * Live transcription message received callback.
     * @event onLiveTranscriptionMsgInfoReceived
     * @param {Object} messageInfo The live transcription message with the following properties:
     *   - messageID: The message ID of the current message.
     *   - speakerID: The user object's speaker ID.
     *   - speakerName: The user object's speaker name.
     *   - messageContent: The current message's content.
     *   - timeStamp: The current message's timestamp.
     *   - messageType: The current message's type.
     */
    function onLiveTranscriptionMsgInfoReceived(messageInfo) {
      let meeting_close_caption = {
        messageID: messageInfo.messageID,
        speakerID: messageInfo.speakerID,
        speakerName: messageInfo.speakerName,
        messageContent: messageInfo.messageContent,
        timeStamp: messageInfo.timeStamp,
        messageType: messageInfo.messageType,
      }
      if (_onLiveTranscriptionMsgInfoReceived) {
        _onLiveTranscriptionMsgInfoReceived(meeting_close_caption);
      }
    }

    /**
     * Original language message received callback.
     * @event onOriginalLanguageMsgReceived
     * @param {Object} messageInfo The spoken language message with the following properties:
     *   - messageID: The message ID of the current message.
     *   - speakerID: The user object's speaker ID.
     *   - speakerName: The user object's speaker name.
     *   - messageContent: The current message's content.
     *   - timeStamp: The current message's timestamp.
     *   - messageType: The current message's type.
     */
    function onOriginalLanguageMsgReceived(messageInfo) {
        let meeting_close_caption = {
            messageID: messageInfo.messageID,
            speakerID: messageInfo.speakerID,
            speakerName: messageInfo.speakerName,
            messageContent: messageInfo.messageContent,
            timeStamp: messageInfo.timeStamp,
            messageType: messageInfo.messageType,
        }
        if (_onOriginalLanguageMsgReceived) {
            _onOriginalLanguageMsgReceived(meeting_close_caption);
        }
    }

    if (_addon) {
      _addon.SetOnLiveTranscriptionMsgInfoReceivedCB(onLiveTranscriptionMsgInfoReceived);
      _addon.SetOnOriginalLanguageMsgReceivedCB(onOriginalLanguageMsgReceived);
    }

    return {
      // Public methods and variables
      /**
       * Set onLiveTranscriptionMsgInfoReceived callback.
       * @method SetOnLiveTranscriptionMsgInfoReceivedCB
       * @param {Function} onLiveTranscriptionMsgInfoReceived
       * @return {Boolean} true or false
       */
      SetOnLiveTranscriptionMsgInfoReceivedCB: function (onLiveTranscriptionMsgInfoReceived) {
        if (_addon && onLiveTranscriptionMsgInfoReceived && onLiveTranscriptionMsgInfoReceived instanceof Function) {
          _onLiveTranscriptionMsgInfoReceived = onLiveTranscriptionMsgInfoReceived;
          return true;
        }
        return false;
      },
      /**
       * Set onOriginalLanguageMsgReceived callback.
       * @method SetOnOriginalLanguageMsgReceivedCB
       * @param {Function} onOriginalLanguageMsgReceived
       * @return {Boolean} true or false
       */
      SetOnOriginalLanguageMsgReceivedCB: function (onOriginalLanguageMsgReceived) {
        if (_addon && onOriginalLanguageMsgReceived && onOriginalLanguageMsgReceived instanceof Function) {
          _onOriginalLanguageMsgReceived = onOriginalLanguageMsgReceived;
          return true;
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
      return instance;
    },
  };
})();

module.exports = {
  ZoomMeetingCloseCaption: ZoomMeetingCloseCaption,
}