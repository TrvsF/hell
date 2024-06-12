import * as ImGui from "imgui-js";
import * as ImGui_Impl from "./imgui_impl.js";
import { ShowDemoWindow } from "./imgui_demo.js";
import { MemoryEditor } from "./imgui_memory_editor.js";

let font: ImGui.Font | null = null;

// Our state
let show_demo_window: boolean = false;
const background_colour: ImGui.Vec4 = new ImGui.Vec4(0.6, 0.1, 0.0, 1.00);

const memory_editor: MemoryEditor = new MemoryEditor();
memory_editor.Open = false;

/* static */ let f: number = 0.0;
/* static */ let counter: number = 0;

let done: boolean = false;

async function LoadArrayBuffer(url: string): Promise<ArrayBuffer> {
    const response: Response = await fetch(url);
    return response.arrayBuffer();
}

export default async function main(): Promise<void> {
    await ImGui.default();
    if (typeof(window) !== "undefined") {
        window.requestAnimationFrame(_init);
    } else {
        async function _main(): Promise<void> {
            await _init();
            for (let i = 0; i < 3; ++i) { _loop(1 / 60); }
            await _done();
        }
        _main().catch(console.error);
    }
}

async function AddFontFromFileTTF(url: string, size_pixels: number, font_cfg: ImGui.FontConfig | null = null, glyph_ranges: number | null = null): Promise<ImGui.Font> {
    font_cfg = font_cfg || new ImGui.FontConfig();
    font_cfg.Name = font_cfg.Name || `${url.split(/[\\\/]/).pop()}, ${size_pixels.toFixed(0)}px`;
    return ImGui.GetIO().Fonts.AddFontFromMemoryTTF(await LoadArrayBuffer(url), size_pixels, font_cfg, glyph_ranges);
}

async function _init(): Promise<void> {
    const EMSCRIPTEN_VERSION = `${ImGui.bind.__EMSCRIPTEN_major__}.${ImGui.bind.__EMSCRIPTEN_minor__}.${ImGui.bind.__EMSCRIPTEN_tiny__}`;
    console.log("Emscripten Version", EMSCRIPTEN_VERSION);

    console.log("Total allocated space (uordblks) @ _init:", ImGui.bind.mallinfo().uordblks);

    // Setup Dear ImGui context
    ImGui.CHECKVERSION();
    ImGui.CreateContext();
    const io: ImGui.IO = ImGui.GetIO();
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
    if (typeof(window) !== "undefined") {
        const output: HTMLElement = document.getElementById("output") || document.body;
        const canvas: HTMLCanvasElement = document.createElement("canvas");
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
    } else {
        ImGui_Impl.Init(null);
    }

    StartUpImage();
    StartUpVideo();

    if (typeof(window) !== "undefined") {
        window.requestAnimationFrame(_loop);
    }
}

// Main loop
function _loop(time: number): void {
    // Poll and handle events (inputs, window resize, etc.)
    // You can read the io.WantCaptureMouse, io.WantCaptureKeyboard flags to tell if dear imgui wants to use your inputs.
    // - When io.WantCaptureMouse is true, do not dispatch mouse input data to your main application.
    // - When io.WantCaptureKeyboard is true, do not dispatch keyboard input data to your main application.
    // Generally you may always pass all inputs to dear imgui, and hide them from your application based on those two flags.
    
    // Start the Dear ImGui frame
    ImGui_Impl.NewFrame(time);
    ImGui.NewFrame();
    
    // default window
    {
        // -----------------------
        // window title
        ImGui.Begin("lasciate ogne speranza, voi ch'intrate");
        ImGui.SetWindowSize(new ImGui.Vec2(380, 480), ImGui.Cond.Once);

        // -----------------------
        // text style
        ImGui.PushTextWrapPos(ImGui.GetWindowWidth() - 2);

        // -----------------------
        // preable
        ImGui.Text("Hello, you are DEAD! Yes that's right this is what the afterlife looks like; now take your time, have a look around, get comfortable. It's gonna be a helluva journey.");
        ImGui.Separator();
        ImGui.Text("See that big button? You can press that to begin the processing sequence, whenever you are ready");
        
        // -----------------------
        // button
        ImGui.Button("Begin");

        // -----------------------
        // footer
        const WindowSize = ImGui.GetWindowSize();
        const TextSize = ImGui.CalcTextSize("DUMMY");
        const CursorY = WindowSize.y - TextSize.y - ImGui.GetStyle().WindowPadding.y;
        ImGui.SetCursorPosY(CursorY);

        if (ImGui.Button("Memory Editor"))
        {
            memory_editor.Open = !memory_editor.Open;
        }
        if (memory_editor.Open)
        {
            memory_editor.DrawWindow("Memory Editor", ImGui.bind.HEAP8.buffer);
        }
        ImGui.SameLine();
        ImGui.Text(`frametime : ${(1000.0 / ImGui.GetIO().Framerate).toFixed(1)}ms | powered by GOD systems`);
        
        // -----------------------
        // end
        ImGui.PopTextWrapPos();
        ImGui.End();
    }

    ImGui.EndFrame();

    // Rendering
    ImGui.Render();
    const gl: WebGLRenderingContext | null = ImGui_Impl.gl;
    if (gl) {
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.clearColor(background_colour.x, background_colour.y, background_colour.z, background_colour.w);
        gl.clear(gl.COLOR_BUFFER_BIT);
        //gl.useProgram(0); // You may want this if using this code in an OpenGL 3+ context where shaders may be bound
    }

    const ctx: CanvasRenderingContext2D | null = ImGui_Impl.ctx;
    if (ctx) {
        // ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = `rgba(${background_colour.x * 0xff}, ${background_colour.y * 0xff}, ${background_colour.z * 0xff}, ${background_colour.w})`;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    UpdateVideo();

    ImGui_Impl.RenderDrawData(ImGui.GetDrawData());

    if (typeof(window) !== "undefined") {
        window.requestAnimationFrame(done ? _done : _loop);
    }
}

async function _done(): Promise<void> {
    const gl: WebGLRenderingContext | null = ImGui_Impl.gl;
    if (gl) {
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.clearColor(background_colour.x, background_colour.y, background_colour.z, background_colour.w);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }

    const ctx: CanvasRenderingContext2D | null = ImGui_Impl.ctx;
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

function ShowHelpMarker(desc: string): void {
    ImGui.TextDisabled("(?)");
    if (ImGui.IsItemHovered()) {
        ImGui.BeginTooltip();
        ImGui.PushTextWrapPos(ImGui.GetFontSize() * 35.0);
        ImGui.TextUnformatted(desc);
        ImGui.PopTextWrapPos();
        ImGui.EndTooltip();
    }
}

let source: string = [
    "ImGui.Text(\"Hello, world!\");",
    "ImGui.SliderFloat(\"float\",",
    "\t(value = f) => f = value,",
    "\t0.0, 1.0);",
    "",
].join("\n");

function ShowSandboxWindow(title: string, p_open: ImGui.Access<boolean> | null = null): void {
    ImGui.SetNextWindowSize(new ImGui.Vec2(320, 240), ImGui.Cond.FirstUseEver);
    ImGui.Begin(title, p_open);
    ImGui.Text("Source");
    ImGui.SameLine(); ShowHelpMarker("Contents evaluated and appended to the window.");
    ImGui.PushItemWidth(-1);
    ImGui.InputTextMultiline("##source", (_ = source) => (source = _), 1024, ImGui.Vec2.ZERO, ImGui.InputTextFlags.AllowTabInput);
    ImGui.PopItemWidth();
    try {
        eval(source);
    } catch (e: any) {
        ImGui.TextColored(new ImGui.Vec4(1.0, 0.0, 0.0, 1.0), "error: ");
        ImGui.SameLine();
        ImGui.Text(e.message);
    }
    ImGui.End();
}

function ShowGamepadWindow(title: string, p_open: ImGui.Access<boolean> | null = null): void {
    ImGui.Begin(title, p_open, ImGui.WindowFlags.AlwaysAutoResize);
    const gamepads: (Gamepad | null)[] = (typeof(navigator) !== "undefined" && typeof(navigator.getGamepads) === "function") ? navigator.getGamepads() : [];
    if (gamepads.length > 0) {
        for (let i = 0; i < gamepads.length; ++i) {
            const gamepad: Gamepad | null = gamepads[i];
            ImGui.Text(`gamepad ${i} ${gamepad && gamepad.id}`);
            if (!gamepad) { continue; }
            ImGui.Text(`       `);
            for (let button = 0; button < gamepad.buttons.length; ++button) {
                ImGui.SameLine(); ImGui.Text(`${button.toString(16)}`);
            }
            ImGui.Text(`buttons`);
            for (let button = 0; button < gamepad.buttons.length; ++button) {
                ImGui.SameLine(); ImGui.Text(`${gamepad.buttons[button].value}`);
            }
            ImGui.Text(`axes`);
            for (let axis = 0; axis < gamepad.axes.length; ++axis) {
                ImGui.Text(`${axis}: ${gamepad.axes[axis].toFixed(2)}`);
            }
        }
    } else {
        ImGui.Text("connect a gamepad");
    }
    ImGui.End();
}

const image_urls: string[] = [
    "https://threejs.org/examples/textures/crate.gif",
    "https://threejs.org/examples/textures/sprite.png",
    "https://threejs.org/examples/textures/uv_grid_opengl.jpg",
];
let image_url: string = image_urls[0];
let image_element: HTMLImageElement | null = null;
let image_gl_texture: WebGLTexture | null = null;

function StartUpImage(): void {
    if (typeof document !== "undefined") {
        image_element = document.createElement("img");
        image_element.crossOrigin = "anonymous";
        image_element.src = image_url;
    }
    
    const gl: WebGLRenderingContext | null = ImGui_Impl.gl;
    if (gl) {
        const width: number = 256;
        const height: number = 256;
        const pixels: Uint8Array = new Uint8Array(4 * width * height);
        image_gl_texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, image_gl_texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

        if (image_element) {
            image_element.addEventListener("load", (event: Event) => {
                if (image_element) {
                    gl.bindTexture(gl.TEXTURE_2D, image_gl_texture);
                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image_element);
                }
            });
        }
    }

    const ctx: CanvasRenderingContext2D | null = ImGui_Impl.ctx;
    if (ctx) {
        image_gl_texture = image_element; // HACK
    }
}

function CleanUpImage(): void {
    const gl: WebGLRenderingContext | null = ImGui_Impl.gl;
    if (gl) {
        gl.deleteTexture(image_gl_texture); image_gl_texture = null;
    }

    const ctx: CanvasRenderingContext2D | null = ImGui_Impl.ctx;
    if (ctx) {
        image_gl_texture = null;
    }

    image_element = null;
}

const video_urls: string[] = [
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
let video_url: string = video_urls[0];
let video_element: HTMLVideoElement | null = null;
let video_gl_texture: WebGLTexture | null = null;
let video_w: number = 640;
let video_h: number = 360;
let video_time_active: boolean = false;
let video_time: number = 0;
let video_duration: number = 0;

function StartUpVideo(): void {
    if (typeof document !== "undefined") {
        video_element = document.createElement("video");
        video_element.crossOrigin = "anonymous";
        video_element.preload = "auto";
        video_element.src = video_url;
        video_element.load();
    }

    const gl: WebGLRenderingContext | null = ImGui_Impl.gl;
    if (gl) {
        const width: number = 256;
        const height: number = 256;
        const pixels: Uint8Array = new Uint8Array(4 * width * height);
        video_gl_texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, video_gl_texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    }

    const ctx: CanvasRenderingContext2D | null = ImGui_Impl.ctx;
    if (ctx) {
        video_gl_texture = video_element; // HACK
    }
}

function CleanUpVideo(): void {
    const gl: WebGLRenderingContext | null = ImGui_Impl.gl;
    if (gl) {
        gl.deleteTexture(video_gl_texture); video_gl_texture = null;
    }

    const ctx: CanvasRenderingContext2D | null = ImGui_Impl.ctx;
    if (ctx) {
        video_gl_texture = null;
    }

    video_element = null;
}

function UpdateVideo(): void {
    const gl: WebGLRenderingContext | null = ImGui_Impl.gl;
    if (gl && video_element && video_element.readyState >= video_element.HAVE_CURRENT_DATA) {
        gl.bindTexture(gl.TEXTURE_2D, video_gl_texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video_element);
    }
}

function ShowMovieWindow(title: string, p_open: ImGui.Access<boolean> | null = null): void {
    ImGui.Begin(title, p_open, ImGui.WindowFlags.AlwaysAutoResize);
    if (video_element !== null) {
        if (p_open && !p_open()) {
            video_element.pause();
        }
        const w: number = video_element.videoWidth;
        const h: number = video_element.videoHeight;
        if (w > 0) { video_w = w; }
        if (h > 0) { video_h = h; }

        ImGui.BeginGroup();
        if (ImGui.BeginCombo("##urls", null, ImGui.ComboFlags.NoPreview | ImGui.ComboFlags.PopupAlignLeft)) {
            for (let n = 0; n < ImGui.ARRAYSIZE(video_urls); n++) {
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
        const video_time_was_active: boolean = video_time_active;
        video_time_active = ImGui.IsItemActive();
        if (!video_time_active && video_time_was_active) {
            video_element.currentTime = video_time;
        }
        ImGui.EndGroup();
    } else {
        ImGui.Text("No Video Element");
    }
    ImGui.End();
}
