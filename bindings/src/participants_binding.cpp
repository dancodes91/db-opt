#include "sdk_common.h"  // Windows.h first, then SDK headers
#include <pybind11/pybind11.h>
#include <pybind11/stl.h>
// Include meeting_audio_interface.h before meeting_participants_ctrl_interface.h
// because participants interface uses AudioType enum defined in audio interface
#include "meeting_service_components/meeting_audio_interface.h"
#include "meeting_service_components/meeting_participants_ctrl_interface.h"
#include "callbacks.h"

namespace py = pybind11;
using namespace ZOOM_SDK_NAMESPACE;

void init_participants_binding(py::module_ &m) {
    // Bind IUserInfo interface
    py::class_<IUserInfo>(m, "IUserInfo")
        .def("GetUserID", &IUserInfo::GetUserID, "Get user ID")
        .def("GetUserName", &IUserInfo::GetUserName, "Get user name")
        .def("IsMySelf", &IUserInfo::IsMySelf, "Check if this is myself")
        .def("IsHost", &IUserInfo::IsHost, "Check if user is host")
        .def("IsVideoOn", &IUserInfo::IsVideoOn, "Check if video is on")
        .def("IsAudioMuted", &IUserInfo::IsAudioMuted, "Check if audio is muted");

    // Bind IList template for participants
    py::class_<IList<unsigned int>>(m, "IListUInt")
        .def("GetCount", &IList<unsigned int>::GetCount, "Get count")
        .def("GetItem", &IList<unsigned int>::GetItem, py::arg("index"), "Get item at index");

    // Bind IMeetingParticipantsController interface
    py::class_<IMeetingParticipantsController>(m, "IMeetingParticipantsController")
        .def("GetParticipantsList", [](IMeetingParticipantsController& self) {
            IList<unsigned int>* lst = self.GetParticipantsList();
            if (!lst) return std::vector<unsigned int>();
            std::vector<unsigned int> result;
            int count = lst->GetCount();
            for (int i = 0; i < count; i++) {
                result.push_back(lst->GetItem(i));
            }
            return result;
        }, "Get participants list")
        .def("GetUserByUserID", [](IMeetingParticipantsController& self, unsigned int userId) {
            return self.GetUserByUserID(userId);
        }, py::arg("userId"), py::return_value_policy::reference, "Get user info by ID")
        .def("GetMySelfUser", [](IMeetingParticipantsController& self) {
            return self.GetMySelfUser();
        }, py::return_value_policy::reference, "Get myself user")
        .def("SetEvent", [](IMeetingParticipantsController& self, ParticipantsCtrlEventCallbacks* pEvent) {
            return self.SetEvent(pEvent);
        }, py::arg("pEvent"), "Set event callbacks");
}
