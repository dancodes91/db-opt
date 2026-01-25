const { ZoomAnnotationToolType, ZoomAnnotationClearType, SDKViewType, ZoomSDKError } = require('./settings.js');
const messages = require('./electron_sdk_pb.js');

var ZoomAnnotationCtrl = (function () {
  var instance;
  /**
  * Zoom Annotation Ctrl
  * @module zoom_annotation_ctrl
  * @return {ZoomAnnotationCtrl}
  */
  function init(opts) {
    let clientOpts = opts || {};
    // Private methods and variables
    let _addon = clientOpts.addon.GetMeetingAnnotation() || null;
    return {
      // Public methods and variables
      /**
       * Determine whether current meeting supports annotation feature.
       * @method Annotation_IsAnnotationDisable
       * @return {Boolean} true not support, false support.
       */
      Annotation_IsAnnotationDisable: function () {
        if (_addon) {
          return _addon.IsAnnotationDisable();
        }
        return false;
      },
      /**
      * Display annotation toolbar.
      * @method Annotation_StartAnnotation
      * @param {Number} viewtype Specify which view to display the toolbar {@link SDKViewType}.
      * @param {String} left Specify X-axis coordinate of the upper-left corner for the toolbar.
      * @param {String} top Specify Y-axis coordinate of the upper-left corner for the toolbar.
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      * @note Valid only for ZOOM style user interface mode.
      */
      Annotation_StartAnnotation: function (opts) {
        if (_addon) {
          let clientOpts = opts || {};
          let viewtype = clientOpts.viewtype || SDKViewType.SDK_SEND_SHARE_VIEW;
          let left = clientOpts.left;
          let top = clientOpts.top;
          try {
            let StartAnnotationParams = new messages.StartAnnotationParams();
            StartAnnotationParams.setViewtype(viewtype);
            StartAnnotationParams.setLeft(left);
            StartAnnotationParams.setTop(top);
            let bytes = StartAnnotationParams.serializeBinary();
            return _addon.StartAnnotation(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * Close the current annotation toolbar.
       * @method Annotation_StopAnnotation
       * @param {Number} viewtype Specify which view to close the toolbar {@link SDKViewType}.
       * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
       * @note Valid only for ZOOM style user interface mode.
       */
      Annotation_StopAnnotation: function (opts) {
        if (_addon) {
          let clientOpts = opts || {};
          let viewtype = clientOpts.viewtype || SDKViewType.SDK_SEND_SHARE_VIEW;
          try {
            let StopAnnotationParams = new messages.StopAnnotationParams();
            StopAnnotationParams.setViewtype(viewtype);
            let bytes = StopAnnotationParams.serializeBinary();
            return _addon.StopAnnotation(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * Choose annotation tool.
       * @method Annotation_SetTool
       * @param {Number} viewtype Specify which view to display the toolbar {@link SDKViewType}.
       * @param {String} toolType Specify the annotation tool to be used {@link ZoomAnnotationToolType}.
       * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
       * @note Valid only for ZOOM style user interface mode. The tool type ANNOTOOL_PICKER and ANNOTOOL_SPOTLIGHT are not support for viewer.
       */
      Annotation_SetTool: function (opts) {
        if (_addon) {
          let clientOpts = opts || {};
          let viewtype = clientOpts.viewtype || SDKViewType.SDK_SEND_SHARE_VIEW;
          let toolType = clientOpts.toolType || ZoomAnnotationToolType.ANNOTOOL_NONE_DRAWING;
          try {
            let SetToolParams = new messages.SetToolParams();
            SetToolParams.setViewtype(viewtype);
            SetToolParams.setTooltype(toolType);
            let bytes = SetToolParams.serializeBinary();
            return _addon.SetTool(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * Clear present annotations.
       * @method Annotation_Clear
       * @param {Number} viewtype Specify on which view to clear the annotations {@link SDKViewType}.
       * @param {String} clearType Specify the ways to clear annotations {@link ZoomAnnotationClearType}.
       * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
       * @note Valid only for ZOOM style user interface mode.
       */
      Annotation_Clear: function (opts) {
        if (_addon) {
          let clientOpts = opts || {};
          let viewtype = clientOpts.viewtype || SDKViewType.SDK_SEND_SHARE_VIEW;
          let clearType = clientOpts.clearType || ZoomAnnotationClearType.ANNOCLEAR_ALL;
          try {
            let ClearAnnotationParams = new messages.ClearAnnotationParams();
            ClearAnnotationParams.setViewtype(viewtype);
            ClearAnnotationParams.setCleartype(clearType);
            let bytes = ClearAnnotationParams.serializeBinary();
            return _addon.Clear(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * Set the colors of annotation tools.
       * @method Annotation_SetColor
       * @param {Number} viewtype The specified color is used on which view {@link SDKViewType}.
       * @param {String} color Specify the color of the annotation tools in RGB format.
       * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
       * @note Valid only for ZOOM style user interface mode.
       */
      Annotation_SetColor: function (opts) {
        if (_addon) {
          let clientOpts = opts || {};
          let viewtype = clientOpts.viewtype || SDKViewType.SDK_SEND_SHARE_VIEW;
          let color = clientOpts.color;
          try {
            let SetColorParams = new messages.SetColorParams();
            SetColorParams.setViewtype(viewtype);
            SetColorParams.setColor(color);
            let bytes = SetColorParams.serializeBinary();
            return _addon.SetColor(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * Set the line width of annotation tools.
       * @method Annotation_SetLineWidth
       * @param {Number} viewtype The specified line width is used on which view {@link SDKViewType}.
       * @param {String} lineWidth Specify the line width to annotate.
       * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
       * @note Valid only for ZOOM style user interface mode.
       */
      Annotation_SetLineWidth: function (opts) {
        if (_addon) {
          let clientOpts = opts || {};
          let viewtype = clientOpts.viewtype || SDKViewType.SDK_SEND_SHARE_VIEW;
          let lineWidth = clientOpts.lineWidth + '';
          try {
            let SetLineWidthParams = new messages.SetLineWidthParams();
            SetLineWidthParams.setViewtype(viewtype);
            SetLineWidthParams.setLinewidth(lineWidth);
            let bytes = SetLineWidthParams.serializeBinary();
            return _addon.SetLineWidth(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * Undo the last annotation.
       * @method Annotation_Undo
       * @param {Number} viewtype Specify on which view to undo the last annotation {@link SDKViewType}.
       * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
       * @note Valid only for ZOOM style user interface mode.
       */
      Annotation_Undo: function (opts) {
        if (_addon) {
          let clientOpts = opts || {};
          let viewtype = clientOpts.viewtype || SDKViewType.SDK_SEND_SHARE_VIEW;
          try {
            let UndoParams = new messages.UndoParams();
            UndoParams.setViewtype(viewtype);
            let bytes = UndoParams.serializeBinary();
            return _addon.Undo(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * Redo the last-undo annotation.
       * @method Annotation_Redo
       * @param {Number} viewtype Specify on which view to redo the last-undo annotation {@link SDKViewType}.
       * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
       * @note Valid only for ZOOM style user interface mode.
       */
      Annotation_Redo: function (opts) {
        if (_addon) {
          let clientOpts = opts || {};
          let viewtype = clientOpts.viewtype || SDKViewType.SDK_SEND_SHARE_VIEW;
          try {
            let RedoParams = new messages.RedoParams();
            RedoParams.setViewtype(viewtype);
            let bytes = RedoParams.serializeBinary();
            return _addon.Redo(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * Determine whether the legal notice for annotation is available.
       * @method Annotation_IsAnnotationLegalNoticeAvailable
       * @return {Boolean} true indicates the legal notice for annotation transcript is available. Otherwise, false.
       */
      Annotation_IsAnnotationLegalNoticeAvailable: function () {
        if (_addon) {
          return _addon.IsAnnotationLegalNoticeAvailable();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * Get the annotation legal notices prompt.
       * @method Annotation_GetAnnotationLegalNoticesPrompt
       * @return {String} The annotation legal notices prompt.
       */
      Annotation_GetAnnotationLegalNoticesPrompt: function () {
        if (_addon) {
          return _addon.GetAnnotationLegalNoticesPrompt();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * Get the annotation legal notices explained.
       * @method Annotation_GetAnnotationLegalNoticesExplained
       * @return {String} The annotation legal notices explained.
       */
      Annotation_GetAnnotationLegalNoticesExplained: function () {
        if (_addon) {
          return _addon.GetAnnotationLegalNoticesExplained();
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
  ZoomAnnotationCtrl: ZoomAnnotationCtrl
};
