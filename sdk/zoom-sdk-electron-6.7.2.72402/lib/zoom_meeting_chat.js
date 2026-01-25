let { ZoomSDKError } = require('./settings.js');
const messages = require('./electron_sdk_pb.js');

var ZoomMeetingChat = (function () {
  var instance;
  /**
   * Zoom Meeting Chat
   * @module zoom_meeting_chat
   * @param {Function} onChatMsgNotification Callback event used to inform the user once received the message sent by others.
   * @param {Function} onChatStatusChangedNotification Callback event used to inform the user when the authority of chat changes in the meeting or webinar.
   * @param {Function} onChatMsgDeleteNotification Callback event used to inform the user host/myself the message be deleted.
   * @param {Function} onChatMessageEditNotification Chat message be edited callback.
   * @param {Function} onShareMeetingChatStatusChanged Callback event used to inform the user when share meeting chat status changed.
   * @param {Function} onFileSendStart Invoked when start send file.
   * @param {Function} onFileReceived Invoked when receiving a file from another user.
   * @param {Function} onFileTransferProgress Invoked when send or receive file status change.
   * @return {ZoomMeetingChat}
   */
  function init(opts) {
    let clientOpts = opts || {};
    // Private methods and variables
    let _addon = clientOpts.addon.GetMeetingChatCtrl() || null;
    let _onChatMsgNotification = clientOpts.onChatMsgNotification || null;
    let _onChatStatusChangedNotification = clientOpts.onChatStatusChangedNotification || null;
    let _onChatMsgDeleteNotification = clientOpts.onChatMsgDeleteNotification || null;
    let _onChatMessageEditNotification = clientOpts.onChatMessageEditNotification || null;
    let _onShareMeetingChatStatusChanged = clientOpts.onShareMeetingChatStatusChanged || null;
    let _onFileSendStart = clientOpts.onFileSendStart || null
    let _onFileReceived = clientOpts.onFileReceived || null
    let _onFileTransferProgress = clientOpts.onFileTransferProgress || null

    /**
      * Chat message callback. This function is used to inform the user once received the message sent by others.
      * @event onChatMsgNotification
      * @param {Object} chatMsg An object pointer to the chat message with the following properties:
      *   - messageID: The message ID of the current message.
      *   - senderUserId: The sender ID of the current message.
      *   - senderDisplayName: The sender screen name of the current message.
      *   - receiverUserId: The receiver ID of the current message.
      *   - receiverDisplayName: The receiver screen name of the current message.
      *   - content: The content of the current message.
      *   - timeStamp: The timestamps of the current message.
      *   - isChatToAll: Determine if the current message is sent to all.
      *   - isChatToAllPanelist: Determine if the current message is sent to all the panelists.
      *   - isChatToWaitingroom: Determine if the current message is sent to waiting room.
      *   - chatMessageType: The chat message type of the current message.
      *   - isComment: Determine if the current message is a reply to another message.
      *   - isThread: Determine if the current message is part of a message thread, and can be directly replied to.
      *   - segmentDetails: The chat message segment content and style detail of the current message.
      *   - threadID: The current message's thread ID.
      * @param {String} content The chat message in json format. This parameter is currently invalid, hereby only for reservations.
      */
    function onChatMsgNotification(chatMsg, content) {
      let meeting_chat_msg = {
        messageID: chatMsg.messageID,
        senderUserId: chatMsg.senderUserId,
        senderDisplayName: chatMsg.senderDisplayName,
        receiverUserId: chatMsg.receiverUserId,
        receiverDisplayName: chatMsg.receiverDisplayName,
        content: chatMsg.content,
        timeStamp: chatMsg.timeStamp,
        isChatToAll: chatMsg.isChatToAll,
        isChatToAllPanelist: chatMsg.isChatToAllPanelist,
        isChatToWaitingroom: chatMsg.isChatToWaitingroom,
        chatMessageType: chatMsg.chatMessageType,
        isComment: chatMsg.isComment,
        isThread: chatMsg.isThread,
        textStyleItemList: chatMsg.textStyleItemList,
        threadID: chatMsg.threadID
      }
      if (_onChatMsgNotification) {
        _onChatMsgNotification(meeting_chat_msg, content)
      }
    }

    /**
      * The authority of chat changes callback. This function is used to inform the user when the authority of chat changes in the meeting or webinar.
      * @event onChatStatusChangedNotification
      * @param {Object} status The chat status with the following properties:
      *   - normal_meeting_status: The authority to chat in the normal meeting object with properties:
      *     - can_chat: true indicates that the user owns the authority to send message to chat.
      *     - can_chat_to_all: true indicates that the user owns the authority to send message to all.
      *     - can_chat_to_individual: true indicates that the user owns the authority to send message to an individual attendee in the meeting.
      *     - is_only_can_chat_to_host: true indicates that the user owns the authority to send message only to the host.
      *   - webinar_attendee_status: The authority to chat for the normal attendee in the webinar object with properties:
      *     - can_chat: true indicates that the attendee can send message to chat.
      *     - can_chat_to_all_panellist_and_attendee: true indicates that the user owns the authority to send message to all the panelists and attendees.
      *     - can_chat_to_all_panellist: true indicates that the user owns the authority to send message to all the panelists.
      *   - webinar_other_status: The authority to chat for the host, co-host and panelist to chat in webinar object with properties:
      *     - can_chat_to_all_panellist: true indicates that the user owns the authority to send message to all the panelists.
      *     - can_chat_to_all_panellist_and_attendee: true indicates that the user owns the authority to send message to all.
      *     - can_chat_to_individual: true indicates that the user owns the authority to send message to individual attendee.
      *   - is_chat_off: true indicates that it is disabled to chat in the specified meeting.
      *   - is_webinar_attendee: true indicates that the owner of the current message is the attendee of the webinar.
      *   - is_webinar_meeting: true indicates that the current meeting is webinar.
      */
    function onChatStatusChangedNotification(status) {
      if (_onChatStatusChangedNotification) {
        _onChatStatusChangedNotification(status)
      }
    }

    /**
      * Chat message be deleted callback. This function is used to inform the user host/myself the message be deleted.
      * @event onChatMsgDeleteNotification
      * @param {String} msgID is the id of the deleted message.
      * @param {Number} deleteBy Indicates by whom the message was deleted.
      */
    function onChatMsgDeleteNotification(msgID, deleteBy) {
      if (_onChatMsgDeleteNotification) {
        _onChatMsgDeleteNotification(msgID, deleteBy)
      }
    }

    /**
      * Chat message be edited callback.
      * @event onChatMessageEditNotification
      * @param {Object} chatMsg The chat message with the following properties:
      *   - messageID: The message ID of the current message.
      *   - senderUserId: The sender ID of the current message.
      *   - senderDisplayName: The sender screen name of the current message.
      *   - receiverUserId: The receiver ID of the current message.
      *   - receiverDisplayName: The receiver screen name of the current message.
      *   - content: The content of the current message.
      *   - timeStamp: The timestamps of the current message.
      *   - isChatToAll: Determine if the current message is sent to all.
      *   - isChatToAllPanelist: Determine if the current message is sent to all the panelists.
      *   - isChatToWaitingroom: Determine if the current message is sent to waiting room.
      *   - chatMessageType: The chat message type of the current message.
      *   - isComment: Determine if the current message is a reply to another message.
      *   - isThread: Determine if the current message is part of a message thread, and can be directly replied to.
      *   - segmentDetails: The chat message segment content and style detail of the current message.
      *   - threadID: The current message's thread ID.
      */
    function onChatMessageEditNotification(chatMsg) {
      if (_onChatMessageEditNotification) {
        _onChatMessageEditNotification(chatMsg)
      }
    }
  
    /**
      * @event onShareMeetingChatStatusChanged
      * @param {Boolean} isStart
      */
    function onShareMeetingChatStatusChanged(isStart) {
      if (_onShareMeetingChatStatusChanged) {
        _onShareMeetingChatStatusChanged(isStart)
      }
    }

    /**
      * Invoked when start send file.
      * @event onFileSendStart
      * @param {Object} senderInfo The class to send file object with the following properties:
      *   - messageID: The message identify of transfer file.
      *   - trans_status: The status of the file transfer.
      *   - time_stamp: The time stamp of the file.
      *   - is_send_to_all: Is the file send to all user in meeting.
      *   - file_size: The bytes of transfer file size.
      *   - file_name: The file name of transfer file.
      *   - timeStamp: The time stamp of the file.
      *   - complete_percentage: The percentage of the file transfer completed.
      *   - complete_size: The size of the file transferred so far in bytes.
      *   - bit_per_second: The speed of the file transfer in bits per second.
      */
    function onFileSendStart(senderInfo) {
      let sender_info_obj = {
        messageID: senderInfo.messageID,
        trans_status: senderInfo.trans_status,
        time_stamp: senderInfo.time_stamp,
        is_send_to_all: senderInfo.is_send_to_all,
        file_size: senderInfo.file_size,
        file_name: senderInfo.file_name,
        timeStamp: senderInfo.timeStamp,
        complete_percentage: senderInfo.complete_percentage,
        complete_size: senderInfo.complete_size,
        bit_per_second: senderInfo.bit_per_second
      }
      if (_onFileSendStart) {
        _onFileSendStart(sender_info_obj)
      }
    }

    /**
      * Invoked when receiving a file from another user.
      * @event onFileReceived
      * @param {Object} receiverInfo The class to receive the file object with the following properties:
      *   - messageID: The message identify of transfer file.
      *   - trans_status: The status of the file transfer.
      *   - time_stamp: The time stamp of the file.
      *   - is_send_to_all: Is the file send to all user in meeting.
      *   - file_size: The bytes of transfer file size.
      *   - file_name: The file name of transfer file.
      *   - timeStamp: The time stamp of the file.
      *   - complete_percentage: The percentage of the file transfer completed.
      *   - complete_size: The size of the file transferred so far in bytes.
      *   - bit_per_second: The speed of the file transfer in bits per second.
      */
    function onFileReceived(receiverInfo) {
      let sender_info_obj = {
        messageID: receiverInfo.messageID,
        trans_status: receiverInfo.trans_status,
        time_stamp: receiverInfo.time_stamp,
        is_send_to_all: receiverInfo.is_send_to_all,
        file_size: receiverInfo.file_size,
        file_name: receiverInfo.file_name,
        timeStamp: receiverInfo.timeStamp,
        complete_percentage: receiverInfo.complete_percentage,
        complete_size: receiverInfo.complete_size,
        bit_per_second: receiverInfo.bit_per_second
      }
      if (_onFileReceived) {
        _onFileReceived(sender_info_obj)
      }
    }

    /**
      * Invoked when send or receive file status change.
      * @event onFileTransferProgress
      * @param {Object} transferInfo Transfer information with the following properties:
      *   - messageID: The message identify of transfer file.
      *   - trans_status: The status of the file transfer.
      *   - time_stamp: The time stamp of the file.
      *   - is_send_to_all: Is the file send to all user in meeting.
      *   - file_size: The bytes of transfer file size.
      *   - file_name: The file name of transfer file.
      *   - timeStamp: The time stamp of the file.
      *   - complete_percentage: The percentage of the file transfer completed.
      *   - complete_size: The size of the file transferred so far in bytes.
      *   - bit_per_second: The speed of the file transfer in bits per second.
      */
    function onFileTransferProgress(transferInfo) {
      let sender_info_obj = {
        messageID: transferInfo.messageID,
        trans_status: transferInfo.trans_status,
        time_stamp: transferInfo.time_stamp,
        is_send_to_all: transferInfo.is_send_to_all,
        file_size: transferInfo.file_size,
        file_name: transferInfo.file_name,
        timeStamp: transferInfo.timeStamp,
        complete_percentage: transferInfo.complete_percentage,
        complete_size: transferInfo.complete_size,
        bit_per_second: transferInfo.bit_per_second
      }
      if (_onFileTransferProgress) {
        _onFileTransferProgress(sender_info_obj)
      }
    }

    if (_addon) {
      _addon.SetOnChatMsgNotificationCB(onChatMsgNotification);
      _addon.SetOnChatStatusChangedNotificationCB(onChatStatusChangedNotification);
      _addon.SetOnChatMsgDeleteNotificationCB(onChatMsgDeleteNotification);
      _addon.SetOnChatMessageEditNotificationCB(onChatMessageEditNotification);
      _addon.SetOnShareMeetingChatStatusChangedCB(onShareMeetingChatStatusChanged);
      _addon.SetOnFileSendStartCB(onFileSendStart);
      _addon.SetOnFileReceivedCB(onFileReceived);
      _addon.SetOnFileTransferProgressCB(onFileTransferProgress);
    }

    return {
      // Public methods and variables
      /**
      * Set onChatMsgNotification callback.
      * @method SetOnChatMsgNotificationCB
      * @param {Function} onChatMsgNotification
      * @return {Boolean} true or false
      */
      SetOnChatMsgNotificationCB: function (onChatMsgNotification) {
        if (_addon && onChatMsgNotification && onChatMsgNotification instanceof Function) {
          _onChatMsgNotification = onChatMsgNotification;
          return true;
        }
        return false;
      },
      /**
      * Set onChatStatusChangedNotification callback.
      * @method SetOnChatStatusChangedNotificationCB
      * @param {Function} onChatStatusChangedNotification
      * @return {Boolean} true or false
      */
      SetOnChatStatusChangedNotificationCB: function (onChatStatusChangedNotification) {
        if (_addon && onChatStatusChangedNotification && onChatStatusChangedNotification instanceof Function) {
          _onChatStatusChangedNotification = onChatStatusChangedNotification;
          return true;
        }
        return false;
      },
      /**
      * Set onChatMsgDeleteNotification callback.
      * @method SetOnChatMsgDeleteNotificationCB
      * @param {Function} onChatMsgDeleteNotification
      * @return {Boolean} true or false
      */
      SetOnChatMsgDeleteNotificationCB: function (onChatMsgDeleteNotification) {
        if (_addon && onChatMsgDeleteNotification && onChatMsgDeleteNotification instanceof Function) {
          _onChatMsgDeleteNotification = onChatMsgDeleteNotification;
          return true;
        }
        return false;
      },
      /**
      * Set onChatMessageEditNotification callback.
      * @method SetOnChatMessageEditNotificationCB
      * @param {Function} onChatMessageEditNotification
      * @return {Boolean} true or false
      */
      SetOnChatMessageEditNotificationCB: function (onChatMessageEditNotification) {
        if (_addon && onChatMessageEditNotification && onChatMessageEditNotification instanceof Function) {
          _onChatMessageEditNotification = onChatMessageEditNotification;
          return true;
        }
        return false;
      },
      /**
      * Set onShareMeetingChatStatusChanged callback.
      * @method SetOnShareMeetingChatStatusChangedCB
      * @param {Function} onShareMeetingChatStatusChanged
      * @return {Boolean} true or false
      */
      SetOnShareMeetingChatStatusChangedCB: function (onShareMeetingChatStatusChanged) {
        if (_addon && onShareMeetingChatStatusChanged && onShareMeetingChatStatusChanged instanceof Function) {
          _onShareMeetingChatStatusChanged = onShareMeetingChatStatusChanged;
          return true;
        }
        return false;
      },
      /**
      * Set onFileSendStart callback.
      * @method SetOnFileSendStartCB
      * @param {Function} onFileSendStart
      * @return {Boolean} true or false
      */
      SetOnFileSendStartCB: function (onFileSendStart) {
        if (_addon && onFileSendStart && onFileSendStart instanceof Function) {
          _onFileSendStart = onFileSendStart;
          return true;
        }
        return false;
      },
      /**
      * Set onFileReceived callback.
      * @method SetOnFileReceivedCB
      * @param {Function} onFileReceived
      * @return {Boolean} true or false
      */
      SetOnFileReceivedCB: function (onFileReceived) {
        if (_addon && onFileReceived && onFileReceived instanceof Function) {
          _onFileReceived= onFileReceived;
          return true;
        }
        return false;
      },
      /**
      * Set onFileTransferProgress callback.
      * @method SetOnFileTransferProgressCB
      * @param {Function} onFileTransferProgress
      * @return {Boolean} true or false
      */
      SetOnFileTransferProgressCB: function (onFileTransferProgress) {
        if (_addon && onFileTransferProgress && onFileTransferProgress instanceof Function) {
          _onFileTransferProgress= onFileTransferProgress;
          return true;
        }
        return false;
      },
      /**
      * Gets the authority status to send current message.
      * @method GetChatStatus
      * @return {Object} If the function succeeds, the return value is a pointer to the structure of ChatStatus. Otherwise, the return value is null. The object has the following properties:
      *   - normal_meeting_status: The authority to chat in the normal meeting object with properties:
      *     - can_chat: true indicates that the user owns the authority to send message to chat.
      *     - can_chat_to_all: true indicates that the user owns the authority to send message to all.
      *     - can_chat_to_individual: true indicates that the user owns the authority to send message to an individual attendee in the meeting.
      *     - is_only_can_chat_to_host: true indicates that the user owns the authority to send message only to the host.
      *   - webinar_attendee_status: The authority to chat for the normal attendee in the webinar object with properties:
      *     - can_chat: true indicates that the attendee can send message to chat.
      *     - can_chat_to_all_panellist_and_attendee: true indicates that the user owns the authority to send message to all the panelists and attendees.
      *     - can_chat_to_all_panellist: true indicates that the user owns the authority to send message to all the panelists.
      *   - webinar_other_status: The authority to chat for the host, co-host and panelist to chat in webinar object with properties:
      *     - can_chat_to_all_panellist: true indicates that the user owns the authority to send message to all the panelists.
      *     - can_chat_to_all_panellist_and_attendee: true indicates that the user owns the authority to send message to all.
      *     - can_chat_to_individual: true indicates that the user owns the authority to send message to individual attendee.
      *   - is_chat_off: true indicates that it is disabled to chat in the specified meeting.
      *   - is_webinar_attendee: true indicates that the owner of the current message is the attendee of the webinar.
      *   - is_webinar_meeting: true indicates that the current meeting is webinar.
      */
      GetChatStatus: function () {
        if (_addon) {
          return _addon.GetChatStatus();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Sets the chat privilege of participants.
      * @method SetParticipantsChatPrivilege
      * @param {Number} privilege The chat privilege of participants
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      */
      SetParticipantsChatPrivilege: function (opts) {
        if (_addon) {
          var clientOpts = opts || {};
          var privilege = clientOpts.privilege;
          try {
            let SetParticipantsChatPrivilegeParams = new messages.SetParticipantsChatPrivilegeParams();
            SetParticipantsChatPrivilegeParams.setPrivilege(privilege);
            let bytes = SetParticipantsChatPrivilegeParams.serializeBinary();
            return _addon.SetParticipantsChatPrivilege(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Determines whether the legal notice for chat is available.
      * @method IsMeetingChatLegalNoticeAvailable
      * @return {Boolean} true if the legal notice for chat is available. Otherwise, false.
      */
      IsMeetingChatLegalNoticeAvailable: function () {
        if (_addon) {
          return _addon.IsMeetingChatLegalNoticeAvailable();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Gets the chat legal notices prompt.
      * @method getChatLegalNoticesPrompt
      * @return {String} The chat legal notices prompt.
      */
      GetChatLegalNoticesPrompt: function () {
        if (_addon) {
          return _addon.getChatLegalNoticesPrompt();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Gets the chat legal notices explained.
      * @method getChatLegalNoticesExplained
      * @return {String} The chat legal notices explained.
      */
      GetChatLegalNoticesExplained: function () {
        if (_addon) {
          return _addon.getChatLegalNoticesExplained();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Determines whether the legal notice for sharing in meeting chat is available.
      * @method IsShareMeetingChatLegalNoticeAvailable
      * @return {Boolean} true if the legal notice for sharing in meeting chat is available. Otherwise, false.
      */
      IsShareMeetingChatLegalNoticeAvailable: function () {
        if (_addon) {
          return _addon.IsShareMeetingChatLegalNoticeAvailable();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Gets the sharing in meeting chat started legal notices content.
      * @method GetShareMeetingChatStartedLegalNoticeContent
      * @return {String}
      */
      GetShareMeetingChatStartedLegalNoticeContent: function () {
        if (_addon) {
          return _addon.GetShareMeetingChatStartedLegalNoticeContent();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Gets the sharing in meeting chat stopped legal notices content.
      * @method GetShareMeetingChatStoppedLegalNoticeContent
      * @return {String}
      */
      GetShareMeetingChatStoppedLegalNoticeContent: function () {
        if (_addon) {
          return _addon.GetShareMeetingChatStoppedLegalNoticeContent();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Determines whether the message can be deleted.
      * @method IsChatMessageCanBeDeleted
      * @param {String} msgID is the message id.
      * @return {Boolean} true if the message can be deleted. Otherwise, false.
      */
      IsChatMessageCanBeDeleted: function (opts) {
        if (_addon) {
          var clientOpts = opts || {};
          var msgID = clientOpts.msgID;
          if (!msgID) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
          try {
            let ChatMessageIDParams = new messages.ChatMessageIDParams();
            ChatMessageIDParams.setMsgid(msgID);
            let bytes = ChatMessageIDParams.serializeBinary();
            return _addon.IsChatMessageCanBeDeleted(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Delete chat message by message id.
      * @method DeleteChatMessage
      * @param {String} msgID is the message id.
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      */
      DeleteChatMessage: function (opts) {
        if (_addon) {
          var clientOpts = opts || {};
          var msgID = clientOpts.msgID;
          if (!msgID) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
          try {
            let ChatMessageIDParams = new messages.ChatMessageIDParams();
            ChatMessageIDParams.setMsgid(msgID);
            let bytes = ChatMessageIDParams.serializeBinary();
            return _addon.DeleteChatMessage(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Gets all chat message id.
      * @method GetAllChatMessageID
      */
      GetAllChatMessageID: function () {
        if (_addon) {
          return _addon.GetAllChatMessageID();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Gets chat message by message ID.
      * @method GetChatMessageById
      * @param {String} msgID is the message id.
      * @return {Object} If the function succeeds, the return value is a chat message object with the following properties:
      *   - messageID: The message ID of the current message.
      *   - senderUserId: The sender ID of the current message.
      *   - senderDisplayName: The sender screen name of the current message.
      *   - receiverUserId: The receiver ID of the current message.
      *   - receiverDisplayName: The receiver screen name of the current message.
      *   - content: The content of the current message.
      *   - timeStamp: The timestamps of the current message.
      *   - isChatToAll: Determine if the current message is sent to all.
      *   - isChatToAllPanelist: Determine if the current message is sent to all the panelists.
      *   - isChatToWaitingroom: Determine if the current message is sent to waiting room.
      *   - chatMessageType: The chat message type of the current message.
      *   - isComment: Determine if the current message is a reply to another message.
      *   - isThread: Determine if the current message is part of a message thread, and can be directly replied to.
      *   - segmentDetails: The chat message segment content and style detail of the current message.
      *   - threadID: The current message's thread ID.
      */
      GetChatMessageById: function (opts) {
        if (_addon) {
          var clientOpts = opts || {};
          var msgID = clientOpts.msgID;
          if (!msgID) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
          try {
            let ChatMessageIDParams = new messages.ChatMessageIDParams();
            ChatMessageIDParams.setMsgid(msgID);
            let bytes = ChatMessageIDParams.serializeBinary();
            return _addon.GetChatMessageById(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Set the chat message builder which can help construct the message entity.
      * @method SetChatMessageBuilder
      * @param {String} content chat message content.
      * @param {Number} receiver who will receive the chat message.
      * @param {String} threadId the ID of the thread where the message will be posted.
      * @param {Number} type the chat message type.
      * @param {Number} positionStart the segment start position.
      * @param {Number} positionEnd the segment end position.
      * @param {Boolean} bClearStyles clear all set styles. not support for MAC platform
      * @param {Boolean} bClear clear all set properties. not support for MAC platform
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      */
      SetChatMessageBuilder: function (opts) {
        if (_addon) {
          var clientOpts = opts || {};
          var content = clientOpts.content;
          var receiver = clientOpts.receiver;
          var threadId = clientOpts.threadId;
          var type = clientOpts.type;
          var positionStart = clientOpts.positionStart;
          var positionEnd = clientOpts.positionEnd;
          var bClearStyles = (clientOpts.bClearStyles === undefined) ? false : clientOpts.bClearStyles;
          var bClear = (clientOpts.bClear === undefined) ? false : clientOpts.bClear;
          try {
            let SetChatMessageBuilderParams = new messages.SetChatMessageBuilderParams();
            SetChatMessageBuilderParams.setContent(content);
            SetChatMessageBuilderParams.setReceiver(receiver);
            SetChatMessageBuilderParams.setType(type);
            if (threadId) {
              SetChatMessageBuilderParams.setThreadid(threadId);
            }
            if (positionStart != undefined) {
              SetChatMessageBuilderParams.setPositionstart(positionStart);
            }
            if (positionEnd != undefined) {
              SetChatMessageBuilderParams.setPositionend(positionEnd);
            }
            SetChatMessageBuilderParams.setBclearstyles(bClearStyles);
            SetChatMessageBuilderParams.setBclear(bClear);
            let bytes = SetChatMessageBuilderParams.serializeBinary();
            return _addon.SetChatMessageBuilder(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Send a chat message.
      * @method SendLastBuildChatMsgTo
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      */
      SendLastBuildChatMsgTo: function () {
        if (_addon) {
          return _addon.SendLastBuildChatMsgTo();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Determines whether file transfer is enabled.
      * @method IsFileTransferEnabled
      * @return {Boolean} true if file transfer is enabled. Otherwise, false.
      */
      IsFileTransferEnabled: function () {
        if (_addon) {
          return _addon.IsFileTransferEnabled();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Send file to specify user in current session.
      * @method TransferFile
      * @param {String} filePath The absolute path of the file.
      * @param {Number} userid Send the file to this user.
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      * @note This interface is related to chat privilege, see {@link SDKChatPrivilege} enum.
      */
      TransferFile: function (opts) {
        if (_addon) {
          var clientOpts = opts || {};
          var filePath = clientOpts.filePath;
          var userid = clientOpts.userid;
          if (filePath == undefined || userid == undefined) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
          try {
            let TransferFileParams = new messages.TransferFileParams();
            TransferFileParams.setFilepath(filePath);
            TransferFileParams.setUserid(userid);
            let bytes = TransferFileParams.serializeBinary();
            return _addon.TransferFile(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Send file to all users in current session.
      * @method TransferFileToAll
      * @param {String} filePath The absolute path of the file.
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      * @note This interface is related to chat privilege, see {@link SDKChatPrivilege} enum.
      */
      TransferFileToAll: function (opts) {
        if (_addon) {
          var clientOpts = opts || {};
          var filePath = clientOpts.filePath;
          if (filePath == undefined) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
          try {
            let TransferFileParams = new messages.TransferFileParams();
            TransferFileParams.setFilepath(filePath);
            let bytes = TransferFileParams.serializeBinary();
            return _addon.TransferFileToAll(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Gets the list of allowed file types in transfer.
      * @method GetTransferFileTypeAllowList
      * @return {String} The value of allowed file types in transfer, comma-separated if there are multiple values. Exe files are by default forbidden from being transferred.
      */
      GetTransferFileTypeAllowList: function () {
        if (_addon) {
          return _addon.GetTransferFileTypeAllowList();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Gets the maximum size for file transfer.
      * @method GetMaxTransferFileSizeBytes
      * @return {Number} The maximum number of bytes for file transfer.
      */
      GetMaxTransferFileSizeBytes: function () {
        if (_addon) {
          return _addon.GetMaxTransferFileSizeBytes();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Gets file receiver's user id.
      * @method GetReceiver
      * @return {Number} The receiver user id. -1 specify the internel error of get user id. 0 specify the file send to all.
      */
      GetReceiver: function () {
        if (_addon) {
          return _addon.GetReceiver();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Cancel the file send.
      * @method CancelSend
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      */
      CancelSend: function () {
        if (_addon) {
          return _addon.CancelSend();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Gets file sender's user id.
      * @method GetSender
      * @return {Number} The receiver user id. -1 specify the internel error of get user id. 0 specify the file send to all.
      */
      GetSender: function () {
        if (_addon) {
          return _addon.GetSender();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Cancel the file receive.
      * @method CancelReceive
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      */
      CancelReceive: function () {
        if (_addon) {
          return _addon.CancelReceive();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Starts receive the file.
      * @method StartReceive
      * @param {String} path The path to receive the file.
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      */
      StartReceive: function (opts) {
        if (_addon) {
          var clientOpts = opts || {};
          var path = clientOpts.path;
          if (!path) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
          try {
            let StartReceiveParams = new messages.StartReceiveParams();
            StartReceiveParams.setPath(path);
            let bytes = StartReceiveParams.serializeBinary();
            return _addon.StartReceive(bytes);
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
  ZoomMeetingChat: ZoomMeetingChat
}
