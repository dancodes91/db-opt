#ifndef CALLBACKS_H
#define CALLBACKS_H

#include "sdk_common.h"  // Includes Windows.h first, then SDK base headers

#include <functional>
#include <vector>
#include "auth_service_interface.h"
#include "meeting_service_interface.h"
// Include meeting_audio_interface.h before meeting_participants_ctrl_interface.h
// because participants interface uses AudioType enum defined in audio interface
#include "meeting_service_components/meeting_audio_interface.h"
#include "meeting_service_components/meeting_participants_ctrl_interface.h"
#include "meeting_service_components/meeting_sharing_interface.h"
#include "meeting_service_components/meeting_configuration_interface.h"

namespace ZOOM_SDK_NAMESPACE {

// Auth Service Event Callbacks
class AuthServiceEventCallbacks : public IAuthServiceEvent {
public:
    std::function<void(AuthResult)> onAuthCallback;
    std::function<void()> onIdentityExpiredCallback;

    void onAuthenticationReturn(AuthResult ret) override {
        if (onAuthCallback) onAuthCallback(ret);
    }

    void onZoomIdentityExpired() override {
        if (onIdentityExpiredCallback) onIdentityExpiredCallback();
    }

    void onLoginReturnWithReason(LOGINSTATUS ret, IAccountInfo* pAccountInfo, LoginFailReason reason) override {}
    void onLogout() override {}
    void onZoomAuthIdentityExpired() override {}
#ifdef WIN32
    void onNotificationServiceStatus(SDKNotificationServiceStatus status, SDKNotificationServiceError error) override {}
#endif
};

// Meeting Service Event Callbacks - only implement methods that exist in IMeetingServiceEvent
class MeetingServiceEventCallbacks : public IMeetingServiceEvent {
public:
    std::function<void(MeetingStatus, int)> onStatusChangedCallback;

    void onMeetingStatusChanged(MeetingStatus status, int iResult = 0) override {
        if (onStatusChangedCallback) onStatusChangedCallback(status, iResult);
    }

    // Required implementations - only methods that exist in IMeetingServiceEvent
    void onMeetingStatisticsWarningNotification(StatisticsWarningType type) override {}
    void onMeetingParameterNotification(const MeetingParameter* meeting_param) override {}
    void onSuspendParticipantsActivities() override {}
    void onAICompanionActiveChangeNotice(bool bActive) override {}
    void onMeetingTopicChanged(const zchar_t* sTopic) override {}
    void onMeetingFullToWatchLiveStream(const zchar_t* sLiveStreamUrl) override {}
    void onUserNetworkStatusChanged(MeetingComponentType type, ConnectionQuality level, unsigned int userId, bool uplink) override {}
#ifdef WIN32
    void onAppSignalPanelUpdated(IMeetingAppSignalHandler* pHandler) override {}
#endif
};

// Participants Controller Event Callbacks - use correct signatures
class ParticipantsCtrlEventCallbacks : public IMeetingParticipantsCtrlEvent {
public:
    std::function<void(IList<unsigned int>*, const zchar_t*)> onUserJoinCallback;
    std::function<void(IList<unsigned int>*, const zchar_t*)> onUserLeftCallback;

    void onUserJoin(IList<unsigned int>* lstUserID, const zchar_t* strUserList = nullptr) override {
        if (onUserJoinCallback) onUserJoinCallback(lstUserID, strUserList);
    }

    void onUserLeft(IList<unsigned int>* lstUserID, const zchar_t* strUserList = nullptr) override {
        if (onUserLeftCallback) onUserLeftCallback(lstUserID, strUserList);
    }

    // Required empty implementations
    void onHostChangeNotification(unsigned int userId) override {}
    void onLowOrRaiseHandStatusChanged(bool bLow, unsigned int userid) override {}
    void onUserNamesChanged(IList<unsigned int>* lstUserID) override {}
    void onCoHostChangeNotification(unsigned int userId, bool isCoHost) override {}
    void onInvalidReclaimHostkey() override {}
    void onAllHandsLowered() override {}
    void onLocalRecordingStatusChanged(unsigned int user_id, RecordingStatus status) override {}
    void onAllowParticipantsRenameNotification(bool bAllow) override {}
    void onAllowParticipantsUnmuteSelfNotification(bool bAllow) override {}
    void onAllowParticipantsStartVideoNotification(bool bAllow) override {}
    void onAllowParticipantsShareWhiteBoardNotification(bool bAllow) override {}
    void onRequestLocalRecordingPrivilegeChanged(LocalRecordingRequestPrivilegeStatus status) override {}
    void onAllowParticipantsRequestCloudRecording(bool bAllow) override {}
    void onInMeetingUserAvatarPathUpdated(unsigned int userID) override {}
    void onParticipantProfilePictureStatusChange(bool bHidden) override {}
    void onFocusModeStateChanged(bool bEnabled) override {}
    void onFocusModeShareTypeChanged(FocusModeShareType type) override {}
    void onBotAuthorizerRelationChanged(unsigned int authorizeUserID) override {}
    void onVirtualNameTagStatusChanged(bool bOn, unsigned int userID) override {}
    void onVirtualNameTagRosterInfoUpdated(unsigned int userID) override {}
#ifdef WIN32
    void onCreateCompanionRelation(unsigned int parentUserID, unsigned int childUserID) override {}
    void onRemoveCompanionRelation(unsigned int childUserID) override {}
#endif
    void onGrantCoOwnerPrivilegeChanged(bool canGrantOther) override {}
};

// Sharing Controller Event Callbacks
class SharingCtrlEventCallbacks : public IMeetingShareCtrlEvent {
public:
    std::function<void(ZoomSDKSharingSourceInfo)> onSharingStatusChangedCallback;

    void onSharingStatus(ZoomSDKSharingSourceInfo shareInfo) override {
        if (onSharingStatusChangedCallback) {
            // Extract status and userId from shareInfo
            onSharingStatusChangedCallback(shareInfo);
        }
    }

    // Required empty implementations
    void onFailedToStartShare() override {}
    void onLockShareStatus(bool bLocked) override {}
    void onShareContentNotification(ZoomSDKSharingSourceInfo shareInfo) override {}
    void onMultiShareSwitchToSingleShareNeedConfirm(IShareSwitchMultiToSingleConfirmHandler* handler_) override {}
    void onShareSettingTypeChangedNotification(ShareSettingType type) override {}
    void onSharedVideoEnded() override {}
    void onVideoFileSharePlayError(ZoomSDKVideoFileSharePlayError error) override {}
    void onOptimizingShareForVideoClipStatusChanged(ZoomSDKSharingSourceInfo shareInfo) override {}
};

} // namespace ZOOM_SDK_NAMESPACE

#endif // CALLBACKS_H
