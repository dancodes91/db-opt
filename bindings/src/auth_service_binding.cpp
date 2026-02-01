#include "sdk_common.h"  // Windows.h first, then SDK headers
#include <pybind11/pybind11.h>
#include <pybind11/stl.h>
#include "auth_service_interface.h"
#include "callbacks.h"

namespace py = pybind11;
using namespace ZOOM_SDK_NAMESPACE;

void init_auth_service_binding(py::module_ &m) {
    // Bind AuthResult enum
    py::enum_<AuthResult>(m, "AuthResult")
        .value("AUTHRET_SUCCESS", AUTHRET_SUCCESS)
        .value("AUTHRET_KEYORSECRETEMPTY", AUTHRET_KEYORSECRETEMPTY)
        .value("AUTHRET_KEYORSECRETWRONG", AUTHRET_KEYORSECRETWRONG)
        .value("AUTHRET_ACCOUNTNOTSUPPORT", AUTHRET_ACCOUNTNOTSUPPORT)
        .value("AUTHRET_ACCOUNTNOTENABLESDK", AUTHRET_ACCOUNTNOTENABLESDK)
        .value("AUTHRET_UNKNOWN", AUTHRET_UNKNOWN)
        .value("AUTHRET_SERVICE_BUSY", AUTHRET_SERVICE_BUSY)
        .value("AUTHRET_NONE", AUTHRET_NONE)
        .value("AUTHRET_OVERTIME", AUTHRET_OVERTIME)
        .value("AUTHRET_NETWORKISSUE", AUTHRET_NETWORKISSUE)
        .value("AUTHRET_CLIENT_INCOMPATIBLE", AUTHRET_CLIENT_INCOMPATIBLE)
        .value("AUTHRET_JWTTOKENWRONG", AUTHRET_JWTTOKENWRONG)
        .value("AUTHRET_LIMIT_EXCEEDED_EXCEPTION", AUTHRET_LIMIT_EXCEEDED_EXCEPTION)
        .export_values();

    // Bind AuthContext struct
    py::class_<AuthContext>(m, "AuthContext")
        .def(py::init<>())
        .def_readwrite("jwt_token", &AuthContext::jwt_token);

    // Bind IAuthService interface
    py::class_<IAuthService>(m, "IAuthService")
        .def("SDKAuth", [](IAuthService& self, AuthContext& authContext) {
            return self.SDKAuth(authContext);
        }, py::arg("authContext"), "Authenticate with JWT")
        .def("GetAuthResult", &IAuthService::GetAuthResult, "Get authentication result")
        .def("SetEvent", [](IAuthService& self, AuthServiceEventCallbacks* pEvent) {
            return self.SetEvent(pEvent);
        }, py::arg("pEvent"), "Set event callbacks");
}
