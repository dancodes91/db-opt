"""
Setup script for Zoom SDK Python bindings
"""
from pybind11.setup_helpers import Pybind11Extension, build_ext
from pybind11 import get_cmake_dir
import pybind11
from setuptools import setup, Extension
import os
import sys
from pathlib import Path

# Get SDK paths
sdk_root = Path(__file__).parent.parent / "sdk" / "zoom-sdk-windows-6.7.2.26830" / "x64"
sdk_include = str(sdk_root / "h")
sdk_lib = str(sdk_root / "lib")
sdk_bin = str(sdk_root / "bin")

# Define include directories
# Note: Order matters - src directory first (for sdk_common.h), then SDK headers
bindings_src = Path(__file__).parent / "src"
include_dirs = [
    str(bindings_src),  # For sdk_common.h
    sdk_include,
    str(Path(sdk_include) / "meeting_service_components"),
    str(Path(sdk_include) / "rawdata"),
    str(Path(sdk_include) / "customized_ui"),
    pybind11.get_include(),
]

# Define library directories
library_dirs = [sdk_lib, sdk_bin]

# Define macros
define_macros = [
    ("WIN32", None),  # Define WIN32 for Windows platform detection
    ("ZOOM_SDK_DLL_IMPORT", None),
    ("VERSION_INFO", '"dev"')
]

# Source files
sources = [
    "src/module.cpp",
    "src/zoom_sdk_binding.cpp",
    "src/auth_service_binding.cpp",
    "src/meeting_service_binding.cpp",
    "src/participants_binding.cpp",
    "src/sharing_binding.cpp",
    "src/configuration_binding.cpp",
    "src/callbacks.cpp",
]

ext_modules = [
    Pybind11Extension(
        "zoom_sdk_bindings",
        sources,
        include_dirs=include_dirs,
        library_dirs=library_dirs,
        libraries=["sdk"],
        define_macros=define_macros,
        language="c++",
        cxx_std=17,
    ),
]

setup(
    name="zoom_sdk_bindings",
    ext_modules=ext_modules,
    cmdclass={"build_ext": build_ext},
    zip_safe=False,
    python_requires=">=3.10",
)
