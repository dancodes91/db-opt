const { ZoomSDKError } = require('./settings.js');
const messages = require('./electron_sdk_pb.js');

var ZoomMeetingDocs = (function () {
  var instance;
  
  /**
   * Zoom Meeting Docs
   * @module zoom_meeting_docs
   * @param {Function} onDocsSharingSourceInfoChanged Callback for document status change.
   * @param {Function} onDocsPermissionChanged Callback for document sharing permission changes.
   * @return {ZoomMeetingDocs}
   */
  function init(opts) {
    let clientOpts = opts || {};
    let _addon = clientOpts.addon.GetMeetingDocsCtrl() || null;
    let _onDocsSharingSourceInfoChanged = clientOpts.onDocsSharingSourceInfoChanged || null;
    let _onDocsPermissionChanged = clientOpts.onDocsPermissionChanged || null;
    
    /**
     * Callback for document status change.
     * @event onDocsSharingSourceInfoChanged
     * @param {Object} info Document sharing source information with the following properties:
     *   - status: Value defined in SDKDocsStatus enum
     *   - docTitle: The title of the sharing Zoom docs
     *   - shareSourceID: The share source id of the sharing Zoom docs
     *   - userID: The user id who is sharing Zoom docs
     * @note Notifies when document sharing starts/stops. All meeting participants receive this event.
     */
    function onDocsSharingSourceInfoChanged(info) {
      if (_onDocsSharingSourceInfoChanged) {
        _onDocsSharingSourceInfoChanged(info);
      }
    }
    
    /**
     * Callback for document sharing permission changes.
     * @event onDocsPermissionChanged
     * @param {Number} createOption Specifies who can create new documents.
     * @param {Number} option Specifies who can share documents.
     * @note Triggered when document creation/sharing permissions are modified.
     */
    function ondocspermissionchanged(createOption, option) {
      if (_onDocsPermissionChanged) {
        _onDocsPermissionChanged(createOption, option);
      }
    }

    if (_addon) {
      _addon.SetOnDocsSharingSourceInfoChangedCB(onDocsSharingSourceInfoChanged);
      _addon.SetOnDocsPermissionChangedCB(ondocspermissionchanged);
    }

    return {
      /**
       * Set onDocsSharingSourceInfoChanged callback.
       * @method SetOnDocsSharingSourceInfoChangedCB
       * @param {Function} onDocsSharingSourceInfoChanged
       * @return {Boolean} true or false
       */
      SetOnDocsSharingSourceInfoChangedCB: function (onDocsSharingSourceInfoChanged) {
        if (_addon && onDocsSharingSourceInfoChanged && onDocsSharingSourceInfoChanged instanceof Function) {
          _onDocsSharingSourceInfoChanged = onDocsSharingSourceInfoChanged;
          return true;
        }
        return false;
      },
      /**
       * Set onDocsPermissionChanged callback.
       * @method SetOnDocsPermissionChangedCB
       * @param {Function} onDocsPermissionChanged
       * @return {Boolean} true or false
       */
      SetOnDocsPermissionChangedCB: function (onDocsPermissionChanged) {
        if (_addon && onDocsPermissionChanged && onDocsPermissionChanged instanceof Function) {
          _onDocsPermissionChanged = onDocsPermissionChanged;
          return true;
        }
        return false;
      },
      /**
       * Determine whether the current meeting supports the docs or not.
       * @method IsSupportDocs
       * @return {Boolean} true indicates to support.
       */
      IsSupportDocs: function () {
        if (_addon) {
          return _addon.IsSupportDocs();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * Determine whether the current user can start sharing the doc or not.
       * @method CanStartShareDocs
       * @return {Boolean} true indicates you can start sharing the doc.
       */
      CanStartShareDocs: function () {
        if (_addon) {
          return _addon.CanStartShareDocs();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * Determine whether the current user can set docs options or not.
       * @method CanSetDocsOption
       * @return {Boolean} true if the current user can set docs options. Otherwise, false (the user cannot set docs options).
       */
      CanSetDocsOption: function () {
        if (_addon) {
          return _addon.CanSetDocsOption();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * Set the setting option for who can share docs.
       * @method SetDocsShareOption
       * @param {Number} option The setting for who can share docs.
       * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
       */
      SetDocsShareOption: function (opts) {
        if (_addon) {
          const clientOpts = opts || {};
          let option = clientOpts.option;
          try {
            const SetDocsShareOptionParams = new messages.SetDocsShareOptionParams();
            SetDocsShareOptionParams.setOption(option);
            const bytes = SetDocsShareOptionParams.serializeBinary();
            return _addon.SetDocsShareOption(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * Get the setting option for who can share docs.
       * @method GetDocsShareOption
       * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
       */
      GetDocsShareOption: function () {
        if (_addon) {
          return _addon.GetDocsShareOption();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * Set the option for who can initiate a new doc.
       * @method SetDocsCreateOption
       * @param {Number} option Setting option for who can initiate a new doc.
       * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
       */
      SetDocsCreateOption: function (opts) {
        if (_addon) {
          const clientOpts = opts || {};
          let option = clientOpts.option;
          try {
            const SetDocsCreateOptionParams = new messages.SetDocsCreateOptionParams();
            SetDocsCreateOptionParams.setOption(option);
            const bytes = SetDocsCreateOptionParams.serializeBinary();
            return _addon.SetDocsCreateOption(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * Get the option for who can initiate a new doc.
       * @method GetDocsCreateOption
       * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
       */
      GetDocsCreateOption: function () {
        if (_addon) {
          return _addon.GetDocsCreateOption();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * Query if other user is sharing docs.
       * @method IsOtherSharingDocs
       * @return {Boolean} true indicates other user is sharing docs.
       */
      IsOtherSharingDocs: function () {
        if (_addon) {
          return _addon.IsOtherSharingDocs();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * Query if the current user is sharing docs successfully.
       * @method IsSharingDocsOut
       * @return {Boolean} true indicates sharing successfully.
       */
      IsSharingDocsOut: function () {
        if (_addon) {
          return _addon.IsSharingDocsOut();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      }, 
      /**
       * Show the docs dashboard web view window.
       * @method ShowDocsDashboard
       * @param {Number} x The horizontal coordinate value.
       * @param {Number} y The vertical coordinate value.
       * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
       * @note If x == -1 and y = -1, the window position will be in the center of the screen where the owner window is located.
       * @note Valid only for custom user interface mode.
       */
      ShowDocsDashboard: function (opts) {
        if (_addon) {
          const clientOpts = opts || {};
          let x = clientOpts.x;
          let y = clientOpts.y;
          try {
            const ShowDocsDashboardParams = new messages.ShowDocsDashboardParams();
            ShowDocsDashboardParams.setX(x);
            ShowDocsDashboardParams.setY(y);
            const bytes = ShowDocsDashboardParams.serializeBinary();
            return _addon.ShowDocsDashboard(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * Set the dashboard web view window size.
       * @method SetDocDashboardSize
       * @param {Number} width Specify the width of the window.
       * @param {Number} height Specify the height of the window.
       * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
       * @note If height == -1 and width == -1, the window size will be default.
       * @note Valid only for custom user interface mode.
       */
      SetDocDashboardSize: function (opts) {
        if (_addon) {
          const clientOpts = opts || {};
          let width = clientOpts.width;
          let height = clientOpts.height;
          try {
            const SetDocDashboardSizeParams = new messages.SetDocDashboardSizeParams();
            SetDocDashboardSizeParams.setWidth(width);
            SetDocDashboardSizeParams.setHeight(height);
            const bytes = SetDocDashboardSizeParams.serializeBinary();
            return _addon.SetDocDashboardSize(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },  
      /**
       * Set the docs web view window position.
       * @method SetDocsViewPos
       * @param {Number} x Specifies the X-axis coordinate of the top-left corner of the docs web view window in the parent window.
       * @param {Number} y Specifies the Y-axis coordinate of the top-left corner of the docs web view window in the parent window.
       * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
       * @note If x == -1 and y = -1, the window position will be in the center of the screen where the owner window is located.
       * @note If you don't call this function, the window position will be in the center of the screen where the owner window is located.
       * @note Valid only for custom user interface mode.
       */
      SetDocsViewPos: function (opts) {
        if (_addon) {
          const clientOpts = opts || {};
          let x = clientOpts.x;
          let y = clientOpts.y;
          try {
            const SetDocsViewPosParams = new messages.SetDocsViewPosParams();
            SetDocsViewPosParams.setX(x);
            SetDocsViewPosParams.setY(y);
            const bytes = SetDocsViewPosParams.serializeBinary();
            return _addon.SetDocsViewPos(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * Set the docs web view window size.
       * @method SetDocsViewSize
       * @param {Number} width Specify the width of the docs web view window.
       * @param {Number} height Specify the height of the docs web view window.
       * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
       * @note If height == -1 and width == -1, the window size will be default.
       * @note If you don't call this function, the window size will be default.
       * @note Valid only for custom user interface mode.
       */
      SetDocsViewSize: function (opts) {
        if (_addon) {
          const clientOpts = opts || {};
          let width = clientOpts.width;
          let height = clientOpts.height;
          try {
            const SetDocsViewSizeParams = new messages.SetDocsViewSizeParams();
            SetDocsViewSizeParams.setWidth(width);
            SetDocsViewSizeParams.setHeight(height);
            const bytes = SetDocsViewSizeParams.serializeBinary();
            return _addon.SetDocsViewSize(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * Show the docs web view window.
       * @method ShowDocsViewWindow
       * @param {Number} sourceID The share source ID that is sharing.
       * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
       * @note Valid only for custom user interface mode.
       */
      ShowDocsViewWindow: function (opts) {
        if (_addon) {
          const clientOpts = opts || {};
          let sourceID = clientOpts.sourceID;
          try {
            const ShowDocsViewWindowParams = new messages.ShowDocsViewWindowParams();
            ShowDocsViewWindowParams.setSourceid(sourceID);
            const bytes = ShowDocsViewWindowParams.serializeBinary();
            return _addon.ShowDocsViewWindow(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * Close the docs web view window.
       * @method CloseDocsViewWindow
       * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
       * @note Valid only for custom user interface mode.
       */
      CloseDocsViewWindow: function () {
        if (_addon) {
          return _addon.CloseDocsViewWindow();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * Get the docs sharing source information list from the specified sharer.
       * @method GetDocsSharingSourceInfoList
       * @param {Number} userID The ID of the user who is sharing docs.
       * @return {Number} If the function succeeds, the return value is the viewable docs sharing information list.
       */
      GetDocsSharingSourceInfoList: function (opts) {
        if (_addon) {
          const clientOpts = opts || {};
          let userID = clientOpts.userID;
          try {
            const GetDocsSharingSourceInfoListParams = new messages.GetDocsSharingSourceInfoListParams();
            GetDocsSharingSourceInfoListParams.setUserid(userID);
            const bytes = GetDocsSharingSourceInfoListParams.serializeBinary();
            return _addon.GetDocsSharingSourceInfoList(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * Get the ID of users who are sharing docs.
       * @method GetViewableDocsSharingUserList
       * @return {Number} If the function succeeds, the return value is a list of user ID of all users who are sharing docs. If the function fails, the return value is null.
       */
      GetViewableDocsSharingUserList: function () {
        if (_addon) {
          return _addon.GetViewableDocsSharingUserList();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * Set the docs web view and dashboard web view owner window.
       * @method SetOwnerWindow
       * @param {String} windowID Specify the owner window.
       * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
       * @note Call this function before calling ShowDocsDashboard. Call this function when receiving the meeting status MEETING_STATUS_INMEETING.
       * @note Valid only for user custom interface mode.
       */
      SetOwnerWindow: function (opts) {
        if (_addon) {
          if (platform == 'darwin') {
            return ZoomSDKError.SDKERR_NO_IMPL;
          }
          const clientOpts = opts || {};
          let windowID = clientOpts.windowID;
          try {
            const SetOwnerWindowParams = new messages.SetOwnerWindowParams();
            SetOwnerWindowParams.setWindowid(windowID);
            const bytes = SetOwnerWindowParams.serializeBinary();
            return _addon.SetOwnerWindow(bytes);
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
    }
  };
})();

module.exports = {
  ZoomMeetingDocs: ZoomMeetingDocs
};