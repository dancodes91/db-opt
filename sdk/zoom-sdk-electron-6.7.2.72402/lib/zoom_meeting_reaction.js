let { ZoomSDKError } = require("./settings.js");
const messages = require("./electron_sdk_pb.js");

var ZoomMeetingReaction = (function () {
  var instance;
  /**
   * Zoom Meeting Emoji Reaction
   * @module zoom_meeting_reaction
   * @param {Function} onEmojiReactionReceived Emoji reaction callback. This function is used to inform the user once received the reaction sent by others or user himself.
   * @param {Function} onEmojiReactionReceivedInWebinar Emoji reaction callback. This callback notifies the user when an emoji is received in the webinar.
   * @return {ZoomMeetingReaction}
   */
  function init(opts) {
    let clientOpts = opts || {};
    // Private methods and variables
    let _addon = clientOpts.addon.GetMeetingReactionCtrl() || null;
    let _onEmojiReactionReceived = clientOpts.onEmojiReactionReceived || null;
    let _onEmojiReactionReceivedInWebinar = clientOpts.onEmojiReactionReceivedInWebinar || null;

    /**
     * Emoji reaction callback. This function is used to inform the user once received the reaction sent by others or user himself.
     * @event onEmojiReactionReceived
     * @param {Number} sender_id The user id of the reaction sender
     * @param {Number} type The type of the received reaction
     */
    function onEmojiReactionReceived(sender_id, type) {
      if (_onEmojiReactionReceived) {
        _onEmojiReactionReceived(sender_id, type);
      }
    }

    /**
     * Emoji reaction callback. This callback notifies the user when an emoji is received in the webinar.
     * @event onEmojiReactionReceivedInWebinar
     * @param {Number} type The type of the received reaction
     */
    function onEmojiReactionReceivedInWebinar(type) {
      if (_onEmojiReactionReceivedInWebinar) {
        _onEmojiReactionReceivedInWebinar(type);
      }
    }

    if (_addon) {
      _addon.SetOnEmojiReactionReceivedCB(onEmojiReactionReceived);
      _addon.SetOnEmojiReactionReceivedInWebinarCB(onEmojiReactionReceivedInWebinar);
    }

    return {
      // Public methods and variables
      /**
       * Set onEmojiReactionReceived callback.
       * @method SetOnEmojiReactionReceivedCB
       * @param {Function} onEmojiReactionReceived
       * @return {Boolean} true or false
       */
      SetOnEmojiReactionReceivedCB: function (onEmojiReactionReceived) {
        if (_addon && onEmojiReactionReceived && onEmojiReactionReceived instanceof Function) {
          _onEmojiReactionReceived = onEmojiReactionReceived;
          return true;
        }
        return false;
      },
      /**
       * Set onEmojiReactionReceivedInWebinar callback.
       * @method SetOnEmojiReactionReceivedInWebinarCB
       * @param {Function} onEmojiReactionReceivedInWebinar
       * @return {Boolean} true or false
       */
      SetOnEmojiReactionReceivedInWebinarCB: function (onEmojiReactionReceivedInWebinar) {
        if (_addon && onEmojiReactionReceivedInWebinar && onEmojiReactionReceivedInWebinar instanceof Function) {
          _onEmojiReactionReceivedInWebinar = onEmojiReactionReceivedInWebinar;
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
  ZoomMeetingReaction: ZoomMeetingReaction,
};
