cmake_minimum_required(VERSION 3.15)
project(zoom_sdk_bindings LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Find Python and pybind11
find_package(Python 3.10 REQUIRED COMPONENTS Interpreter Development)
find_package(pybind11 REQUIRED)

# Windows SDK paths
set(ZOOM_SDK_ROOT "${CMAKE_SOURCE_DIR}/../sdk/zoom-sdk-windows-6.7.2.26830/x64")
set(ZOOM_SDK_INCLUDE "${ZOOM_SDK_ROOT}/h")
set(ZOOM_SDK_LIB "${ZOOM_SDK_ROOT}/lib")
set(ZOOM_SDK_BIN "${ZOOM_SDK_ROOT}/bin")

# Link directories
link_directories(${ZOOM_SDK_LIB})
link_directories(${ZOOM_SDK_BIN})

# Define SDK import and Windows platform
add_definitions(-DWIN32 -DZOOM_SDK_DLL_IMPORT)

# Create Python module
pybind11_add_module(zoom_sdk_bindings
    src/module.cpp
    src/zoom_sdk_binding.cpp
    src/auth_service_binding.cpp
    src/meeting_service_binding.cpp
    src/participants_binding.cpp
    src/sharing_binding.cpp
    src/configuration_binding.cpp
    src/callbacks.cpp
)

# Set include directories - src directory first (for sdk_common.h), then SDK headers
target_include_directories(zoom_sdk_bindings PRIVATE
    ${CMAKE_CURRENT_SOURCE_DIR}/src  # For sdk_common.h
    ${ZOOM_SDK_INCLUDE}
    ${ZOOM_SDK_INCLUDE}/meeting_service_components
    ${ZOOM_SDK_INCLUDE}/rawdata
    ${ZOOM_SDK_INCLUDE}/customized_ui
)

# Set compiler-specific options for Windows
if(WIN32)
    target_compile_definitions(zoom_sdk_bindings PRIVATE WIN32_LEAN_AND_MEAN)
endif()

# Link against SDK library
target_link_libraries(zoom_sdk_bindings PRIVATE
    ${ZOOM_SDK_LIB}/sdk.lib
    pybind11::module
)

# Copy DLLs to output directory
add_custom_command(TARGET zoom_sdk_bindings POST_BUILD
    COMMAND ${CMAKE_COMMAND} -E copy_directory
    ${ZOOM_SDK_BIN} $<TARGET_FILE_DIR:zoom_sdk_bindings>
)

# Set output directory
set_target_properties(zoom_sdk_bindings PROPERTIES
    LIBRARY_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}
    RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}
)
