/**
 * @alias ZOOM_TYPE_OS_TYPE
 * @readonly
 * @enum {Number}
 */
const ZOOM_TYPE_OS_TYPE = {
	WIN_OS: 0,
	MAC_OS: 1
};

/**
 * @alias ZoomSDK_LANGUAGE_ID
 * @readonly
 * @enum {Number}
 */
const ZoomSDK_LANGUAGE_ID = {
	/** For initialization. */
	LANGUAGE_Unknown: 0,
	/** In English. */
	LANGUAGE_English: 1,
	/** In simplified Chinese. */
	LANGUAGE_Chinese_Simplified: 2,
	/** In traditional Chinese. */
	LANGUAGE_Chinese_Traditional: 3,
	/** In Japanese. */
	LANGUAGE_Japanese: 4,
	/** In Spanish. */
	LANGUAGE_Spanish: 5,
	/** In German. */
	LANGUAGE_German: 6,
	/** In French. */
	LANGUAGE_French: 7,
	/** In Portuguese. */
	LANGUAGE_Portuguese: 8,
	/** In Russian. */
	LANGUAGE_Russian: 9,
	/** In Korean. */
	LANGUAGE_Korean: 10,
	/** In Vietnamese. */
	LANGUAGE_Vietnamese: 11,
	/** In Italian. */
	LANGUAGE_Italian: 12,
	/** In Polish. */
	LANGUAGE_Polish: 13,
	/** In Turkish. */
	LANGUAGE_Turkish: 14,
	/** In Indonesian. */
	LANGUAGE_Indonesian: 15,
	/** In Dutch. */
	LANGUAGE_Dutch: 16
};

/**
 * @alias ZoomSDKError
 * @readonly
 * @enum {Number}
 */
const ZoomSDKError = {
	/** Success. */
	SDKERR_SUCCESS: 0,
	/** The feature is currently invalid. */
	SDKERR_NO_IMPL: 1,
	/** Incorrect usage of the feature. */
	SDKERR_WRONG_USAGE: 2, //
	/** Wrong parameter. */
	SDKERR_INVALID_PARAMETER: 3,
	/** Loading module failed. */
	SDKERR_MODULE_LOAD_FAILED: 4,
	/** No memory is allocated. */
	SDKERR_MEMORY_FAILED: 5,
	/** Internal service error. */
	SDKERR_SERVICE_FAILED: 6,
	/** Not initialized before the usage. */
	SDKERR_UNINITIALIZE: 7,
	/** Not authorized before the usage. */
	SDKERR_UNAUTHENTICATION: 8,
	/** No recording in process. */
	SDKERR_NORECORDINGINPROCESS: 9,
	/** Transcoder module is not found. */
	SDKERR_TRANSCODER_NOFOUND: 10,
	/** The video service is not ready. */
	SDKERR_VIDEO_NOTREADY: 11,
	/** No permission. */
	SDKERR_NO_PERMISSION: 12,
	/** Unknown error. */
	SDKERR_UNKNOWN: 13,
	/** The other instance of the SDK is in process. */
	SDKERR_OTHER_SDK_INSTANCE_RUNNING: 14,
	/** SDK internal error. */
	SDKERR_INTELNAL_ERROR: 15,
	/** No audio device found. */
	SDKERR_NO_AUDIODEVICE_ISFOUND: 16,
	/** No video device found. */
	SDKERR_NO_VIDEODEVICE_ISFOUND: 17,
	/** API calls too frequently. */
	SDKERR_TOO_FREQUENT_CALL: 18,
	/** User can't be assigned with new privilege. */
	SDKERR_FAIL_ASSIGN_USER_PRIVILEGE: 19,
	/** The current meeting doesn't support the feature. */
	SDKERR_MEETING_DONT_SUPPORT_FEATURE: 20,
	/** The current user is not the presenter. */
	SDKERR_MEETING_NOT_SHARE_SENDER: 21,
	/** There is no sharing. */
	SDKERR_MEETING_YOU_HAVE_NO_SHARE: 22,
	/** Incorrect ViewType parameters. */
	SDKERR_MEETING_VIEWTYPE_PARAMETER_IS_WRONG: 23,
	/** Annotation is disabled. */
	SDKERR_MEETING_ANNOTATION_IS_OFF: 24,
	/** Current OS doesn't support the setting. */
	SDKERR_SETTING_OS_DONT_SUPPORT: 25,
	/** Email login is disable. */
	SDKERR_EMAIL_LOGIN_IS_DISABLED: 26,
	/** Computer doesn't meet the minimum requirements to use virtual background feature. */
	SDKERR_HARDWARE_NOT_MEET_FOR_VB: 27,
	/** Need process disclaimer. */
	SDKERR_NEED_USER_CONFIRM_RECORD_DISCLAIMER: 28,
	/** There is no raw data of sharing. */
	SDKERR_NO_SHARE_DATA: 29,
	/** Share can not subscribe myself. */
	SDKERR_SHARE_CANNOT_SUBSCRIBE_MYSELF: 30,
	/** Not in meeting. */
	SDKERR_NOT_IN_MEETING: 31,
	/** Not Joining audio. */
	SDKERR_NOT_JOIN_AUDIO: 32,
	/** The current device doesn't support the feature. */
	SDKERR_HARDWARE_DONT_SUPPORT: 33,
	/** Domain not support. */
	SDKERR_DOMAIN_DONT_SUPPORT: 34,
	/** Remote control is disabled. */
	SDKERR_MEETING_REMOTE_CONTROL_IS_OFF: 35,
	/** File transfer fail. */
	SDKERR_FILETRANSFER_ERROR: 36
};

/**
 * @alias ZoomAPPLocale
 * @readonly
 * @enum {Number}
 */
const ZoomAPPLocale = {
	SDK_APP_Locale_Default: 0,
	SDK_APP_Locale_CN: 1,
};

/**
 * @alias ZoomAuthResult
 * @readonly
 * @enum {Number}
 */
const ZoomAuthResult = {
	/** Authentication is successful. */
	AUTHRET_SUCCESS: 0,
	/** The key or secret to authenticate is empty. */
	AUTHRET_KEYORSECRETEMPTY: 1,
	/** The key or secret to authenticate is wrong. */
	AUTHRET_KEYORSECRETWRONG: 2,
	/** The user account does not support. */
	AUTHRET_ACCOUNTNOTSUPPORT: 3,
	/** The user account is not enabled for SDK. */
	AUTHRET_ACCOUNTNOTENABLESDK: 4,
	/** Unknown error. */
	AUTHRET_UNKNOWN: 5,
	/** Service is busy. */
	AUTHRET_SERVICE_BUSY: 6,
	/** Initial status. */
	AUTHRET_NONE: 7,
	/** Time out. */
	AUTHRET_OVERTIME: 8,
	/** Network issues. */
	AUTHRET_NETWORKISSUE: 9,
	/** Account does not support this SDK version. */
	AUTHRET_CLIENT_INCOMPATIBLE: 10,
	/** The jwt token to authenticate is wrong. */
	AUTHRET_JWTTOKENWRONG: 11,
	/** The authentication rate limit is exceeded. */
	AUTHRET_LIMIT_EXCEEDED_EXCEPTION: 12
};

/**
 * @alias ZoomLanguageType
 * @readonly
 * @enum {Number}
 */
const ZoomLanguageType = {
	/** No use of the custom resource. */
	CustomizedLanguage_None: 0,
	/** Use the specified file path to assign the custom resource. */
	CustomizedLanguage_FilePath: 1,
	/** Use the specified content to assign the custom resource. */
	CustomizedLanguage_Content: 2
};

/**
 * @alias ZoomLoginStatus
 * @readonly
 * @enum {Number}
 */
const ZoomLoginStatus = {
	/** Unlogged in. */
	LOGIN_IDLE: 0,
	/** In process of login. */
	LOGIN_PROCESSING: 1,
	/** Login successful. */
	LOGIN_SUCCESS: 2,
	/** Login failed. */
	LOGIN_FAILED: 3
};

/**
 * @alias ZoomLoginType
 * @readonly
 * @enum {Number}
 */
const ZoomLoginType = {
	/** Unknown type. */
	LoginType_Unknown: 0,
	/** Login with work mailbox. */
	LoginType_Email: 1,
	/** Login with SSO token. */
	LoginType_SSO: 2
};

/**
 * @alias ZoomMeetingStatus
 * @readonly
 * @enum {Number}
 */
const ZoomMeetingStatus = {
	/** No meeting is running. */
	MEETING_STATUS_IDLE: 0,
	/** Connect to the meeting server status. */
	MEETING_STATUS_CONNECTING: 1,
	/** Waiting for the host to start the meeting. */
	MEETING_STATUS_WAITINGFORHOST: 2, //
	/** Meeting is ready, in meeting status. */
	MEETING_STATUS_INMEETING: 3,
	/** Disconnect the meeting server, leave meeting status. */
	MEETING_STATUS_DISCONNECTING: 4,
	/** Reconnecting meeting server status. */
	MEETING_STATUS_RECONNECTING: 5,
	/** Failed to connect the meeting server. */
	MEETING_STATUS_FAILED: 6,
	/** Meeting ends. */
	MEETING_STATUS_ENDED: 7,
	/** Unknown status. */
	MEETING_STATUS_UNKNOWN: 8,
	/** Meeting is locked to prevent the further participants to join the meeting. */
	MEETING_STATUS_LOCKED: 9,
	/** Meeting is open and participants can join the meeting. */
	MEETING_STATUS_UNLOCKED: 10,
	/** Participants who join the meeting before the start are in the waiting room. */
	MEETING_STATUS_IN_WAITING_ROOM: 11,
	/** Upgrade the attendees to panelist in webinar. */
	MEETING_STATUS_WEBINAR_PROMOTE: 12,
	/** Downgrade the attendees from the panelist. */
	MEETING_STATUS_WEBINAR_DEPROMOTE: 13,
	/** Join the breakout room. */
	MEETING_STATUS_JOIN_BREAKOUT_ROOM: 14,
	/** Leave the breakout room. */
	MEETING_STATUS_LEAVE_BREAKOUT_ROOM: 15,
	/** Audio is ready. */
	MEETING_STATUS_AUDIO_READY: 16,
	/** Other meeting is in progress. */
	MEETING_STATUS_OTHER_MEETING_INPROGRESS: 17
};

/**
 * @alias ZoomSDKUserType
 * @readonly
 * @enum {Number}
 */
const ZoomSDKUserType = {
	/** Type of ordinary user who needs to login. */
	SDK_UT_NORMALUSER: 100, // Type of ordinary user who needs to login.
	/** Start meeting without login. */
	SDK_UT_WITHOUT_LOGIN: 101
};

/**
 * @alias ZoomUserType
 * @readonly
 * @enum {Number}
 */
const ZoomUserType = {
	/** API user. */
	ZoomUserType_APIUSER: 0,
	/** User logged in with email. */
	ZoomUserType_EMAIL_LOGIN: 1,
	/** User logged in with Facebook. */
	ZoomUserType_FACEBOOK: 2,
	/** User logged in with Google. */
	ZoomUserType_GoogleOAuth: 3,
	/** User logged in with SSO. */
	ZoomUserType_SSO: 4,
	/** User of unknown type. */
	ZoomUserType_Unknown: 5
};

/**
 * @alias LeaveMeetingCmd
 * @readonly
 * @enum {Number}
 */
const LeaveMeetingCmd = {
	/** Leave meeting */
	LEAVE_MEETING: 0,
	/** End meeting */
	END_MEETING: 1
};

/**
 * @alias MeetingType
 * @readonly
 * @enum {Number}
 */
const MeetingType = {
	/** For initialization. */
	MEETING_TYPE_NONE: 0,
	/** Ordinary meeting. */
	MEETING_TYPE_NORMAL: 1,
	/** Webinar. */
	MEETING_TYPE_WEBINAR: 2,
	/** Breakout meeting. */
	MEETING_TYPE_BREAKOUTROOM: 3
};

/**
 * @alias ZoomMeetingFailCode
 * @readonly
 * @enum {Number}
 */
const ZoomMeetingFailCode = {
	/** Start meeting successfully. */
	MEETING_SUCCESS: 0,
	/** The connection with the backend service has errors. */
	MEETING_FAIL_CONNECTION_ERR: 1,
	/** Reconnect error. */
	MEETING_FAIL_RECONNECT_ERR: 2,
	/** Multi-media Router error. */
	MEETING_FAIL_MMR_ERR: 3,
	/** Password is wrong. */
	MEETING_FAIL_PASSWORD_ERR: 4,
	/** Session error. */
	MEETING_FAIL_SESSION_ERR: 5,
	/** Meeting is over. */
	MEETING_FAIL_MEETING_OVER: 6,
	/** Meeting has not begun. */
	MEETING_FAIL_MEETING_NOT_START: 7,
	/** Meeting does not exist. */
	MEETING_FAIL_MEETING_NOT_EXIST: 8,
	/** The capacity of meeting is full. For users that can't join meeting, they can go to watch live stream with the callback onMeetingFullToWatchLiveStream if the host has started. */
	MEETING_FAIL_MEETING_USER_FULL: 9,
	/** The client is incompatible. */
	MEETING_FAIL_CLIENT_INCOMPATIBLE: 10,
	/** The Multi-media router is not founded. */
	MEETING_FAIL_NO_MMR: 11,
	/** The meeting is locked. */
	MEETING_FAIL_CONFLOCKED: 12,
	/** The meeting is failed because of the restriction by the same account. */
	MEETING_FAIL_MEETING_RESTRICTED: 13,
	/** The meeting is restricted by the same account while the attendee is allowed to join before the host. */
	MEETING_FAIL_MEETING_RESTRICTED_JBH: 14,
	/** Unable to send web request. */
	MEETING_FAIL_CANNOT_EMIT_WEBREQUEST: 15,
	/** The token is expired. */
	MEETING_FAIL_CANNOT_START_TOKENEXPIRE: 16,
	/** Video hardware or software error. */
	SESSION_VIDEO_ERR: 17,
	/** Audio autostart error. */
	SESSION_AUDIO_AUTOSTARTERR: 18,
	/** The number of webinar registered has reached the upper limit. */
	MEETING_FAIL_REGISTERWEBINAR_FULL: 19,
	/** Register webinar with the role of webinar host. */
	MEETING_FAIL_REGISTERWEBINAR_HOSTREGISTER: 20,
	/** Register webinar with the role of panelist member. */
	MEETING_FAIL_REGISTERWEBINAR_PANELISTREGISTER: 21,
	/** Register webinar with the denied email. */
	MEETING_FAIL_REGISTERWEBINAR_DENIED_EMAIL: 22,
	/** Webinar request to login. */
	MEETING_FAIL_ENFORCE_LOGIN: 23,
	/** Invalid for Windows SDK. */
	MEETING_FAIL_ZC_CERTIFICATE_CHANGED: 24,
	/** Vanity conference ID does not exist. */
	MEETING_FAIL_VANITY_NOT_EXIST: 27,
	/** Join webinar with the same email. */
	MEETING_FAIL_JOIN_WEBINAR_WITHSAMEEMAIL: 28, // Join webinar with the same email.
	/** Meeting settings is not allowed to start a meeting. */
	MEETING_FAIL_DISALLOW_HOST_MEETING: 29,
	/** Failed to write configure file. */
	MEETING_FAIL_WRITE_CONFIG_FILE: 50,
	/** Forbidden to join the internal meeting. */
	MEETING_FAIL_FORBID_TO_JOIN_INTERNAL_MEETING: 60,
	/** Removed by the host. */
	MEETING_FAIL_REMOVEDBYHOST: 61,
	/** Forbidden to join meeting. */
	MEETING_FAIL_HOST_DISALLOW_OUTSIDE_USER_JOIN: 62,
	/** To join a meeting hosted by an external Zoom account, your SDK app has to be published on Zoom Marketplace. You can refer to Section 6.1 of Zoom's API License Terms of Use. */
	MEETING_FAIL_UNABLE_TO_JOIN_EXTERNAL_MEETING: 63,
	/** Join failed because this Meeting SDK key is blocked by the host's account admin. */
	MEETING_FAIL_BLOCKED_BY_ACCOUNT_ADMIN: 64,
	/** Need sign in using the same account as the meeting organizer. */
	MEETING_FAIL_NEED_SIGN_IN_FOR_PRIVATE_MEETING: 82,
	/** Join meeting param vanityID is duplicated and needs to be confirmed.For more information about Vanity URLs, see https://support.zoom.com/hc/en/article?id=zm_kb&sysparm_article=KB0061540#multipleVanity */
	MEETING_FAIL_NEED_CONFIRM_PLINK: 88,
	/** Join meeting param vanityID does not exist in the current account.For more information about Vanity URLs, see https://support.zoom.com/hc/en/article?id=zm_kb&sysparm_article=KB0061540#multipleVanity */
	MEETING_FAIL_NEED_INPUT_PLINK: 89,
	/** App join token error. */
	MEETING_FAIL_APP_PRIVILEGE_TOKEN_ERROR: 500,
	/** Authorized user not in meeting. */
	MEETING_FAIL_AUTHORIZED_USER_NOT_INMEETING: 501,
	/** On-behalf token error: conflict with login credentials. */
	MEETING_FAIL_ON_BEHALF_TOKEN_CONFLICT_LOGIN_ERROR: 502,
	/** Jmak user email not match. */
	MEETING_FAIL_JMAK_USER_EMAIL_NOT_MATCH: 1143,
	MEETING_FAIL_UNKNOWN: 0xffff
};

/**
 * @alias MeetingEndReason
 * @readonly
 * @enum {Number}
 */
const MeetingEndReason = {
	/** For initialization. */
	EndMeetingReason_None: 0,
	/** Kicked by host. */
	EndMeetingReason_KickByHost: 1,
	/** Ended by host. */
	EndMeetingReason_EndByHost: 2,
	/** JBH times out. */
	EndMeetingReason_JBHTimeOut: 3,
	/** No attendee. */
	EndMeetingReason_NoAttendee: 4,
	/** Host starts another meeting. */
	EndMeetingReason_HostStartAnotherMeeting: 5,
	/** Free meeting times out. */
	EndMeetingReason_FreeMeetingTimeOut: 6,
	/** Represents an undefined end meeting reason, typically used for new error codes introduced by the backend after client release. */
	EndMeetingReason_Undefined: 7,
	/** Authorized user left. */
	EndMeetingReason_DueToAuthorizedUserLeave: 8
};

/**
 * @alias ZoomMeetingUIFloatVideoType
 * @readonly
 * @enum {Number}
 */
const ZoomMeetingUIFloatVideoType = {
	/** Type of list. */
	FLOATVIDEO_List: 0,
	/** Small.  */
	FLOATVIDEO_Small: 1,
	/** Large. */
	FLOATVIDEO_Large: 2,
	/** Minimized. */
	FLOATVIDEO_Minimize: 3
};

/**
 * @alias SDKViewType
 * @readonly
 * @enum {Number}
 */
const SDKViewType = {
	/** Primary displayer. */
	SDK_FIRST_VIEW: 0,
	/** Secondary displayer. */
	SDK_SECOND_VIEW: 1,
	SDK_SEND_SHARE_VIEW: 2
};

/**
 * @alias ZoomMeetingButtonType
 * @readonly
 * @enum {Number}
 */
const ZoomMeetingButtonType = {
	ButtonType_ToolBarParticipant: 0,
	ButtonType_ToolBarShare: 1,
	ButtonType_ToolBarInvite: 2,
};

/**
 * @alias ZoomMeetingUIViewType
 * @readonly
 * @enum {Number}
 */
const ZoomMeetingUIViewType = {
	MEETINGUI_FIRST_MONITOR: 0,
	MEETINGUI_SECOND_MONITOR: 1,
};

/**
 * @alias ZoomAnnotationToolType
 * @readonly
 * @enum {Number}
 */
const ZoomAnnotationToolType = {
	/** Switch to mouse cursor. */
	ANNOTOOL_NONE_DRAWING: 0,
	/** Pen. */
	ANNOTOOL_PEN: 1,
	/** Highlighter. */
	ANNOTOOL_HIGHLIGHTER: 2,
	/** A straight line changes automatically in pace with the mouse cursor. */
	ANNOTOOL_AUTO_LINE: 3,
	/** A rectangle changes automatically in pace with the mouse cursor. */
	ANNOTOOL_AUTO_RECTANGLE: 4,
	/** An ellipse changes automatically in pace with the mouse cursor. */
	ANNOTOOL_AUTO_ELLIPSE: 5,
	/** An arrow changes automatically in pace with the mouse cursor. */
	ANNOTOOL_AUTO_ARROW: 6,
	/** A filled rectangle. */
	ANNOTOOL_AUTO_RECTANGLE_FILL: 7,
	/** A filled ellipse. */
	ANNOTOOL_AUTO_ELLIPSE_FILL: 8,
	/** Laser pointer. */
	ANNOTOOL_SPOTLIGHT: 9,
	/** An arrow showing the name of whom click on the sharing content. */
	ANNOTOOL_ARROW: 10,
	/** Eraser. */
	ANNOTOOL_ERASER: 11,
	/** Insert a textbox in order to input letters. */
	ANNOTOOL_TEXTBOX: 12,
	/** Select the annotations. */
	ANNOTOOL_PICKER: 13,
	/** A fair rectangle changes automatically in pace with the mouse cursor. */
	ANNOTOOL_AUTO_RECTANGLE_SEMI_FILL: 14,
	/** A fair ellipse changes automatically in pace with the mouse cursor. */
	ANNOTOOL_AUTO_ELLIPSE_SEMI_FILL: 15,
	/** A line with double-arrow. */
	ANNOTOOL_AUTO_DOUBLE_ARROW: 16,
	/** An unfilled rhombus. */
	ANNOTOOL_AUTO_DIAMOND: 17,
	/** A fixed-size arrow for marking. */
	ANNOTOOL_AUTO_STAMP_ARROW: 18,
	/** A sign marking that something is correct. */
	ANNOTOOL_AUTO_STAMP_CHECK: 19,
	/** A sign marking that something is wrong. */
	ANNOTOOL_AUTO_STAMP_X: 20,
	/** A star for marking. */
	ANNOTOOL_AUTO_STAMP_STAR: 21,
	/** A heart for marking. */
	ANNOTOOL_AUTO_STAMP_HEART: 22,
	/** A sign for interrogation. */
	ANNOTOOL_AUTO_STAMP_QM: 23
};

/**
 * @alias ZoomAnnotationClearType
 * @readonly
 * @enum {Number}
 */
const ZoomAnnotationClearType = {
	/** Clear all annotations. */
	ANNOCLEAR_ALL: 0,
	/** Clear only your own annotations. */
	ANNOCLEAR_SELF: 1,
	/** Clear only the others' annotations. */
	ANNOCLEAR_OTHER: 2
};

/**
 * @alias AudioStatus
 * @readonly
 * @enum {Number}
 */
const AudioStatus = {
	/** Initialization. */
	Audio_None: 0,
	/** Muted status. */
	Audio_Muted: 1,
	/** Muted by the host. */
	Audio_UnMuted: 2,
	/** Muted by the host. */
	Audio_Muted_ByHost: 3,
	/** Unmuted by the host. */
	Audio_UnMuted_ByHost: 4,
	/** The host mutes all. */
	Audio_MutedAll_ByHost: 5,
	/** The host unmutes all. */
	Audio_UnMutedAll_ByHost: 6,
};

/**
 * @alias VideoStatus
 * @readonly
 * @enum {Number}
 */
const VideoStatus = {
	/** Video is on. */
	Video_ON: 0,
	/** Video is off. */
	Video_OFF: 1
};

/**
 * @alias ConnectionQuality
 * @readonly
 * @enum {Number}
 */
const ConnectionQuality = {
	/** Unknown connection status. */
	Conn_Quality_Unknown: 0,
	/** The connection quality is very poor. */
	Conn_Quality_Very_Bad: 1,
	/** The connection quality is poor. */
	Conn_Quality_Bad: 2,
	/** The connection quality is not good. */
	Conn_Quality_Not_Good: 3,
	/** The connection quality is normal. */
	Conn_Quality_Normal: 4,
	/** The connection quality is good. */
	Conn_Quality_Good: 5,
	/** The connection quality is excellent. */
	Conn_Quality_Excellent: 6
};

/**
 * @alias MeetingComponentType
 * @readonly
 * @enum {Number}
 */
const MeetingComponentType = {
	/** Default component type. */
	MeetingComponentType_Def: 0,
	/** Audio. */
	MeetingComponentType_AUDIO: 1,
	/** Video. */
	MeetingComponentType_VIDEO: 2,
	/** Share application. */
	MeetingComponentType_SHARE: 3
};

/**
 * @alias H323DeviceType
 * @readonly
 * @enum {Number}
 */
const H323DeviceType = {
	/** Unknown device, only for initialization. */
	H323DeviceType_Unknown: 0,
	/** H.323 device. */
	H323DeviceType_H323: 1,
	/** SIP device. */
	H323DeviceType_SIP: 2,
	/** H.323 device and SIP device. */
	H323DeviceType_BOTH: 3
};

/**
 * @alias H323CalloutStatus
 * @readonly
 * @enum {Number}
 */
const H323CalloutStatus = {
	/** Used only for initialization. */
	H323Callout_Unknown: 0,
	/** Call successfully. */
	H323Callout_Success: 1,
	/** Bell during the call. */
	H323Callout_Ring: 2,
	/** Call timeout. */
	H323Callout_Timeout: 3,
	/** Call fails. */
	H323Callout_Failed: 4,
	/** Busy. */
	H323Callout_Busy: 5,
	/** Decline. */
	H323Callout_Decline: 6
};

/**
 * @alias RawDataMemoryMode
 * @readonly
 * @enum {Number}
 */
const RawDataMemoryMode = {
	/** Use stack memory. */
	RawDataMemoryMode_Stack: 0,
	/** Use heap memory. */
	RawDataMemoryMode_Heap: 1
};

/**
 * @alias RawDataResolution
 * @readonly
 * @enum {Number}
 */
const RawDataResolution = {
	RawDataResolution_90: 0,
	RawDataResolution_180: 1,
	RawDataResolution_360: 2,
	RawDataResolution_720: 3,
	RawDataResolution_1080: 4
};

/**
 * @alias SDKRawDataError
 * @readonly
 * @enum {Number}
 */
const SDKRawDataError = {
	SDKRawDataError_SUCCESS: 0,
	SDKRawDataError_UNINITIALIZED: 1,
	SDKRawDataError_MALLOC_FAILED: 2,
	SDKRawDataError_WRONGUSAGE: 3,
	SDKRawDataError_INVALID_PARAM: 4,
	SDKRawDataError_NOT_IN_MEETING: 5,
	SDKRawDataError_NO_LICENSE: 6,
	SDKRawDataError_VIDEO_MODULE_NOT_READY: 7,
	SDKRawDataError_VIDEO_MODULE_ERROR: 8,
	SDKRawDataError_VIDEO_DEVICE_ERROR: 9,
	SDKRawDataError_NO_VIDEO_DATA: 10,
	SDKRawDataError_SHARE_MODULE_NOT_READY: 11,
	SDKRawDataError_SHARE_MODULE_ERROR: 12,
	SDKRawDataError_NO_SHARE_DATA: 13,
	SDKRawDataError_AUDIO_MODULE_NOT_READY: 14,
	SDKRawDataError_AUDIO_MODULE_ERROR: 15,
	SDKRawDataError_NO_AUDIO_DATA: 16,
};

/**
 * @alias ShareStatus
 * @readonly
 * @enum {Number}
 */
const ShareStatus = {
	/** For initialization. */
	Sharing_None: 0,
	/** Begin to share by the user himself. */
	Sharing_Self_Send_Begin: 1,
	/** Stop sharing by the user. */
	Sharing_Self_Send_End: 2,
	/** Others begin to share. */
	Sharing_Other_Share_Begin: 3,
	/** Others stop sharing. */
	Sharing_Other_Share_End: 4,
	/** View the sharing of others. */
	Sharing_View_Other_Sharing: 5,
	/** Pause sharing. */
	Sharing_Pause: 6,
	/** Resume sharing. */
	Sharing_Resume: 7,
	/** Sharing content changes. */
	Sharing_ContentTypeChange: 8,
	/** The current user begins to share the sounds of computer audio. */
	Sharing_SelfStartAudioShare: 9,
	/** The current user stops to share the sounds of computer audio. */
	Sharing_SelfStopAudioShare: 10,
	/** Other user begins to share the sounds of computer audio. */
	Sharing_OtherStartAudioShare: 11,
	/** Other user stops to share the sounds of computer audio. */
	Sharing_OtherStopAudioShare: 12
};

/**
 * @alias SettingTabPage
 * @readonly
 * @enum {Number}
 */
const SettingTabPage = {
	/** General setting page. */
	SettingTabPage_General: 0,
	/** Audio setting page. */
	SettingTabPage_Audio: 1,
	/** Video setting page. */
	SettingTabPage_Video: 2
};

/**
 * @alias SDKMinimizeUIMode
 * @readonly
 * @enum {Number}
 */
const SDKMinimizeUIMode = {
	/** For initialization. */
	MinimizeUIMode_NONE: 0,
	/** Minimized mode for sharing. */
	MinimizeUIMode_SHARE: 1,
	/** Minimized mode for video. */
	MinimizeUIMode_VIDEO: 2,
	/** Minimized mode for speaking. */
	MinimizeUIMode_ACTIVESPEAKER: 3
};

/**
 * @alias SMSVerificationCodeErr
 * @readonly
 * @enum {Number}
 */
const SMSVerificationCodeErr = {
	/** For initialization. */
	SMSVerificationCodeErr_Unknown: 0,
	/** Success. */
	SMSVerificationCodeErr_Success: 1,
	/** Send SMS Failed. */
	SMSVerificationCodeErr_Retrieve_SendSMSFailed: 2,
	/** Invalid phone number. */
	SMSVerificationCodeErr_Retrieve_InvalidPhoneNum: 3,
	/** The phone number is already bound. */
	SMSVerificationCodeErr_Retrieve_PhoneNumAlreadyBound: 4,
	/** Send phone number too frequently. */
	SMSVerificationCodeErr_Retrieve_PhoneNumSendTooFrequent: 5,
	/** Verification code is incorrect. */
	SMSVerificationCodeErr_Verify_CodeIncorrect: 6,
	/** Verification code is expired. */
	SMSVerificationCodeErr_Verify_CodeExpired: 7,
	/** Unknown error for verification. */
	SMSVerificationCodeErr_Verify_UnknownError: 8
};

/**
 * @alias SDKInviteDlgTabPage
 * @readonly
 * @enum {Number}
 */
const SDKInviteDlgTabPage = {
	/** Invite by Email' tab page */
	SDK_INVITEDLG_TAB_EMAILCONTACT: 0,
	/** Invite by Phone' tab pag */
	SDK_INVITEDLG_TAB_PHONECONTACT: 1,
	/** Invite a Room System' tab page */
	SDK_INVITEDLG_TAB_ROOMSYSTEM: 2
};

/**
 * @alias SDKH323TabPage
 * @readonly
 * @enum {Number}
 */
const SDKH323TabPage = {
	/** Dial In' sub-tab page under Room System invitation tab page */
	SDK_INVITEDLG_H323_DIALIN: 0,
	/** Call Out' sub-tab page under Room System invitation tab page */
	SDK_INVITEDLG_H323_CALLOUT: 1
};

/**
 * @alias SettingsNetWorkType
 * @readonly
 * @enum {Number}
 */
const SettingsNetWorkType = {
	/** Wired LAN */
	SETTINGS_NETWORK_WIRED: 0,
	/** WIFI */
	SETTINGS_NETWORK_WIFI: 1,
	/** PPP */
	SETTINGS_NETWORK_PPP: 2,
	/** 3G */
	SETTINGS_NETWORK_3G: 3,
	/** Others */
	SETTINGS_NETWORK_OTHERS: 4,
	/** Unknown network. */
	SETTINGS_NETWORK_UNKNOWN: -1
};

/**
 * @alias SettingConnectionType
 * @readonly
 * @enum {Number}
 */
const SettingConnectionType = {
	/** Cloud connection. */
	SETTINGS_CONNECTION_TYPE_CLOUD: 0,
	/** Direct connection. */
	SETTINGS_CONNECTION_TYPE_DIRECT: 1,
	/** Unknown connection. */
	SETTINGS_CONNECTION_TYPE_UNKNOWN: -1
};

/**
 * @alias SDKCustomizedStringType
 * @readonly
 * @enum {Number}
 */
const SDKCustomizedStringType = {
	/** The new string must end up with "%s" so that the menu item can show correctly. This type is used to define a string to replace the menu item ON %S on live streaming. */
	SDK_Customized_LiveStream_MenuString_LiveOn_String: 0,
	/** The new string must end up with "%s" so that the menu item can show correctly. This type is used to define a string to replace the menu item VIEW STREAM ON %S on live streaming. */
	SDK_Customized_LiveStream_MenuString_LiveView_String: 1,
	/** The new string must be a pure string so that it can show correctly. This type is used to define a string to replace the menu item STOP LIVE STREAM on live streaming. */
	SDK_Customized_LiveStream_MenuString_LiveStop_String: 2,
	/** The new string must be a pure string so that it can show correctly. This type is used to define a string to replace the menu item COPY STREAMING LINK on live streaming. */
	SDK_Customized_LiveStream_MenuString_CopyURL_String: 3,
	/** The new string must be a pure string so that it can show correctly. This type is used to define a string to replace the title of the meeting video UI. */
	SDK_Customized_Title_App: 4,
	/** The new string must be the same format as "Zoom Participant ID: %s Meeting ID: %s" so that it can show correctly. This type is used to define a string to replace the title of the meeting video UI. */
	SDK_Customized_Title_ZoomVideo: 5,
	/** The new string must be the same format as "Zoom Participant ID: %s	%d-Minutes Meeting ID:%s" so that it can show correctly. This type is used to define a string to replace the title of the meeting video UI when the user is free user and in view-only status. */
	SDK_Customized_Title_FreeZoomVideo: 6,
	/** The new string must be the same format as "Zoom %d-Minutes Meeting ID: %s" so that it can show correctly. This type is used to define a string to replace the title of the meeting video UI when the user is free user and in view-only status. */
	SDK_Customized_Title_ViewOnly_FreeZoomVideo: 7
};

/**
 * @alias SDKCustomizedURLType
 * @readonly
 * @enum {Number}
 */
const SDKCustomizedURLType = {
	/** Set the custom help URL in the virtual background tab page. */
	SDKCustomizedURL_VITRULBG_HELP: 0,
	/** Set the custom Learn More URL in the virtual background tab page. */
	SDKCustomizedURL_VITRULBG_LEARN_MORE: 1,
	/** Set the Support URL in the meeting. */
	SDKCustomizedURL_SUPPORTURL: 2
};

/**
 * @alias RequiredInfoType
 * @readonly
 * @enum {Number}
 */
const RequiredInfoType = {
	/** Initialization. */
	REQUIRED_INFO_TYPE_NONE: 0,
	/** The user needs to enter the password when joins the meeting. Via the InputMeetingPasswordAndScreenName() to specify the password information. */
	REQUIRED_INFO_TYPE_Password: 1,
	/** If the password is invalid, the user needs to re-enter it. Via the InputMeetingPasswordAndScreenName() to specify the password information. */
	REQUIRED_INFO_TYPE_Password4WrongPassword: 2,
	/** The user needs to enter the screen name and the password,via the InputMeetingPasswordAndScreenName() to specify the necessary information. */
	REQUIRED_INFO_TYPE_PasswordAndScreenName: 3,
	/** The user needs to enter the screen name. Via the InputMeetingScreenName() to specify the screen name information. */
	REQUIRED_INFO_TYPE_ScreenName: 4,
	/** The user needs to enter the screen name and the meeting id,via the InputMeetingMeetingIDAndScreenName() to specify the necessary information. */
	REQUIRED_INFO_TYPE_MeetingIDAndScreenName: 5
};

/**
 * @alias WebinarNeedRegisterType
 * @readonly
 * @enum {Number}
 */
const WebinarNeedRegisterType = {
	/** Initialization. */
	WebinarReg_NONE: 0,
	/** Register webinar account by URL. */
	WebinarReg_By_Register_Url: 1,
	/** Register webinar account by email and the screen name. */
	WebinarReg_By_Email_and_DisplayName: 2
};

/**
 * @alias AudioCallbackActionInfo
 * @readonly
 * @enum {Number}
 */
const AudioCallbackActionInfo = {
	/** For initialization. */
	ACTION_INFO_NONE: 0,
	/** Choose audio device because no audio device is connected yet. */
	ACTION_INFO_CHOOSE_AUDIO_DEVICE_NOAUDIODEVICECONNECTTED: 1,
	/** Choose audio device because there is an error in the connected computer audio device. */
	ACTION_INFO_CHOOSE_AUDIO_DEVICE_COMPUTERAUDIODEVICEERROR: 2,
	/** Choose audio device because there is an error in the connected phone call device. */
	ACTION_INFO_CHOOSE_AUDIO_DEVICE_PHONECALLDEVICEERROR: 3,
	/** Need to join voip. */
	ACTION_INFO_NEED_JOIN_VOIP: 4,
	/** Mute or unmute some user's audio */
	ACTION_INFO_MUTE_UNMUTE_AUDIO: 5,
	/** Show audio setting window. */
	ACTION_INFO_SHOW_AUDIO_SETTING_WINDOW: 6
};

/**
 * @alias RecordingStatus
 * @readonly
 * @enum {Number}
 */
const RecordingStatus = {
	/** Start recording on local computer or on cloud. */
	Recording_Start: 0,
	/** Stop recording on local computer or on cloud. */
	Recording_Stop: 1,
	/** There is no more space to store both local and cloud recording. */
	Recording_DiskFull: 2,
	/** Pause recording on local or on cloud. */
	Recording_Pause: 3,
	/** Connecting, only for cloud recording. */
	Recording_Connecting: 4,
	/** Saving the recording failed. */
	Recording_Fail: 5
};

/**
 * @alias RequestStartCloudRecordingStatus
 * @readonly
 * @enum {Number}
 */
const RequestStartCloudRecordingStatus = {
	/** host grants the request. */
	RequestStartCloudRecording_Granted: 0,
	/** host denies the request. */
	RequestStartCloudRecording_Denied: 1,
	/** the request for cloud recording timed out. */
	RequestStartCloudRecording_TimedOut: 2
};

/**
 * @alias SDKUserInfoType
 * @readonly
 * @enum {Number}
 */
const SDKUserInfoType = {
	REAL_USERINFO: 0,
	FAKE_USERINFO: 1
};

/**
 * @alias CustomizedLanguageType
 * @readonly
 * @enum {Number}
 */
const CustomizedLanguageType = {
	/** No use of the custom resource. */
	CustomizedLanguage_None: 0,
	/** Use the specified file path to assign the custom resource. */
	CustomizedLanguage_FilePath: 1,
	/** Use the specified content to assign the custom resource. */
	CustomizedLanguage_Content: 2
};

/**
 * @alias ZoomSDKRawDataType
 * @readonly
 * @enum {Number}
 */
const ZoomSDKRawDataType = {
	RAW_DATA_TYPE_VIDEO: 0,
	RAW_DATA_TYPE_SHARE: 1
};

/**
 * @alias RawDataStatus
 * @readonly
 * @enum {Number}
 */
const RawDataStatus = {
	RawData_On: 0,
	RawData_Off: 1
};

/**
 * @alias ZoomSDKVideoRenderMode
 * @readonly
 * @enum {Number}
 */
const ZoomSDKVideoRenderMode = {
	/** For initialization. */
	SDKVideoRenderMode_None: 0,
	/** Auto mode. */
	SDKVideoRenderMode_Auto: 1,
	/** D3D11EnableFLIP mode. */
	SDKVideoRenderMode_D3D11EnableFLIP: 2,
	/** D3D11 mode. */
	SDKVideoRenderMode_D3D11: 3,
	/** D3D9 mode. */
	SDKVideoRenderMode_D3D9: 4,
	/** GDI mode. */
	SDKVideoRenderMode_GDI: 5
};

/**
 * @alias SDKRawDataMemoryMode
 * @readonly
 * @enum {Number}
 */
const SDKRawDataMemoryMode = {
	/** Use stack memory. */
	SDKRawDataMemoryModeStack: 0,
	/** Use heap memory. */
	SDKRawDataMemoryModeHeap: 1
};

/**
 * @alias ZoomSDKVideoSubscribeFailReason
 * @readonly
 * @enum {Number}
 */
const ZoomSDKVideoSubscribeFailReason = {
	ZoomSDKVideoSubscribe_Fail_None: 0,
	ZoomSDKVideoSubscribe_Fail_ViewOnly: 1,
	ZoomSDKVideoSubscribe_Fail_NotInMeeting: 2,
	ZoomSDKVideoSubscribe_Fail_HasSubscribe1080POr720: 3,
	ZoomSDKVideoSubscribe_Fail_HasSubscribeTwo720P: 4,
	ZoomSDKVideoSubscribe_Fail_HasSubscribeExceededLimit: 5,
	ZoomSDKVideoSubscribe_Fail_TooFrequentCall: 6
};

/**
 * @alias ZoomSDKVideoCaptureMethod
 * @readonly
 * @enum {Number}
 */
const ZoomSDKVideoCaptureMethod = {
	/** For initialization. */
	ZoomSDKVideoCaptureMethod_None: 0,
	/** Auto mode. */
	ZoomSDKVideoCaptureMethod_Auto: 1,
	/** Direct show mode. */
	ZoomSDKVideoCaptureMethod_DirectSHow: 2,
	/** Media foundation mode. */
	ZoomSDKVideoCaptureMethod_MediaFoundation: 3
};

/**
 * @alias ZoomSDKRenderPostProcessing
 * @readonly
 * @enum {Number}
 */
const ZoomSDKRenderPostProcessing = {
	/** For initialization. */
	ZoomSDKRenderPostProcessing_None: 0,
	/** Auto mode. */
	ZoomSDKRenderPostProcessing_Auto: 1,
	/** Enable post processing. */
	ZoomSDKRenderPostProcessing_Enable: 2,
	/** Disable post processing. */
	ZoomSDKRenderPostProcessing_Disable: 3
};

/**
 * @alias ZoomSDKVideoHardwareEncodeType
 * @readonly
 * @enum {Number}
 */
const ZoomSDKVideoHardwareEncodeType = {
	/** Utilizes hardware resources to improve rendering of received video feeds. Mac platform only has this option. */
	VIDEO_HARDWARE_ENCODE_RECEIVING: 0,
	/** Utilizes hardware resources to improve rendering of the video feed being sent out. */
	VIDEO_HARDWARE_ENCODE_SENDING: 1,
	/** Utilizes hardware resources to improve rendering of the overall video feeds. */
	VIDEO_HARDWARE_ENCODE_PROCESSING: 2
};

/**
 * @alias ZoomSDKEchoCancelLationLevel
 * @readonly
 * @enum {Number}
 */
const ZoomSDKEchoCancelLationLevel = {
	/** Automatically adjust echo cancellation, balancing CPU and performance. */
	SDK_ECHO_CANCELLATION_DEFAULT: 0,
	/** Better echo limitation, taking into account multiple people talking at the same time, low CPU utilization. */
	SDK_ECHO_CANCELLATION_LOW: 1,
	/** Best experience when multiple people are talking at the same time. Enabling this option may increase CPU utilization. */
	SDK_ECHO_CANCELLATION_HIGH: 2
};

/**
 * @alias LoginFailReason
 * @readonly
 * @enum {Number}
 */
const LoginFailReason = {
	/** No failure, login successful. */
	LoginFail_None: 0,
	/** Email login is disabled. */
	LoginFail_EmailLoginDisable: 1,
	/** User does not exist. */
	LoginFail_UserNotExist: 2,
	/** Incorrect password. */
	LoginFail_WrongPassword: 3,
	/** Account is locked. */
	LoginFail_AccountLocked: 4,
	/** SDK needs to be updated. */
	LoginFail_SDKNeedUpdate: 5,
	/** Too many failed login attempts. */
	LoginFail_TooManyFailedAttempts: 6,
	/** Incorrect SMS verification code. */
	LoginFail_SMSCodeError: 7,
	/** SMS verification code has expired. */
	LoginFail_SMSCodeExpired: 8,
	/** Invalid phone number format. */
	LoginFail_PhoneNumberFormatInValid: 9,
	/** Invalid login token. */
	LoginFail_LoginTokenInvalid: 10,
	/** Other unspecified issue. */
	LoginFail_OtherIssue: 100
};

/**
 * @alias DirectShareStatus
 * @readonly
 * @enum {Number}
 */
const DirectShareStatus = {
	/** Only for initialization. */
	DirectShare_Unknown: 0,
	/** Waiting for enabling the direct sharing. */
	DirectShare_Connecting: 1,
	/** In direct sharing mode. */
	DirectShare_In_Direct_Share_Mode: 2,
	/** End the direct sharing. */
	DirectShare_Ended: 3,
	/** Re-enter the meeting ID/paring code. */
	DirectShare_Need_MeetingID_Or_PairingCode: 4,
	/** Network error. Please try again later. */
	DirectShare_NetWork_Error: 5,
	/** Other errors. Mainly occur in SIP call mode. */
	DirectShare_Other_Error: 6,
	/** Wrong meeting ID or sharing key. */
	DirectShare_WrongMeetingID_Or_SharingKey: 7,
	/** Please input new paring code. */
	DirectShare_InputNewParingCode: 8,
	/** Prepare to share data. */
	DirectShare_Prepared: 9
};

/**
 * @alias FreeMeetingNeedUpgradeType
 * @readonly
 * @enum {Number}
 */
const FreeMeetingNeedUpgradeType = {
	/** Initialization. */
	FreeMeetingNeedUpgradeType_NONE: 0,
	/** It is necessary for administrator to upgrade the free meeting. */
	FreeMeetingNeedUpgradeType_BY_ADMIN: 1,
	/** Upgrade the free meeting by the gift link. */
	FreeMeetingNeedUpgradeType_BY_GIFTURL: 2
};

/**
 * @alias AudioType
 * @readonly
 * @enum {Number}
 */
const AudioType = {
	/** Normal audio type. */
	AUDIOTYPE_NONE: 0,
	/** In VoIP mode. */
	AUDIOTYPE_VOIP: 1,
	/** In telephone mode. */
	AUDIOTYPE_PHONE: 2,
	/** Unknown mode. */
	AUDIOTYPE_UNKNOWN: 3
};

/**
 * @alias UserRole
 * @readonly
 * @enum {Number}
 */
const UserRole = {
	/** For initialization. */
	USERROLE_NONE: 0,
	/** Role of the host. */
	USERROLE_HOST: 1,
	/** Role of co-host. */
	USERROLE_COHOST: 2,
	/** Role of the panelist, valid only in webinar. */
	USERROLE_PANELIST: 3,
	/** Host role in breakout room. */
	USERROLE_BREAKOUTROOM_MODERATOR: 4,
	/** Role of attendee. */
	USERROLE_ATTENDEE: 5
};

/**
 * @alias PremeetingAPIResult
 * @readonly
 * @enum {Number}
 */
const PremeetingAPIResult = {
	/** API returns unknown error. */
	PREMETAPIRET_UNKNOW: 0,
	/** Calls API successfully. */
	PREMETAPIRET_SUCCESS: 1
};

/**
 * @alias StatisticsWarningType
 * @readonly
 * @enum {Number}
 */
const StatisticsWarningType = {
	/** No warning. */
	Statistics_Warning_None: 0,
	/** The network connection quality is bad. */
	Statistics_Warning_Network_Quality_Bad: 1,
	/** The system is busy. */
	Statistics_Warning_Busy_System: 2
};

/**
 * @alias AudioShareMode
 * @readonly
 * @enum {Number}
 */
 const AudioShareMode = {
	/** Mono mode. */
	AudioShareMode_Mono: 0,
	/** Stereo mode. */
	AudioShareMode_Stereo: 1
};

/**
 * @alias LiveStreamStatus
 * @readonly
 * @enum {Number}
 */
 const LiveStreamStatus = {
	/** Only for initialization. */
	LiveStreamStatus_None: 0,
	/** In progress. */
	LiveStreamStatus_InProgress: 1,
	/** Be connecting. */
	LiveStreamStatus_Connecting: 2,
	/** Connect timeout. */
	LiveStreamStatus_Start_Failed_Timeout: 3,
	/** Failed to start live streaming. */
	LiveStreamStatus_Start_Failed: 4,
	/** Live stream ends. */
	LiveStreamStatus_Ended: 5
};

/**
 * @alias MeetingReminderType
 * @readonly
 * @enum {Number}
 */
const MeetingReminderType = {
	/** Reminder type of login. */
	TYPE_LOGIN_REQUIRED: 0,
	/** Reminder type of start or join meeting. */
	TYPE_START_OR_JOIN_MEETING: 1,
	/** Reminder type of record reminder. */
	TYPE_RECORD_REMINDER: 2,
	/** Reminder type of record disclaimer. */
	TYPE_RECORD_DISCLAIMER: 3,
	/** Reminder type of live stream disclaimer. */
	TYPE_LIVE_STREAM_DISCLAIMER: 4,
	/** Reminder type of archive disclaimer. */
	TYPE_ARCHIVE_DISCLAIMER: 5,
	/** Reminder type of join webinar as panelist. */
	TYPE_WEBINAR_AS_PANELIST_JOIN: 6,
	/** Reminder type of Terms of service or privacy statement changed. */
	TYPE_TERMS_OF_SERVICE: 7,
	/** Reminder type of smart summary disclaimer. */
	TYPE_SMART_SUMMARY_DISCLAIMER: 8,
	/** Reminder type of smart summary enable request.
	 * @deprecated This type is marked as deprecated. Replaced with callback onSmartSummaryEnableActionCallback
	 */
	TYPE_SMART_SUMMARY_ENABLE_REQUEST_REMINDER: 9,
	/** Reminder type of query disclaimer. */
	TYPE_QUERY_DISCLAIMER: 10,
	/** Reminder type of query enable request.
	 * @deprecated This type is marked as deprecated.
	 */
	TYPE_QUERY_ENABLE_REQUEST_REMINDER: 11,
	/** Reminder type of enable smart summary. 
	 * @deprecated This type is marked as deprecated. Replaced with callback onSmartSummaryEnableActionCallback
	 */
	TYPE_ENABLE_SMART_SUMMARY_REMINDER: 12,
	/** Reminder type of webinar promote attendee. */
	TYPE_WEBINAR_ATTENDEE_PROMOTE_REMINDER: 13,
	/** Reminder type of joining a meeting with private mode. */
	TYPE_JOIN_PRIVATE_MODE_MEETING_REMINDER: 14,
	/** Reminder type to enable smart recording request. 
	 * @deprecated This type is marked as deprecated.
	 */
	TYPE_SMART_RECORDING_ENABLE_REQUEST_REMINDER: 15,
	/** Reminder type to enable smart recording. 
	 * @deprecated This type is marked as deprecated.
	 */
	TYPE_ENABLE_SMART_RECORDING_REMINDER: 16,
	/** Reminder type of AICompanionPlus disclaimer. 
	 * @deprecated This type is marked as Deprecated.
	 */
	TYPE_AI_COMPANION_PLUS_DISCLAIMER: 17,
	/** Reminder type of Close Caption disclaimer. */
	TYPE_CLOSED_CAPTION_DISCLAIMER: 18,
	/** Reminder type of disclaimers combination. */
	TYPE_MULTI_DISCLAIMER: 19,
	/** Reminder type for a join meeting connector with guest mode. */
	TYPE_JOIN_MEETING_CONNECTOR_AS_GUEST_REMINDER: 20,
	/** Reminder type of common disclaimer. */
	TYPE_COMMON_DISCLAIMER: 21,
	/** Reminder type of custom AI companion disclaimer. */
	TYPE_CUSTOM_AI_COMPANION_DISCLAIMER: 22,
	/** Reminder type of AI Companion restrict notify disclaimer. */
	TYPE_AIC_RESTRICT_NOTIFY_DISCLAIMER: 23
};

/**
 * @alias FeatureEnableOption
 * @readonly
 * @enum {Number}
 */
const FeatureEnableOption = {
	/** do not enable. */
	ZNEnableOption_None: 0,
	/** enable for this meeting. */
	ZNEnableOption_Once: 1,
	/** enable for this and all future meetings on this account. */
	ZNEnableOption_Always: 2
}

/**
 * @alias SDKChatPrivilege
 * @readonly
 * @enum {Number}
 */
const SDKChatPrivilege = {
	/** allow attendee to chat with everyone [meeting & webinar]. */
	SDK_CHAT_PRIVILEGE_ALL: 1,
	/** allow attendee to chat with all panelists only, but cannot to "all panelists and attendees" [webinar]. */
	SDK_CHAT_PRIVILEGE_ALL_PANELIST: 2,
	/** allow attendee to chat with host only [meeting]. */
	SDK_CHAT_PRIVILEGE_HOST: 3,
	/** allow attendee to chat with no one [meeting & webinar]. */
	SDK_CHAT_PRIVILEGE_DISABLE_ATTENDEE_CHAT: 4,
	/** allow attendee to chat with host and public [meeting]. */
	SDK_CHAT_PRIVILEGE_HOST_PUBLIC: 5,
	SDK_CHAT_PRIVILEGE_END: 6
}

/**
 * @alias SDKChatMessageType
 * @readonly
 * @enum {Number}
 */
const SDKChatMessageType = {
	/** For initialize. */
	SDKChatMessageType_To_None: 0,
	/** Chat message is send to all. */
	SDKChatMessageType_To_All: 1,
	/** Chat message is send to all panelists. */
	SDKChatMessageType_To_All_Panelist: 2,
	/** Chat message is send to individual attendee and cc panelists. */
	SDKChatMessageType_To_Individual_Panelist: 3,
	/** Chat message is send to individual user. */
	SDKChatMessageType_To_Individual: 4,
	/** Chat message is send to waiting room user. */
	SDKChatMessageType_To_WaitingRoomUsers: 5
}

/**
 * @alias SDKChatMessageDeleteType
 * @readonly
 * @enum {Number}
 */
const SDKChatMessageDeleteType = {
	/** none. */
	SDK_CHAT_DELETE_BY_NONE: 0,
	/** delete by self. */
	SDK_CHAT_DELETE_BY_SELF: 1,
	/** delete by host. */
	SDK_CHAT_DELETE_BY_HOST: 2,
	/** delete by dlp when the message goes against the host organization's compliance policies. */
	SDK_CHAT_DELETE_BY_DLP: 3
}

/**
 * @alias SDKPanelistChatPrivilege
 * @readonly
 * @enum {Number}
 */
const SDKPanelistChatPrivilege = {
	/** Allow panelists only to chat with each other. */
	SDKPanelistChatPrivilege_PanelistOnly: 1,
	/** Allow panelist to chat with everyone. */
	SDKPanelistChatPrivilege_All: 2
}

/**
 * @alias SDKAttendeeViewMode
 * @readonly
 * @enum {Number}
 */
const SDKAttendeeViewMode = {
	/** attendee view display mode is invaild. */
	SDKAttendeeViewMode_None: 0,
	/** follow host. */
	SDKAttendeeViewMode_FollowHost: 1,
	/** always view active speaker. */
	SDKAttendeeViewMode_Speaker: 2,
	/** always view gallery. */
	SDKAttendeeViewMode_Gallery: 3,
	/** attendee can manually switch between gallery and active speaker. */
	SDKAttendeeViewMode_Standard: 4,
	/** attendee view sharing side by side speaker. */
	SDKAttendeeViewMode_SidebysideSpeaker: 5,
	/** attendee view sharing side by side gallery. */
	SDKAttendeeViewMode_SidebysideGallery: 6
}

/**
 * @alias ZoomSDKWallpaperLayoutMode
 * @readonly
 * @enum {Number}
 */
const ZoomSDKWallpaperLayoutMode = {
	ZoomSDKWallpaperLayoutMode_None: 0,
	ZoomSDKWallpaperLayoutMode_Fill: 1,
	ZoomSDKWallpaperLayoutMode_Fit: 2
};

/**
 * @alias ZoomSDKWallpaperSettingStatus
 * @readonly
 * @enum {Number}
 */
const ZoomSDKWallpaperSettingStatus = {
	ZoomSDKWallpaperSettingStatus_None: 0,
	ZoomSDKWallpaperSettingStatus_Downloading: 1,
	ZoomSDKWallpaperSettingStatus_Downloaded: 2,
	ZoomSDKWallpaperSettingStatus_DownloadFail: 3
};

/**
 * @alias VBVideoError
 * @readonly
 * @enum {Number}
 */
const VBVideoError = {
	VB_VideoError_None: 0,
	VB_VideoError_UnknownFormat: 1,
	VB_VideoError_ResolutionHigh1080P: 2,
	VB_VideoError_ResolutionHigh720P: 3,
	VB_VideoError_ResolutionLow: 4,
	VB_VideoError_PlayError: 5,
	VB_VideoError_OpenError: 6
};

/**
 * @alias MeetingAICompanionQuerySettingOptions
 * @readonly
 * @enum {Number}
 */
const MeetingAICompanionQuerySettingOptions = {
	/** Initialization. */
	MeetingAICompanionQuerySettingOptions_None: 0,
	/** Allows all participants and attendee to ask questions about all discussions since AI Companion was active. */
	MeetingAICompanionQuerySettingOptions_WhenQueryStarted: 1,
	/** Allows all participants to ask questions about the discussion since they joined the current meeting. */
	MeetingAICompanionQuerySettingOptions_WhenParticipantsJoin: 2,
	/** Allow only the host, alternative host, and users with host privileges assigned before the meeting starts to ask questions about all discussions since AI Companion is active. */
	MeetingAICompanionQuerySettingOptions_OnlyHost: 3,
	/** Allows only participants and invitees from your organization to ask questions about all discussions since AI Companion was active. */
	MeetingAICompanionQuerySettingOptions_ParticipantsAndInviteesInOurOrganization: 4,
	/** Allows only participants from your organization to ask questions about the discussion since they joined the current meeting. */
	MeetingAICompanionQuerySettingOptions_WhenParticipantsAndOrganizationJoin: 5,
	/** Hosts and all panelists can ask question, and answers are based on the meeting's start until now. */
	MeetingAICompanionQuerySettingOptions_HostAndPanelists: 10,
	/** Hosts and all panelists in our organization can ask question, and answers are based on the meeting's start until now. */
	MeetingAICompanionQuerySettingOptions_HostAndPanelistsInOurOrganization: 11
};

/**
 * @alias MeetingAICompanionQueryFeedbackType
 * @readonly
 * @enum {Number}
 */
const MeetingAICompanionQueryFeedbackType = {
	/** Initialization. */
	MeetingAICompanionQueryFeedbackType_None: 0,
	/** Good. */
	MeetingAICompanionQueryFeedbackType_Good: 1,
	/** Bad. */
	MeetingAICompanionQueryFeedbackType_Bad: 2
};

/**
 * @alias SDKVideoPreferenceMode
 * @readonly
 * @enum {Number}
 */
const SDKVideoPreferenceMode = {
	/** Balance mode. Default Preference, no additional parameters needed. Zoom will do what is best under the current bandwidth situation and make adjustments as needed. */
	SDKVideoPreferenceMode_Balance: 0,
	/** Sharpness mode. Prioritizes a smooth video frame transition by preserving the frame rate as much as possible. */
	SDKVideoPreferenceMode_Sharpness: 1,
	/** Smoothness mode. Prioritizes a sharp video image by preserving the resolution as much as possible. */
	SDKVideoPreferenceMode_Smoothness: 2,
	/** Custom mode. Allows customization by providing the minimum and maximum frame rate. Use this mode if you have an understanding of your network behavior and a clear idea on how to adjust the frame rate to achieve the desired video quality. */
	SDKVideoPreferenceMode_Custom: 3
};

/**
 * @alias SDKEmojiReactionType
 * @readonly
 * @enum {Number}
 */
const SDKEmojiReactionType = {
	ZoomSDKEmojiReactionType_Unknow: 0,
	ZoomSDKEmojiReactionType_Clap: 1,
	ZoomSDKEmojiReactionType_Thumbsup: 2,
	ZoomSDKEmojiReactionType_Heart: 3,
	ZoomSDKEmojiReactionType_Joy: 4,
	ZoomSDKEmojiReactionType_Openmouth: 5,
	ZoomSDKEmojiReactionType_Tada: 6,
}

/**
 * @alias SDKEmojiReactionSkinTone
 * @readonly
 * @enum {Number}
 */
const SDKEmojiReactionSkinTone = {
	/** Do not use any tone. */
	ZoomSDKEmojiReactionSkinTone_Unknow: 0,
	/** Default skin tone. */
	ZoomSDKEmojiReactionSkinTone_Default: 1,
	/** Light skin tone. */
	ZoomSDKEmojiReactionSkinTone_Light: 2,
	/** Medium light skin tone. */
	ZoomSDKEmojiReactionSkinTone_MediumLight: 3,
	/** Medium skin tone. */
	ZoomSDKEmojiReactionSkinTone_Medium: 4,
	/** Medium dark skin tone. */
	ZoomSDKEmojiReactionSkinTone_MediumDark: 5,
	/** Dark skin tone. */
	ZoomSDKEmojiReactionSkinTone_Dark: 6,
}

/**
 * @alias CannotShareReasonType
 * @readonly
 * @enum {Number}
 */
const CannotShareReasonType = {
    /** For initialization. */
    CannotShareReasonType_None: 0,
    /** Only the host can share. */
    CannotShareReasonType_Locked: 1,
    /** Sharing is disabled. */
    CannotShareReasonType_Disabled: 2,
    /** Another is sharing their screen. */
    CannotShareReasonType_Other_Screen_Sharing: 3,
    /** Another is sharing their whiteboard. */
    CannotShareReasonType_Other_WB_Sharing: 4,
    /** The user is sharing their screen, and can grab. To grab, call EnableGrabShareWithoutReminder(true) before starting share. */
    CannotShareReasonType_Need_Grab_Myself_Screen_Sharing: 5,
    /** Another is sharing their screen, and can grab. To grab, call EnableGrabShareWithoutReminder(true) before starting share. */
    CannotShareReasonType_Need_Grab_Other_Screen_Sharing: 6,
    /** Another is sharing pure computer audio, and can grab. To grab, call EnableGrabShareWithoutReminder(true) before starting share. */
    CannotShareReasonType_Need_Grab_Audio_Sharing: 7,
    /** Other or myself is sharing whiteboard, and can Grab. To grab, call EnableGrabShareWithoutReminder(true) before starting share. */
    CannotShareReasonType_Need_Grap_WB_Sharing: 8,
    /** The meeting has reached the maximum allowed screen share sessions. */
    CannotShareReasonType_Reach_Maximum: 9,
    /** Other share screen in main session. */
    CannotShareReasonType_Have_Share_From_Mainsession: 10,
	/** Another participant is sharing their zoom docs. */
    CannotShareReasonType_Other_DOCS_Sharing: 11,
	/** Other or myself is sharing docs, and can grab. To grab, call EnableGrabShareWithoutReminder(true) before starting share. */
    CannotShareReasonType_Need_Grab_DOCS_Sharing: 12,
    /** UnKnown reason. */
    CannotShareReasonType_UnKnown: 13
};

/**
 * @alias SDKWhiteboardShareOption
 * @readonly
 * @enum {Number}
 */
const SDKWhiteboardShareOption = {
    /** Only the host can share a whiteboard. */
    SDKWhiteboardShareOption_HostShare: 0,
    /** Anyone can share a whiteboard, but only one can share at a time, and only the host can take another's sharing role. */
    SDKWhiteboardShareOption_HostGrabShare: 1,
    /** Anyone can share a whiteboard, but only one can share at a time, and anyone can take another's sharing role. */
    SDKWhiteboardShareOption_AllGrabShare: 2
};

/**
 * @alias SDKWhiteboardCreateOption
 * @readonly
 * @enum {Number}
 */
const SDKWhiteboardCreateOption = {
    /** Only the host can initiate a new whiteboard. */
    SDKWhiteboardCreateOption_HostOnly: 0,
    /** Users under the same account as the meeting owner can initiate a new whiteboard. */
    SDKWhiteboardCreateOption_AccountUsers: 1,
    /** All participants can initiate a new whiteboard. */
    SDKWhiteboardCreateOption_All: 2
};

/**
 * @alias SDKWhiteboardStatus
 * @readonly
 * @enum {Number}
 */
const SDKWhiteboardStatus = {
    /** User stared sharing their whiteboard. */
    SDKWhiteboardStatus_Started: 0,
    /** User stopped sharing their whiteboard. */
    SDKWhiteboardStatus_Stopped: 1
};

/**
 * @alias SDKDocsStatus
 * @readonly
 * @enum {Number}
 */
const SDKDocsStatus = {
    SDKDocsStatus_None: 0,
    /** User starts sharing docs. */
    SDKDocsStatus_Start: 1,
    /** User stops sharing docs. */
    SDKDocsStatus_Stop: 2
};

/**
 * @alias SDKDocsShareOption
 * @readonly
 * @enum {Number}
 */
const SDKDocsShareOption = {
    /** A wrong option, such as the meeting not supporting docs. */
    SDKDocsShareOption_None: 0,
    /** Only host can share docs. */
    SDKDocsShareOption_HostShare: 1,
    /** Anyone can share docs, but only one doc can be shared at a time, and only host can take over another's sharing. */
    SDKDocsShareOption_HostGrabShare: 2,
    /** Anyone can share docs, but only one doc can be shared at a time, and anyone can take over another's sharing. */
    SDKDocsShareOption_AllGrabShare: 3
};

/**
 * @alias SDKDocsCreateOption
 * @readonly
 * @enum {Number}
 */
const SDKDocsCreateOption = {
    /** A wrong option, maybe the meeting does not support docs. */
    SDKDocsCreateOption_None: 0,
    /** Only the host can initiate new docs. */
    SDKDocsCreateOption_HostOnly: 1,
    /** Users under the same account can initiate new docs. */
    SDKDocsCreateOption_AccountUsers: 2,
    /** All participants can initiate new docs. */
    SDKDocsCreateOption_All: 3
};

module.exports = {
	ZOOM_TYPE_OS_TYPE,
	ZoomSDK_LANGUAGE_ID,
	ZoomSDKError,
	ZoomAPPLocale,
	ZoomAuthResult,
	ZoomLanguageType,
	ZoomLoginStatus,
	ZoomLoginType,
	ZoomMeetingStatus,
	ZoomSDKUserType,
	ZoomUserType,
	LeaveMeetingCmd,
	MeetingType,
	ZoomMeetingFailCode,
	MeetingEndReason,
	ZoomMeetingUIFloatVideoType,
	SDKViewType,
	ZoomMeetingButtonType,
	ZoomMeetingUIViewType,
	ZoomAnnotationToolType,
	ZoomAnnotationClearType,
	AudioStatus,
	VideoStatus,
	ConnectionQuality,
	MeetingComponentType,
	H323DeviceType,
	H323CalloutStatus,
	RawDataMemoryMode,
	RawDataResolution,
	SDKRawDataError,
	ShareStatus,
	SettingTabPage,
	SDKMinimizeUIMode,
	SMSVerificationCodeErr,
	SDKInviteDlgTabPage,
	SDKH323TabPage,
	SettingsNetWorkType,
	SettingConnectionType,
	SDKCustomizedStringType,
	SDKCustomizedURLType,
	RequiredInfoType,
	WebinarNeedRegisterType,
	AudioCallbackActionInfo,
	RecordingStatus,
	RequestStartCloudRecordingStatus,
	SDKUserInfoType,
	CustomizedLanguageType,
	ZoomSDKRawDataType,
	RawDataStatus,
	ZoomSDKVideoRenderMode,
	SDKRawDataMemoryMode,
	ZoomSDKVideoSubscribeFailReason,
	ZoomSDKVideoCaptureMethod,
	ZoomSDKRenderPostProcessing,
	ZoomSDKVideoHardwareEncodeType,
	ZoomSDKEchoCancelLationLevel,
	LoginFailReason,
	DirectShareStatus,
	FreeMeetingNeedUpgradeType,
	AudioType,
	UserRole,
	PremeetingAPIResult,
	StatisticsWarningType,
	AudioShareMode,
	LiveStreamStatus,
	MeetingReminderType,
	FeatureEnableOption,
	SDKChatPrivilege,
	SDKChatMessageType,
	SDKChatMessageDeleteType,
	SDKPanelistChatPrivilege,
	SDKAttendeeViewMode,
	ZoomSDKWallpaperLayoutMode,
	ZoomSDKWallpaperSettingStatus,
	VBVideoError,
	MeetingAICompanionQuerySettingOptions,
	MeetingAICompanionQueryFeedbackType,
	SDKVideoPreferenceMode,
	SDKEmojiReactionType,
	SDKEmojiReactionSkinTone,
	CannotShareReasonType,
	SDKWhiteboardShareOption,
	SDKWhiteboardCreateOption,
	SDKWhiteboardStatus,
	SDKDocsStatus,
	SDKDocsShareOption,
	SDKDocsCreateOption
};
