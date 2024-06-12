"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var ImGui = require("imgui-js");
var ImGui_Impl = require("./imgui_impl.js");
var imgui_demo_js_1 = require("./imgui_demo.js");
var imgui_memory_editor_js_1 = require("./imgui_memory_editor.js");
var font = null;
// Our state
var show_demo_window = false;
var show_another_window = false;
var background_colour = new ImGui.Vec4(0.6, 0.1, 0.0, 1.00);
var memory_editor = new imgui_memory_editor_js_1.MemoryEditor();
memory_editor.Open = false;
var show_sandbox_window = false;
var show_gamepad_window = false;
var show_movie_window = false;
/* static */ var f = 0.0;
/* static */ var counter = 0;
var done = false;
function LoadArrayBuffer(url) {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch(url)];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response.arrayBuffer()];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        function _main() {
            return __awaiter(this, void 0, void 0, function () {
                var i;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, _init()];
                        case 1:
                            _a.sent();
                            for (i = 0; i < 3; ++i) {
                                _loop(1 / 60);
                            }
                            return [4 /*yield*/, _done()];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ImGui.default()];
                case 1:
                    _a.sent();
                    if (typeof (window) !== "undefined") {
                        window.requestAnimationFrame(_init);
                    }
                    else {
                        _main().catch(console.error);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.default = main;
function AddFontFromFileTTF(url_1, size_pixels_1) {
    return __awaiter(this, arguments, void 0, function (url, size_pixels, font_cfg, glyph_ranges) {
        var _a, _b;
        if (font_cfg === void 0) { font_cfg = null; }
        if (glyph_ranges === void 0) { glyph_ranges = null; }
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    font_cfg = font_cfg || new ImGui.FontConfig();
                    font_cfg.Name = font_cfg.Name || "".concat(url.split(/[\\\/]/).pop(), ", ").concat(size_pixels.toFixed(0), "px");
                    _b = (_a = ImGui.GetIO().Fonts).AddFontFromMemoryTTF;
                    return [4 /*yield*/, LoadArrayBuffer(url)];
                case 1: return [2 /*return*/, _b.apply(_a, [_c.sent(), size_pixels, font_cfg, glyph_ranges])];
            }
        });
    });
}
function _init() {
    return __awaiter(this, void 0, void 0, function () {
        var EMSCRIPTEN_VERSION, io, output, canvas;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    EMSCRIPTEN_VERSION = "".concat(ImGui.bind.__EMSCRIPTEN_major__, ".").concat(ImGui.bind.__EMSCRIPTEN_minor__, ".").concat(ImGui.bind.__EMSCRIPTEN_tiny__);
                    console.log("Emscripten Version", EMSCRIPTEN_VERSION);
                    console.log("Total allocated space (uordblks) @ _init:", ImGui.bind.mallinfo().uordblks);
                    // Setup Dear ImGui context
                    ImGui.CHECKVERSION();
                    ImGui.CreateContext();
                    io = ImGui.GetIO();
                    //io.ConfigFlags |= ImGui.ConfigFlags.NavEnableKeyboard;     // Enable Keyboard Controls
                    //io.ConfigFlags |= ImGui.ConfigFlags.NavEnableGamepad;      // Enable Gamepad Controls
                    // Setup Dear ImGui style
                    ImGui.StyleColorsDark();
                    //ImGui.StyleColorsClassic();
                    // Load Fonts
                    // - If no fonts are loaded, dear imgui will use the default font. You can also load multiple fonts and use ImGui::PushFont()/PopFont() to select them.
                    // - AddFontFromFileTTF() will return the ImFont* so you can store it if you need to select the font among multiple.
                    // - If the file cannot be loaded, the function will return NULL. Please handle those errors in your application (e.g. use an assertion, or display an error and quit).
                    // - The fonts will be rasterized at a given size (w/ oversampling) and stored into a texture when calling ImFontAtlas::Build()/GetTexDataAsXXXX(), which ImGui_ImplXXXX_NewFrame below will call.
                    // - Read 'docs/FONTS.md' for more instructions and details.
                    // - Remember that in C/C++ if you want to include a backslash \ in a string literal you need to write a double backslash \\ !
                    io.Fonts.AddFontDefault();
                    return [4 /*yield*/, AddFontFromFileTTF("../imgui/misc/fonts/Roboto-Medium.ttf", 16.0)];
                case 1:
                    font = _a.sent();
                    // font = await AddFontFromFileTTF("../imgui/misc/fonts/Cousine-Regular.ttf", 15.0);
                    // font = await AddFontFromFileTTF("../imgui/misc/fonts/DroidSans.ttf", 16.0);
                    // font = await AddFontFromFileTTF("../imgui/misc/fonts/ProggyTiny.ttf", 10.0);
                    // font = await AddFontFromFileTTF("c:\\Windows\\Fonts\\ArialUni.ttf", 18.0, null, io.Fonts.GetGlyphRangesJapanese());
                    // font = await AddFontFromFileTTF("https://raw.githubusercontent.com/googlei18n/noto-cjk/master/NotoSansJP-Regular.otf", 18.0, null, io.Fonts.GetGlyphRangesJapanese());
                    ImGui.ASSERT(font !== null);
                    // Setup Platform/Renderer backends
                    // ImGui_ImplSDL2_InitForOpenGL(window, gl_context);
                    // ImGui_ImplOpenGL3_Init(glsl_version);
                    if (typeof (window) !== "undefined") {
                        output = document.getElementById("output") || document.body;
                        canvas = document.createElement("canvas");
                        output.appendChild(canvas);
                        canvas.tabIndex = 1;
                        canvas.style.position = "absolute";
                        canvas.style.left = "0px";
                        canvas.style.right = "0px";
                        canvas.style.top = "0px";
                        canvas.style.bottom = "0px";
                        canvas.style.width = "100%";
                        canvas.style.height = "100%";
                        canvas.style.userSelect = "none";
                        ImGui_Impl.Init(canvas);
                    }
                    else {
                        ImGui_Impl.Init(null);
                    }
                    StartUpImage();
                    StartUpVideo();
                    if (typeof (window) !== "undefined") {
                        window.requestAnimationFrame(_loop);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
// Main loop
function _loop(time) {
    // Poll and handle events (inputs, window resize, etc.)
    // You can read the io.WantCaptureMouse, io.WantCaptureKeyboard flags to tell if dear imgui wants to use your inputs.
    // - When io.WantCaptureMouse is true, do not dispatch mouse input data to your main application.
    // - When io.WantCaptureKeyboard is true, do not dispatch keyboard input data to your main application.
    // Generally you may always pass all inputs to dear imgui, and hide them from your application based on those two flags.
    // Start the Dear ImGui frame
    ImGui_Impl.NewFrame(time);
    ImGui.NewFrame();
    // 1. Show the big demo window (Most of the sample code is in ImGui::ShowDemoWindow()! You can browse its code to learn more about Dear ImGui!).
    if (!done && show_demo_window) {
        done = (0, imgui_demo_js_1.ShowDemoWindow)(function (value) {
            if (value === void 0) { value = show_demo_window; }
            return show_demo_window = value;
        });
    }
    // default window
    {
        ImGui.Begin("welcome to hell");
        ImGui.Text("weclome");
        ImGui.Checkbox("demo", function (value) {
            if (value === void 0) { value = show_demo_window; }
            return show_demo_window = value;
        });
        ImGui.Checkbox("another", function (value) {
            if (value === void 0) { value = show_another_window; }
            return show_another_window = value;
        });
        ImGui.SliderFloat("float", function (value) {
            if (value === void 0) { value = f; }
            return f = value;
        }, 0.0, 1.0);
        if (ImGui.Button("Button"))
            counter++;
        ImGui.SameLine();
        ImGui.Text("counter = ".concat(counter));
        ImGui.Text("Application average ".concat((1000.0 / ImGui.GetIO().Framerate).toFixed(3), " ms/frame (").concat(ImGui.GetIO().Framerate.toFixed(1), " FPS)"));
        ImGui.Checkbox("Memory Editor", function (value) {
            if (value === void 0) { value = memory_editor.Open; }
            return memory_editor.Open = value;
        });
        if (memory_editor.Open)
            memory_editor.DrawWindow("Memory Editor", ImGui.bind.HEAP8.buffer);
        var mi = ImGui.bind.mallinfo();
        // ImGui.Text(`Total non-mmapped bytes (arena):       ${mi.arena}`);
        // ImGui.Text(`# of free chunks (ordblks):            ${mi.ordblks}`);
        // ImGui.Text(`# of free fastbin blocks (smblks):     ${mi.smblks}`);
        // ImGui.Text(`# of mapped regions (hblks):           ${mi.hblks}`);
        // ImGui.Text(`Bytes in mapped regions (hblkhd):      ${mi.hblkhd}`);
        ImGui.Text("Max. total allocated space (usmblks):  ".concat(mi.usmblks));
        // ImGui.Text(`Free bytes held in fastbins (fsmblks): ${mi.fsmblks}`);
        ImGui.Text("Total allocated space (uordblks):      ".concat(mi.uordblks));
        ImGui.Text("Total free space (fordblks):           ".concat(mi.fordblks));
        // ImGui.Text(`Topmost releasable block (keepcost):   ${mi.keepcost}`);
        if (ImGui.ImageButton(image_gl_texture, new ImGui.Vec2(48, 48))) {
            // show_demo_window = !show_demo_window;
            image_url = image_urls[(image_urls.indexOf(image_url) + 1) % image_urls.length];
            if (image_element) {
                image_element.src = image_url;
            }
        }
        if (ImGui.IsItemHovered()) {
            ImGui.BeginTooltip();
            ImGui.Text(image_url);
            ImGui.EndTooltip();
        }
        if (ImGui.Button("Sandbox Window")) {
            show_sandbox_window = true;
        }
        if (show_sandbox_window)
            ShowSandboxWindow("Sandbox Window", function (value) {
                if (value === void 0) { value = show_sandbox_window; }
                return show_sandbox_window = value;
            });
        ImGui.SameLine();
        if (ImGui.Button("Gamepad Window")) {
            show_gamepad_window = true;
        }
        if (show_gamepad_window)
            ShowGamepadWindow("Gamepad Window", function (value) {
                if (value === void 0) { value = show_gamepad_window; }
                return show_gamepad_window = value;
            });
        ImGui.SameLine();
        if (ImGui.Button("Movie Window")) {
            show_movie_window = true;
        }
        if (show_movie_window)
            ShowMovieWindow("Movie Window", function (value) {
                if (value === void 0) { value = show_movie_window; }
                return show_movie_window = value;
            });
        if (font) {
            ImGui.PushFont(font);
            ImGui.Text("".concat(font.GetDebugName()));
            if (font.FindGlyphNoFallback(0x5929)) {
                ImGui.Text("U+5929: \u5929");
            }
            ImGui.PopFont();
        }
        ImGui.End();
    }
    // 3. Show another simple window.
    if (show_another_window) {
        ImGui.Begin("Another Window", function (value) {
            if (value === void 0) { value = show_another_window; }
            return show_another_window = value;
        }, ImGui.WindowFlags.AlwaysAutoResize);
        ImGui.Text("Hello from another window!");
        if (ImGui.Button("Close Me"))
            show_another_window = false;
        ImGui.End();
    }
    ImGui.EndFrame();
    // Rendering
    ImGui.Render();
    var gl = ImGui_Impl.gl;
    if (gl) {
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.clearColor(background_colour.x, background_colour.y, background_colour.z, background_colour.w);
        gl.clear(gl.COLOR_BUFFER_BIT);
        //gl.useProgram(0); // You may want this if using this code in an OpenGL 3+ context where shaders may be bound
    }
    var ctx = ImGui_Impl.ctx;
    if (ctx) {
        // ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = "rgba(".concat(background_colour.x * 0xff, ", ").concat(background_colour.y * 0xff, ", ").concat(background_colour.z * 0xff, ", ").concat(background_colour.w, ")");
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
    UpdateVideo();
    ImGui_Impl.RenderDrawData(ImGui.GetDrawData());
    if (typeof (window) !== "undefined") {
        window.requestAnimationFrame(done ? _done : _loop);
    }
}
function _done() {
    return __awaiter(this, void 0, void 0, function () {
        var gl, ctx;
        return __generator(this, function (_a) {
            gl = ImGui_Impl.gl;
            if (gl) {
                gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
                gl.clearColor(background_colour.x, background_colour.y, background_colour.z, background_colour.w);
                gl.clear(gl.COLOR_BUFFER_BIT);
            }
            ctx = ImGui_Impl.ctx;
            if (ctx) {
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            }
            CleanUpImage();
            CleanUpVideo();
            // Cleanup
            ImGui_Impl.Shutdown();
            ImGui.DestroyContext();
            console.log("Total allocated space (uordblks) @ _done:", ImGui.bind.mallinfo().uordblks);
            return [2 /*return*/];
        });
    });
}
function ShowHelpMarker(desc) {
    ImGui.TextDisabled("(?)");
    if (ImGui.IsItemHovered()) {
        ImGui.BeginTooltip();
        ImGui.PushTextWrapPos(ImGui.GetFontSize() * 35.0);
        ImGui.TextUnformatted(desc);
        ImGui.PopTextWrapPos();
        ImGui.EndTooltip();
    }
}
var source = [
    "ImGui.Text(\"Hello, world!\");",
    "ImGui.SliderFloat(\"float\",",
    "\t(value = f) => f = value,",
    "\t0.0, 1.0);",
    "",
].join("\n");
function ShowSandboxWindow(title, p_open) {
    if (p_open === void 0) { p_open = null; }
    ImGui.SetNextWindowSize(new ImGui.Vec2(320, 240), ImGui.Cond.FirstUseEver);
    ImGui.Begin(title, p_open);
    ImGui.Text("Source");
    ImGui.SameLine();
    ShowHelpMarker("Contents evaluated and appended to the window.");
    ImGui.PushItemWidth(-1);
    ImGui.InputTextMultiline("##source", function (_) {
        if (_ === void 0) { _ = source; }
        return (source = _);
    }, 1024, ImGui.Vec2.ZERO, ImGui.InputTextFlags.AllowTabInput);
    ImGui.PopItemWidth();
    try {
        eval(source);
    }
    catch (e) {
        ImGui.TextColored(new ImGui.Vec4(1.0, 0.0, 0.0, 1.0), "error: ");
        ImGui.SameLine();
        ImGui.Text(e.message);
    }
    ImGui.End();
}
function ShowGamepadWindow(title, p_open) {
    if (p_open === void 0) { p_open = null; }
    ImGui.Begin(title, p_open, ImGui.WindowFlags.AlwaysAutoResize);
    var gamepads = (typeof (navigator) !== "undefined" && typeof (navigator.getGamepads) === "function") ? navigator.getGamepads() : [];
    if (gamepads.length > 0) {
        for (var i = 0; i < gamepads.length; ++i) {
            var gamepad = gamepads[i];
            ImGui.Text("gamepad ".concat(i, " ").concat(gamepad && gamepad.id));
            if (!gamepad) {
                continue;
            }
            ImGui.Text("       ");
            for (var button = 0; button < gamepad.buttons.length; ++button) {
                ImGui.SameLine();
                ImGui.Text("".concat(button.toString(16)));
            }
            ImGui.Text("buttons");
            for (var button = 0; button < gamepad.buttons.length; ++button) {
                ImGui.SameLine();
                ImGui.Text("".concat(gamepad.buttons[button].value));
            }
            ImGui.Text("axes");
            for (var axis = 0; axis < gamepad.axes.length; ++axis) {
                ImGui.Text("".concat(axis, ": ").concat(gamepad.axes[axis].toFixed(2)));
            }
        }
    }
    else {
        ImGui.Text("connect a gamepad");
    }
    ImGui.End();
}
var image_urls = [
    "https://threejs.org/examples/textures/crate.gif",
    "https://threejs.org/examples/textures/sprite.png",
    "https://threejs.org/examples/textures/uv_grid_opengl.jpg",
];
var image_url = image_urls[0];
var image_element = null;
var image_gl_texture = null;
function StartUpImage() {
    if (typeof document !== "undefined") {
        image_element = document.createElement("img");
        image_element.crossOrigin = "anonymous";
        image_element.src = image_url;
    }
    var gl = ImGui_Impl.gl;
    if (gl) {
        var width = 256;
        var height = 256;
        var pixels = new Uint8Array(4 * width * height);
        image_gl_texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, image_gl_texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
        if (image_element) {
            image_element.addEventListener("load", function (event) {
                if (image_element) {
                    gl.bindTexture(gl.TEXTURE_2D, image_gl_texture);
                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image_element);
                }
            });
        }
    }
    var ctx = ImGui_Impl.ctx;
    if (ctx) {
        image_gl_texture = image_element; // HACK
    }
}
function CleanUpImage() {
    var gl = ImGui_Impl.gl;
    if (gl) {
        gl.deleteTexture(image_gl_texture);
        image_gl_texture = null;
    }
    var ctx = ImGui_Impl.ctx;
    if (ctx) {
        image_gl_texture = null;
    }
    image_element = null;
}
var video_urls = [
    "https://threejs.org/examples/textures/sintel.ogv",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4",
];
var video_url = video_urls[0];
var video_element = null;
var video_gl_texture = null;
var video_w = 640;
var video_h = 360;
var video_time_active = false;
var video_time = 0;
var video_duration = 0;
function StartUpVideo() {
    if (typeof document !== "undefined") {
        video_element = document.createElement("video");
        video_element.crossOrigin = "anonymous";
        video_element.preload = "auto";
        video_element.src = video_url;
        video_element.load();
    }
    var gl = ImGui_Impl.gl;
    if (gl) {
        var width = 256;
        var height = 256;
        var pixels = new Uint8Array(4 * width * height);
        video_gl_texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, video_gl_texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    }
    var ctx = ImGui_Impl.ctx;
    if (ctx) {
        video_gl_texture = video_element; // HACK
    }
}
function CleanUpVideo() {
    var gl = ImGui_Impl.gl;
    if (gl) {
        gl.deleteTexture(video_gl_texture);
        video_gl_texture = null;
    }
    var ctx = ImGui_Impl.ctx;
    if (ctx) {
        video_gl_texture = null;
    }
    video_element = null;
}
function UpdateVideo() {
    var gl = ImGui_Impl.gl;
    if (gl && video_element && video_element.readyState >= video_element.HAVE_CURRENT_DATA) {
        gl.bindTexture(gl.TEXTURE_2D, video_gl_texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video_element);
    }
}
function ShowMovieWindow(title, p_open) {
    if (p_open === void 0) { p_open = null; }
    ImGui.Begin(title, p_open, ImGui.WindowFlags.AlwaysAutoResize);
    if (video_element !== null) {
        if (p_open && !p_open()) {
            video_element.pause();
        }
        var w = video_element.videoWidth;
        var h = video_element.videoHeight;
        if (w > 0) {
            video_w = w;
        }
        if (h > 0) {
            video_h = h;
        }
        ImGui.BeginGroup();
        if (ImGui.BeginCombo("##urls", null, ImGui.ComboFlags.NoPreview | ImGui.ComboFlags.PopupAlignLeft)) {
            for (var n = 0; n < ImGui.ARRAYSIZE(video_urls); n++) {
                if (ImGui.Selectable(video_urls[n])) {
                    video_url = video_urls[n];
                    console.log(video_url);
                    video_element.src = video_url;
                    video_element.autoplay = true;
                }
            }
            ImGui.EndCombo();
        }
        ImGui.SameLine();
        ImGui.PushItemWidth(video_w - 20);
        if (ImGui.InputText("##url", function (value) {
            if (value === void 0) { value = video_url; }
            return video_url = value;
        })) {
            console.log(video_url);
            video_element.src = video_url;
        }
        ImGui.PopItemWidth();
        ImGui.EndGroup();
        if (ImGui.ImageButton(video_gl_texture, new ImGui.Vec2(video_w, video_h))) {
            if (video_element.readyState >= video_element.HAVE_CURRENT_DATA) {
                video_element.paused ? video_element.play() : video_element.pause();
            }
        }
        ImGui.BeginGroup();
        if (ImGui.Button(video_element.paused ? "Play" : "Stop")) {
            if (video_element.readyState >= video_element.HAVE_CURRENT_DATA) {
                video_element.paused ? video_element.play() : video_element.pause();
            }
        }
        ImGui.SameLine();
        if (!video_time_active) {
            video_time = video_element.currentTime;
            video_duration = video_element.duration || 0;
        }
        ImGui.SliderFloat("##time", function (value) {
            if (value === void 0) { value = video_time; }
            return video_time = value;
        }, 0, video_duration);
        var video_time_was_active = video_time_active;
        video_time_active = ImGui.IsItemActive();
        if (!video_time_active && video_time_was_active) {
            video_element.currentTime = video_time;
        }
        ImGui.EndGroup();
    }
    else {
        ImGui.Text("No Video Element");
    }
    ImGui.End();
}
