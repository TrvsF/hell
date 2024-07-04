System.register(["imgui-js", "./imgui_impl.js", "./imgui_memory_editor.js"], function (exports_1, context_1) {
    "use strict";
    var ImGui, ImGui_Impl, imgui_memory_editor_js_1, GameState, game_state, greed_flag, random_num, questions, yes_replies, no_replies, greed_stringbuilder, DateManager, date_manager, current_day, image_urls, img_index, just_removed_image, six_windows, font, is_initalised, background_colour, memory_editor, window_focus_stack, image_url, image_element, image_gl_texture, video_url, video_element, video_gl_texture, video_w, video_h;
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
    // --------------------------------------
    // windowz
    // --------------------------------------
    function ShowLimboWindow(window_name) {
        // -----------------------
        // window title
        const window_flags = ImGui.WindowFlags.NoScrollbar | ImGui.WindowFlags.NoCollapse;
        ImGui.Begin("lasciate ogne speranza, voi ch'intrate", null, window_flags);
        ImGui.SetWindowSize(new ImGui.Vec2(440, 500));
        const window_size = ImGui.GetWindowSize();
        if (ImGui.IsWindowFocused()) {
            OnWindowFocus("limbo");
        }
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
        if (game_state == GameState.Intro) {
            if (ImGui.Button("Begin")) {
                six_windows.forEach(window => {
                    window.window_isactive = true;
                });
                game_state = GameState.Base;
            }
        }
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
    function ShowSkibidiWindow(window_name) {
        const window_flags = ImGui.WindowFlags.NoScrollbar | ImGui.WindowFlags.NoTitleBar | ImGui.WindowFlags.AlwaysAutoResize;
        ImGui.Begin(window_name, null, window_flags);
        if (ImGui.IsWindowFocused()) {
            OnWindowFocus(window_name);
        }
        // -----------------------
        // play video
        if (video_element !== null) {
            if (video_element.readyState >= video_element.HAVE_CURRENT_DATA) {
                ImGui.ImageButton(video_gl_texture, new ImGui.Vec2(video_w, video_h));
                video_element.volume = 0.1337;
                video_element.play();
            }
        }
        ImGui.End();
    }
    function ShowGreedWindow(window_name) {
        const window_flags = ImGui.WindowFlags.NoScrollbar | ImGui.WindowFlags.NoTitleBar | ImGui.WindowFlags.NoResize;
        ImGui.Begin(window_name, null, window_flags);
        ImGui.PushID(window_name);
        ImGui.SetWindowSize(new ImGui.Vec2(240, 240));
        ImGui.PushTextWrapPos(ImGui.GetWindowWidth() - 2.0);
        const window_size = ImGui.GetWindowSize();
        if (ImGui.IsWindowFocused()) {
            OnWindowFocus(window_name);
        }
        switch (greed_flag) {
            case 0:
                ImGui.Text(questions[random_num % questions.length]);
                break;
            case 1:
                ImGui.Text(yes_replies[random_num % yes_replies.length]);
                break;
            case 2:
                ImGui.Text(no_replies[random_num % no_replies.length]);
                break;
        }
        // -----------------------
        // footer
        const temp_string = "Temp";
        const text_size = ImGui.CalcTextSize(temp_string);
        const cursor_y = window_size.y - text_size.y - ImGui.GetStyle().WindowPadding.y - 2.0;
        ImGui.SetCursorPosY(cursor_y);
        if (greed_flag === 0) {
            if (ImGui.Button("yes")) {
                greed_flag = 1;
            }
            ImGui.SameLine();
            if (ImGui.Button("no")) {
                greed_flag = 2;
            }
        }
        else {
            const input_flags = ImGui.ImGuiInputTextFlags.EnterReturnsTrue;
            ImGui.PushItemWidth(-1);
            if (ImGui.InputText("greed_input", greed_stringbuilder, ImGui.ARRAYSIZE(greed_stringbuilder), input_flags)) {
                HandleGreedInput();
            }
            ImGui.PopItemWidth();
            ImGui.SameLine();
            if (ImGui.Button("enter")) {
                HandleGreedInput();
            }
        }
        ImGui.PopTextWrapPos();
        ImGui.PopID();
        ImGui.End();
    }
    function HandleGreedInput() {
        if (greed_stringbuilder.buffer.includes("?")) {
            six_windows[0].window_isactive = false;
        }
        greed_stringbuilder.buffer = "";
        random_num++;
        greed_flag = 0;
    }
    function ShowAngerWindow(window_name) {
        const window_flags = ImGui.WindowFlags.NoScrollbar | ImGui.WindowFlags.NoTitleBar;
        ImGui.Begin(window_name, null, window_flags);
        if (ImGui.IsWindowFocused()) {
            OnWindowFocus(window_name);
        }
        ImGui.SetWindowSize(new ImGui.Vec2(150, 150));
        let mouse_pos = ImGui.GetMousePos();
        ImGui.Text(mouse_pos.x.toPrecision(4).toString());
        ImGui.SameLine();
        ImGui.Text(mouse_pos.y.toPrecision(4).toString());
        if (mouse_pos.x == 420 && mouse_pos.y == 69) {
            six_windows[1].window_isactive = false;
        }
        ImGui.End();
    }
    function NextDay() {
        for (let i = 0; i < 365; i++) {
            date_manager.NewDay();
        }
    }
    function ShowWasteWindow(window_name) {
        const window_flags = ImGui.WindowFlags.NoScrollbar | ImGui.WindowFlags.NoTitleBar;
        ImGui.Begin(window_name, null, window_flags);
        if (ImGui.IsWindowFocused()) {
            OnWindowFocus(window_name);
        }
        if (memory_editor.IsSkip) {
            NextDay();
            memory_editor.IsSkip = false;
        }
        if (Math.round(ImGui.GetTime()) > current_day) {
            current_day++;
            date_manager.NewDay();
        }
        ImGui.Text(date_manager.DisplayDate());
        ImGui.Text("thankyou for the days");
        if (date_manager.GetYear() == 2042) {
            six_windows[2].window_isactive = false;
        }
        ImGui.End();
    }
    function ShowLustWindow(window_name) {
        if (just_removed_image) { // hacky hack hack
            const window_flags = ImGui.WindowFlags.NoScrollbar | ImGui.WindowFlags.NoTitleBar | ImGui.WindowFlags.NoResize;
            ImGui.Begin(window_name, null, window_flags);
            ImGui.SetWindowSize(new ImGui.Vec2(281, 281));
            just_removed_image = false;
            ImGui.End();
            return;
        }
        const window_flags = ImGui.WindowFlags.NoScrollbar | ImGui.WindowFlags.NoTitleBar;
        ImGui.Begin(window_name, null, window_flags);
        if (ImGui.IsWindowFocused()) {
            OnWindowFocus(window_name);
        }
        // -----------------------
        // draw image
        let window_size = ImGui.GetWindowSize();
        window_size.x -= 24;
        window_size.y -= 24;
        if (ImGui.ImageButton(image_gl_texture, window_size)) {
            NextImage();
        }
        // -----------------------
        // check size
        const viewport_size = ImGui.GetMainViewport().Size;
        const big_window_size = new ImGui.Vec2(viewport_size.x * 0.6, viewport_size.y * 0.6);
        const small_window_size = new ImGui.Vec2(viewport_size.x * 0.05, viewport_size.y * 0.05);
        let current_image_index = img_index % image_urls.length;
        let current_image = image_urls[current_image_index];
        if (window_size.x <= small_window_size.x && window_size.y <= small_window_size.y) { // small
            if (current_image.is_lustful) {
                image_urls.splice(current_image_index, 1);
                just_removed_image = true;
                NextImage();
            }
            else {
                game_state = GameState.Hell;
            }
        }
        else if (window_size.x >= big_window_size.x && window_size.y >= big_window_size.y) { // big
            if (current_image.is_lustful) {
                game_state = GameState.Hell;
            }
            else {
                image_urls.splice(current_image_index, 1);
                just_removed_image = true;
                NextImage();
            }
        }
        ImGui.End();
    }
    function NextImage() {
        if (image_urls.length == 0) {
            six_windows[3].window_isactive = false;
            return;
        }
        img_index++;
        if (image_element) {
            image_element.src = image_urls[img_index % image_urls.length].asset_url;
        }
    }
    function ShowHeavenWindow(window_name) {
        background_colour = new ImGui.Vec4(1, 1, 1, 1);
        const window_flags = ImGui.WindowFlags.NoScrollbar | ImGui.WindowFlags.NoTitleBar | ImGui.WindowFlags.NoResize | ImGui.WindowFlags.NoMove;
        ImGui.Begin(window_name, null, window_flags);
        const dead_string = "you are dead, there is now peace  ";
        const text_size = ImGui.CalcTextSize(dead_string);
        ImGui.SetWindowSize(text_size);
        ImGui.SetWindowPos(new ImGui.ImVec2(50, 50));
        ImGui.SetMouseCursor(ImGui.ImGuiMouseCursor.None);
        ImGui.Text(dead_string);
        ImGui.End();
    }
    function ShowHellWindow(window_name) {
        background_colour = new ImGui.Vec4(0, 0, 0, 0);
        const window_flags = ImGui.WindowFlags.NoScrollbar | ImGui.WindowFlags.NoTitleBar | ImGui.WindowFlags.NoResize | ImGui.WindowFlags.NoMove;
        ImGui.Begin(window_name, null, window_flags);
        const dead_string = "you are dead, there is no peace  ";
        const text_size = ImGui.CalcTextSize(dead_string);
        const viewport_size = ImGui.GetMainViewport().Size;
        ImGui.SetWindowSize(text_size);
        ImGui.SetWindowPos(new ImGui.ImVec2(viewport_size.x - 50 - text_size.x, viewport_size.y - 50 - text_size.y));
        ImGui.SetMouseCursor(ImGui.ImGuiMouseCursor.None);
        ImGui.Text(dead_string);
        ImGui.End();
    }
    function _loop(time) {
        ImGui.NewFrame();
        // -----------------------
        // check for gameover states
        let are_all_windows_gone = true;
        six_windows.forEach(window => {
            // can't continue in silly foreach loop??
            if (window.window_isactive && window.window_id != "limbo") {
                are_all_windows_gone = false;
            }
        });
        if (memory_editor.IsErase) {
            if (are_all_windows_gone) {
                game_state = GameState.Heaven;
            }
            else {
                game_state = GameState.Hell;
            }
        }
        let viewport_size = ImGui.GetMainViewport().Size;
        // -----------------------
        // main windows
        switch (game_state) {
            case GameState.Base:
            case GameState.Intro:
                six_windows.forEach(window => {
                    if (window.window_isactive) {
                        switch (window.window_id) {
                            case "skibidi":
                                ImGui.SetNextWindowPos(new ImGui.ImVec2(viewport_size.x * 0.05, viewport_size.y * 0.4), ImGui.Cond.Once);
                                ShowSkibidiWindow("skibidi");
                                break;
                            case "greed":
                                ImGui.SetNextWindowPos(new ImGui.ImVec2(viewport_size.x * 0.677, viewport_size.y * 0.74), ImGui.Cond.Once);
                                ShowGreedWindow("greed");
                                break;
                            case "anger":
                                ShowAngerWindow("anger");
                                ImGui.SetNextWindowPos(new ImGui.ImVec2(viewport_size.x * 0.2, viewport_size.y * 0.15), ImGui.Cond.Once);
                                break;
                            case "waste":
                                ImGui.SetNextWindowPos(new ImGui.ImVec2(viewport_size.x * 0.1, viewport_size.y * 0.1), ImGui.Cond.Once);
                                ShowWasteWindow("waste");
                                break;
                            case "lust":
                                ImGui.SetNextWindowPos(new ImGui.ImVec2(viewport_size.x * 0.72, viewport_size.y * 0.32), ImGui.Cond.Once);
                                ShowLustWindow("lust");
                                break;
                            case "limbo":
                                ImGui.SetNextWindowPos(new ImGui.ImVec2(viewport_size.x * 0.35, viewport_size.y * 0.23));
                                ShowLimboWindow("limbo");
                                break;
                        }
                    }
                });
                break;
            case GameState.Heaven:
                video_url = "assets/gatesofeden.mp3";
                StartUpVideo();
                video_element?.play();
                ShowHeavenWindow("heaven");
                break;
            case GameState.Hell:
                video_element?.pause();
                ShowHellWindow("hell");
                break;
        }
        ImGui.EndFrame(); // >:(
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
    function OnWindowFocus(window_name) {
        if (window_focus_stack.includes(window_name)) {
            const index = window_focus_stack.indexOf(window_name);
            if (index != window_focus_stack.length - 1) {
                window_focus_stack.splice(index, 1); // crazy typescript shit
            }
            else {
                return;
            }
        }
        window_focus_stack.push(window_name);
        if (window_focus_stack[0] == "skibidi") {
            if (video_element) {
                video_element.pause();
                video_element.volume = 0.0337;
            }
            six_windows[4].window_isactive = false; // i tried to make it pragmatic but it didn't fucking work!!!
        }
    }
    function RandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    // --------------------------------------
    // image stuff
    // --------------------------------------
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
    // video stuff
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
            (function (GameState) {
                GameState[GameState["Intro"] = 1] = "Intro";
                GameState[GameState["Base"] = 2] = "Base";
                GameState[GameState["Heaven"] = 3] = "Heaven";
                GameState[GameState["Hell"] = 4] = "Hell";
            })(GameState || (GameState = {}));
            game_state = GameState.Intro;
            greed_flag = 0; // this should be an enum flag!!!!!
            // 0 = no input, 1 = yes, 2 = no
            random_num = RandomInt(0, 10); // this is also shit!
            questions = [
                "you see a person slumpted against a wall; their clothes are worn, their eyes look tired, they smell. They ask, somewhat politely, for some change. You have a few coins in your pocket, do you hand them over?",
                "a person approaches you from across the road while you're walking, they're loud but not hateful. they ask for money but there's a corner shop behind them, do you get them something from the shop?",
                "you are directly approached by a person exclaiming that they are homeless & need money from you to survive. you feel cornered. you polietly decline; the person takes it in good faith & begins walking away in the direction you were just heading, do you walk in the same direction?",
                "you are walking home with a small pizza in a box, you pass a scruffy looking person who asks for a slice. they say they need it to survive. do you give them a slice?",
                "whenever you go to your favourite shop in the morning there is a person who sits on a plastic box begging. they are polite & friendly. do you build a relationship with this person & regularly buy them items?",
            ];
            // this implimentation is also also shit!
            yes_replies = [
                "he took your goodwill & exchanged it for drugs",
                "she took your goodwill & exchanged it for drugs",
                "they died that night",
                "they thank their god for you",
                "they love you",
                "you were soon mugged because a passerby assumed you are rich",
                "does that make you feel powerful?",
                "do you always do that?",
            ];
            no_replies = [
                "that person had children; they will go hungry tonite because of the majority of people act like you",
                "that person will now not eat; they will go hungry tonite because of the majority of people act like you",
                "they died that night",
                "they rely on people to survive",
                "how could you?",
                "do you think money is more important than other people?",
                "do you often ignore such people?",
                "do you always do that?",
            ];
            greed_stringbuilder = new ImGui.StringBuffer(128, "");
            // fresh from chatgpt
            DateManager = class DateManager {
                constructor() {
                    this.date = new Date();
                }
                DisplayDate() {
                    return this.date.toDateString();
                }
                NewDay() {
                    this.date.setDate(this.date.getDate() + 1);
                }
                GetYear() {
                    return this.date.getFullYear();
                }
            };
            date_manager = new DateManager();
            current_day = 0;
            image_urls = [
                { asset_url: "assets/p1.png", is_lustful: true },
                { asset_url: "assets/p2.png", is_lustful: true },
                { asset_url: "assets/p3.png", is_lustful: false },
                { asset_url: "assets/p4.png", is_lustful: true },
            ];
            img_index = 0;
            just_removed_image = true;
            six_windows = [
                { window_isactive: false, window_id: "greed" },
                { window_isactive: false, window_id: "anger" },
                { window_isactive: false, window_id: "waste" },
                { window_isactive: false, window_id: "lust" },
                { window_isactive: false, window_id: "skibidi" },
                { window_isactive: true, window_id: "limbo" },
            ];
            font = null;
            is_initalised = false;
            background_colour = new ImGui.Vec4(0.6, 0.1, 0, 1);
            memory_editor = new imgui_memory_editor_js_1.MemoryEditor();
            memory_editor.Open = false;
            // --------------------------------------
            // misc shit
            // --------------------------------------
            window_focus_stack = [];
            // TODO : should be struct
            image_url = image_urls[0].asset_url;
            image_element = null;
            image_gl_texture = null;
            // TODO : should be struct
            video_url = "assets/skibidi.mp4";
            video_element = null;
            video_gl_texture = null;
            video_w = 280;
            video_h = 480;
        }
    };
});
//# sourceMappingURL=main.js.map