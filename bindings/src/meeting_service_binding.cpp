#include "sdk_common.h"  // Windows.h first, then SDK headers
#include <pybind11/pybind11.h>
#include <pybind11/stl.h>
#include "meeting_service_interface.h"
#include "callbacks.h"

namespace py = pybind11;
using namespace ZOOM_SDK_NAMESPACE;

void init_meeting_service_binding(py::module_ &m) {
    // Bind MeetingStatus enum
    py::enum_<MeetingStatus>(m, "MeetingStatus")
        .value("MEETING_STATUS_IDLE", MEETING_STATUS_IDLE)
        .value("MEETING_STATUS_CONNECTING", MEETING_STATUS_CONNECTING)
        .value("MEETING_STATUS_WAITINGFORHOST", MEETING_STATUS_WAITINGFORHOST)
        .value("MEETING_STATUS_INMEETING", MEETING_STATUS_INMEETING)
        .value("MEETING_STATUS_DISCONNECTING", MEETING_STATUS_DISCONNECTING)
        .value("MEETING_STATUS_RECONNECTING", MEETING_STATUS_RECONNECTING)
        .value("MEETING_STATUS_FAILED", MEETING_STATUS_FAILED)
        .value("MEETING_STATUS_ENDED", MEETING_STATUS_ENDED)
        .value("MEETING_STATUS_UNKNOWN", MEETING_STATUS_UNKNOWN)
        .export_values();

    // Bind JoinParam4WithoutLogin struct
    py::class_<JoinParam4WithoutLogin>(m, "JoinParam4WithoutLogin")
        .def(py::init<>())
        .def_readwrite("meetingNumber", &JoinParam4WithoutLogin::meetingNumber)
        .def_readwrite("userName", &JoinParam4WithoutLogin::userName)
        .def_readwrite("psw", &JoinParam4WithoutLogin::psw)
        .def_readwrite("isVideoOff", &JoinParam4WithoutLogin::isVideoOff)
        .def_readwrite("isAudioOff", &JoinParam4WithoutLogin::isAudioOff)
        .def_readwrite("isDirectShareDesktop", &JoinParam4WithoutLogin::isDirectShareDesktop);

    // Bind JoinParam struct
    // Note: param is a union, so we need to use property getter/setter to access union members
    py::class_<JoinParam>(m, "JoinParam")
        .def(py::init<>())
        .def_readwrite("userType", &JoinParam::userType)
        .def_property("withoutloginuserJoin", 
            [](JoinParam& self) -> JoinParam4WithoutLogin& {
                return self.param.withoutloginuserJoin;
            },
            [](JoinParam& self, const JoinParam4WithoutLogin& value) {
                self.param.withoutloginuserJoin = value;
            },
            "Access withoutloginuserJoin union member");

    // Bind SDKUserType enum
    py::enum_<SDKUserType>(m, "SDKUserType")
        .value("SDK_UT_NORMALUSER", SDK_UT_NORMALUSER)
        .value("SDK_UT_WITHOUT_LOGIN", SDK_UT_WITHOUT_LOGIN)
        .export_values();

    // Bind IMeetingService interface
    py::class_<IMeetingService>(m, "IMeetingService")
        .def("Join", [](IMeetingService& self, JoinParam& param) {
            return self.Join(param);
        }, py::arg("param"), "Join meeting")
        .def("Leave", [](IMeetingService& self, LeaveMeetingCmd cmd) {
            return self.Leave(cmd);
        }, py::arg("cmd"), "Leave meeting")
        .def("GetMeetingStatus", &IMeetingService::GetMeetingStatus, "Get meeting status")
        .def("SetEvent", [](IMeetingService& self, MeetingServiceEventCallbacks* pEvent) {
            return self.SetEvent(pEvent);
        }, py::arg("pEvent"), "Set event callbacks")
        .def("GetMeetingParticipantsController", [](IMeetingService& self) {
            return self.GetMeetingParticipantsController();
        }, py::return_value_policy::reference, "Get participants controller")
        .def("GetMeetingShareController", [](IMeetingService& self) {
            return self.GetMeetingShareController();
        }, py::return_value_policy::reference, "Get sharing controller")
        .def("GetMeetingConfiguration", [](IMeetingService& self) {
            return self.GetMeetingConfiguration();
        }, py::return_value_policy::reference, "Get meeting configuration");
}
