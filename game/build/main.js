System.register(["imgui-js", "./imgui_impl.js", "./imgui_memory_editor.js"], function (exports_1, context_1) {
    "use strict";
    var ImGui, ImGui_Impl, imgui_memory_editor_js_1, six_windows, font, is_initalised, background_colour, memory_editor, source, image_urls, image_url, image_element, image_gl_texture, video_url, video_element, video_gl_texture, video_w, video_h, video_time_active, video_time, video_duration;
    var __moduleName = context_1 && context_1.id;
    async function LoadArrayBuffer(url) {
        const response = await fetch(url);
        return response.arrayBuffer();
    }
    async function main() {
        await ImGui.default();
        if (typeof (window) !== "undefined") {
            window.requestAnimationFrame(_init);
        }
        else {
            async function _main() {
                await _init();
                for (let i = 0; i < 3; ++i) {
                    _loop(1 / 60);
                }
                await _done();
            }
            _main().catch(console.error);
        }
    }
    exports_1("default", main);
    async function AddFontFromFileTTF(url, size_pixels, font_cfg = null, glyph_ranges = null) {
        font_cfg = font_cfg || new ImGui.FontConfig();
        font_cfg.Name = font_cfg.Name || `${url.split(/[\\\/]/).pop()}, ${size_pixels.toFixed(0)}px`;
        return ImGui.GetIO().Fonts.AddFontFromMemoryTTF(await LoadArrayBuffer(url), size_pixels, font_cfg, glyph_ranges);
    }
    async function _init() {
        const EMSCRIPTEN_VERSION = `${ImGui.bind.__EMSCRIPTEN_major__}.${ImGui.bind.__EMSCRIPTEN_minor__}.${ImGui.bind.__EMSCRIPTEN_tiny__}`;
        console.log("Emscripten Version", EMSCRIPTEN_VERSION);
        console.log("Total allocated space (uordblks) @ _init:", ImGui.bind.mallinfo().uordblks);
        // Setup Dear ImGui context
        ImGui.CHECKVERSION();
        ImGui.CreateContext();
        const io = ImGui.GetIO();
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
        font = await AddFontFromFileTTF("../imgui/misc/fonts/Roboto-Medium.ttf", 16.0);
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
            const output = document.getElementById("output") || document.body;
            const canvas = document.createElement("canvas");
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
    }
    // Poll and handle events (inputs, window resize, etc.)
    // You can read the io.WantCaptureMouse, io.WantCaptureKeyboard flags to tell if dear imgui wants to use your inputs.
    // - When io.WantCaptureMouse is true, do not dispatch mouse input data to your main application.
    // - When io.WantCaptureKeyboard is true, do not dispatch keyboard input data to your main application.
    // Generally you may always pass all inputs to dear imgui, and hide them from your application based on those two flags.
    function _loop(time) {
        // -----------------------
        // default window
        ImGui.NewFrame();
        {
            // -----------------------
            // window title
            const window_flags = ImGui.WindowFlags.NoScrollbar | ImGui.WindowFlags.NoCollapse;
            ImGui.Begin("lasciate ogne speranza, voi ch'intrate", null, window_flags);
            ImGui.SetWindowSize(new ImGui.Vec2(440, 500), ImGui.Cond.Once);
            const window_size = ImGui.GetWindowSize();
            // -----------------------
            // text style
            ImGui.PushTextWrapPos(ImGui.GetWindowWidth() - 2.0);
            // -----------------------
            // preable
            ImGui.Text("Hello, you are DEAD! Yes that's right this is what the afterlife looks like; now take your time, have a look around, get comfortable. It's gonna be a helluva journey. Within this package lies your soul, this carries your pathoftime or 'memories', we will need you to interact with these memories in order for them to pass on. Though please there's certainly no rush. ");
            // -----------------------
            // button
            ImGui.Separator();
            ImGui.Text("Pressing the below button will begin the passing stage.");
            ImGui.Button("Begin");
            // -----------------------
            // footer
            const memory_string = "Memory Editor";
            const text_size = ImGui.CalcTextSize(memory_string);
            const cursor_y = window_size.y - text_size.y - ImGui.GetStyle().WindowPadding.y - 2.0;
            ImGui.SetCursorPosY(cursor_y);
            ImGui.Text(`frametime : ${(1000.0 / ImGui.GetIO().Framerate).toFixed(1)}ms | powered by GOD systems`);
            ImGui.SameLine();
            const curosr_x = window_size.x - text_size.x - 10.0;
            ImGui.SetCursorPosX(curosr_x);
            if (ImGui.Button(memory_string)) {
                memory_editor.Open = !memory_editor.Open;
            }
            if (memory_editor.Open) {
                memory_editor.DrawWindow(memory_string, ImGui.bind.HEAP8.buffer);
            }
            // -----------------------
            // end
            ImGui.PopTextWrapPos();
            ImGui.End();
        }
        ImGui.EndFrame();
        // -----------------------
        // 6 hell windows
        six_windows.forEach(([window_isactive, window_id]) => {
            if (window_isactive) {
                switch (window_id) {
                    case "skibidi":
                        ShowSkibidiWindow();
                        break;
                    case "limbo":
                        ShowLimboWindow();
                        break;
                    case "greed":
                        ShowGreedWindow();
                        break;
                    case "anger":
                        ShowAngerWindow();
                        break;
                    case "waste":
                        ShowWasteWindow();
                        break;
                    case "lust":
                        ShowLustWindow();
                        break;
                }
            }
        });
        // -----------------------
        // Rendering
        ImGui_Impl.NewFrame(time);
        ImGui.Render();
        const gl = ImGui_Impl.gl;
        if (gl) {
            gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
            gl.clearColor(background_colour.x, background_colour.y, background_colour.z, background_colour.w);
            gl.clear(gl.COLOR_BUFFER_BIT);
            //gl.useProgram(0); // You may want this if using this code in an OpenGL 3+ context where shaders may be bound
        }
        const ctx = ImGui_Impl.ctx;
        if (ctx) {
            // ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.fillStyle = `rgba(${background_colour.x * 0xff}, ${background_colour.y * 0xff}, ${background_colour.z * 0xff}, ${background_colour.w})`;
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        }
        UpdateVideo();
        ImGui_Impl.RenderDrawData(ImGui.GetDrawData());
        // ??
        if (typeof (window) !== "undefined") {
            window.requestAnimationFrame(is_initalised ? _done : _loop);
        }
    }
    async function _done() {
        const gl = ImGui_Impl.gl;
        if (gl) {
            gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
            gl.clearColor(background_colour.x, background_colour.y, background_colour.z, background_colour.w);
            gl.clear(gl.COLOR_BUFFER_BIT);
        }
        const ctx = ImGui_Impl.ctx;
        if (ctx) {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        }
        CleanUpImage();
        CleanUpVideo();
        // Cleanup
        ImGui_Impl.Shutdown();
        ImGui.DestroyContext();
        console.log("Total allocated space (uordblks) @ _done:", ImGui.bind.mallinfo().uordblks);
    }
    function ShowSkibidiWindow() {
        const window_flags = ImGui.WindowFlags.NoScrollbar | ImGui.WindowFlags.NoTitleBar;
        ImGui.Begin("skibidi", null, window_flags);
        ImGui.Text("");
        ImGui.End();
    }
    function ShowLimboWindow() {
        const window_flags = ImGui.WindowFlags.NoScrollbar | ImGui.WindowFlags.NoTitleBar;
        ImGui.Begin("limbo", null, window_flags);
        ImGui.End();
    }
    function ShowGreedWindow() {
        const window_flags = ImGui.WindowFlags.NoScrollbar | ImGui.WindowFlags.NoTitleBar;
        ImGui.Begin("greed", null, window_flags);
        ImGui.End();
    }
    function ShowAngerWindow() {
        const window_flags = ImGui.WindowFlags.NoScrollbar | ImGui.WindowFlags.NoTitleBar;
        ImGui.Begin("anger", null, window_flags);
        ImGui.End();
    }
    function ShowWasteWindow() {
        const window_flags = ImGui.WindowFlags.NoScrollbar | ImGui.WindowFlags.NoTitleBar;
        ImGui.Begin("waste", null, window_flags);
        ImGui.End();
    }
    function ShowLustWindow() {
        const window_flags = ImGui.WindowFlags.NoScrollbar | ImGui.WindowFlags.NoTitleBar;
        ImGui.Begin("lust", null, window_flags);
        ImGui.End();
    }
    function ShowHeavenWindow() {
        const window_flags = ImGui.WindowFlags.NoScrollbar | ImGui.WindowFlags.NoTitleBar;
        ImGui.Begin("heaven", null, window_flags);
        ImGui.End();
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
    function ShowSandboxWindow(title, p_open = null) {
        ImGui.SetNextWindowSize(new ImGui.Vec2(320, 240), ImGui.Cond.FirstUseEver);
        ImGui.Begin(title, p_open);
        ImGui.Text("Source");
        ImGui.SameLine();
        ShowHelpMarker("Contents evaluated and appended to the window.");
        ImGui.PushItemWidth(-1);
        ImGui.InputTextMultiline("##source", (_ = source) => (source = _), 1024, ImGui.Vec2.ZERO, ImGui.InputTextFlags.AllowTabInput);
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
    function ShowGamepadWindow(title, p_open = null) {
        ImGui.Begin(title, p_open, ImGui.WindowFlags.AlwaysAutoResize);
        const gamepads = (typeof (navigator) !== "undefined" && typeof (navigator.getGamepads) === "function") ? navigator.getGamepads() : [];
        if (gamepads.length > 0) {
            for (let i = 0; i < gamepads.length; ++i) {
                const gamepad = gamepads[i];
                ImGui.Text(`gamepad ${i} ${gamepad && gamepad.id}`);
                if (!gamepad) {
                    continue;
                }
                ImGui.Text(`       `);
                for (let button = 0; button < gamepad.buttons.length; ++button) {
                    ImGui.SameLine();
                    ImGui.Text(`${button.toString(16)}`);
                }
                ImGui.Text(`buttons`);
                for (let button = 0; button < gamepad.buttons.length; ++button) {
                    ImGui.SameLine();
                    ImGui.Text(`${gamepad.buttons[button].value}`);
                }
                ImGui.Text(`axes`);
                for (let axis = 0; axis < gamepad.axes.length; ++axis) {
                    ImGui.Text(`${axis}: ${gamepad.axes[axis].toFixed(2)}`);
                }
            }
        }
        else {
            ImGui.Text("connect a gamepad");
        }
        ImGui.End();
    }
    function StartUpImage() {
        if (typeof document !== "undefined") {
            image_element = document.createElement("img");
            image_element.crossOrigin = "anonymous";
            image_element.src = image_url;
        }
        const gl = ImGui_Impl.gl;
        if (gl) {
            const width = 256;
            const height = 256;
            const pixels = new Uint8Array(4 * width * height);
            image_gl_texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, image_gl_texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
            if (image_element) {
                image_element.addEventListener("load", (event) => {
                    if (image_element) {
                        gl.bindTexture(gl.TEXTURE_2D, image_gl_texture);
                        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image_element);
                    }
                });
            }
        }
        const ctx = ImGui_Impl.ctx;
        if (ctx) {
            image_gl_texture = image_element; // HACK
        }
    }
    function CleanUpImage() {
        const gl = ImGui_Impl.gl;
        if (gl) {
            gl.deleteTexture(image_gl_texture);
            image_gl_texture = null;
        }
        const ctx = ImGui_Impl.ctx;
        if (ctx) {
            image_gl_texture = null;
        }
        image_element = null;
    }
    // --------------------------------------
    // TODO : REFACTOR so we can have many videos playing at the same time!!
    // --------------------------------------
    function StartUpVideo() {
        if (typeof document !== "undefined") {
            video_element = document.createElement("video");
            video_element.crossOrigin = "anonymous";
            video_element.preload = "auto";
            video_element.src = video_url;
            video_element.load();
        }
        const gl = ImGui_Impl.gl;
        if (gl) {
            const width = 256;
            const height = 256;
            const pixels = new Uint8Array(4 * width * height);
            video_gl_texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, video_gl_texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
        }
        const ctx = ImGui_Impl.ctx;
        if (ctx) {
            video_gl_texture = video_element; // HACK
        }
    }
    function CleanUpVideo() {
        const gl = ImGui_Impl.gl;
        if (gl) {
            gl.deleteTexture(video_gl_texture);
            video_gl_texture = null;
        }
        const ctx = ImGui_Impl.ctx;
        if (ctx) {
            video_gl_texture = null;
        }
        video_element = null;
    }
    function UpdateVideo() {
        const gl = ImGui_Impl.gl;
        if (gl && video_element && video_element.readyState >= video_element.HAVE_CURRENT_DATA) {
            gl.bindTexture(gl.TEXTURE_2D, video_gl_texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video_element);
        }
    }
    function ShowMovieWindow(title, p_open = null) {
        ImGui.Begin(title, p_open, ImGui.WindowFlags.AlwaysAutoResize);
        if (video_element !== null) {
            if (p_open && !p_open()) {
                video_element.pause();
            }
            const w = video_element.videoWidth;
            const h = video_element.videoHeight;
            if (w > 0) {
                video_w = w;
            }
            if (h > 0) {
                video_h = h;
            }
            ImGui.BeginGroup();
            ImGui.SameLine();
            ImGui.PushItemWidth(video_w - 20);
            if (ImGui.InputText("##url", (value = video_url) => video_url = value)) {
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
            ImGui.SliderFloat("##time", (value = video_time) => video_time = value, 0, video_duration);
            const video_time_was_active = video_time_active;
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
    return {
        setters: [
            function (ImGui_1) {
                ImGui = ImGui_1;
            },
            function (ImGui_Impl_1) {
                ImGui_Impl = ImGui_Impl_1;
            },
            function (imgui_memory_editor_js_1_1) {
                imgui_memory_editor_js_1 = imgui_memory_editor_js_1_1;
            }
        ],
        execute: function () {
            six_windows = [
                [true, "skibidi"],
                [true, "limbo"],
                [true, "greed"],
                [true, "anger"],
                [true, "waste"],
                [true, "lust"],
            ];
            font = null;
            is_initalised = false;
            background_colour = new ImGui.Vec4(0.6, 0.1, 0.0, 1.00);
            memory_editor = new imgui_memory_editor_js_1.MemoryEditor();
            memory_editor.Open = false;
            source = [
                "ImGui.Text(\"Hello, world!\");",
                "ImGui.SliderFloat(\"float\",",
                "\t(value = f) => f = value,",
                "\t0.0, 1.0);",
                "",
            ].join("\n");
            image_urls = [
                "https://threejs.org/examples/textures/crate.gif",
                "https://threejs.org/examples/textures/sprite.png",
                "https://threejs.org/examples/textures/uv_grid_opengl.jpg",
            ];
            image_url = image_urls[0];
            image_element = null;
            image_gl_texture = null;
            video_url = "https://github.com/TrvsF/hell/tree/main/game/assets/skibidi.mp4";
            video_element = null;
            video_gl_texture = null;
            video_w = 640;
            video_h = 360;
            video_time_active = false;
            video_time = 0;
            video_duration = 0;
        }
    };
});
//# sourceMappingURL=main.js.map