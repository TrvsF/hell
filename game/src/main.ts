import * as ImGui from "imgui-js";
import * as ImGui_Impl from "./imgui_impl.js";
import { ShowDemoWindow } from "./imgui_demo.js";
import { MemoryEditor } from "./imgui_memory_editor.js";

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

type Window = {
    window_isactive: boolean;
    window_id: string;
};

const six_windows: Window[] = [
    { window_isactive: false, window_id: "skibidi" },
    { window_isactive: false, window_id: "limbo" },
    { window_isactive: false, window_id: "greed" },
    { window_isactive: false, window_id: "anger" },
    { window_isactive: false, window_id: "waste" },
    { window_isactive: false, window_id: "lust" }
];

let font: ImGui.Font | null = null;
let is_initalised: boolean = false;
let has_game_started: boolean = false;

let background_colour: ImGui.Vec4 = new ImGui.Vec4(0.6, 0.1, 0.0, 1.00);

const memory_editor: MemoryEditor = new MemoryEditor();
memory_editor.Open = false;

// Poll and handle events (inputs, window resize, etc.)
// You can read the io.WantCaptureMouse, io.WantCaptureKeyboard flags to tell if dear imgui wants to use your inputs.
// - When io.WantCaptureMouse is true, do not dispatch mouse input data to your main application.
// - When io.WantCaptureKeyboard is true, do not dispatch keyboard input data to your main application.
// Generally you may always pass all inputs to dear imgui, and hide them from your application based on those two flags.
function _loop(time: number): void {    
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
        if (!has_game_started) {
            if (ImGui.Button("Begin")) {
                six_windows.forEach(window => {
                    window.window_isactive = true;
                });
                has_game_started = true;
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
    ImGui.EndFrame();

    // -----------------------
    // 6 hell windows
    six_windows.forEach(window => {
        if (window.window_isactive) {
            switch(window.window_id)
            {
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

    // ??
    if (typeof(window) !== "undefined") {
        window.requestAnimationFrame(is_initalised ? _done : _loop);
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

function ShowSkibidiWindow(): void {
    const window_flags = ImGui.WindowFlags.NoScrollbar | ImGui.WindowFlags.NoTitleBar | ImGui.WindowFlags.AlwaysAutoResize;
    ImGui.Begin("skibidi", null, window_flags);

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

function ShowLimboWindow(): void {
    const window_flags = ImGui.WindowFlags.NoScrollbar | ImGui.WindowFlags.NoTitleBar;
    ImGui.Begin("limbo", null, window_flags);
    
    
    
    ImGui.End();
}

function ShowGreedWindow(): void {
    const window_flags = ImGui.WindowFlags.NoScrollbar | ImGui.WindowFlags.NoTitleBar;
    ImGui.Begin("greed", null, window_flags);

    ImGui.SetWindowSize(new ImGui.Vec2(240, 240), ImGui.Cond.Once);
    ImGui.PushTextWrapPos(ImGui.GetWindowWidth() - 2.0);
    
    ImGui.Text("you see a homeless person; their clothes are worn, their eyes look tired, they smell. They ask for some change, you have a few coins in your pocket, do you hand them over?");
    
    ImGui.PopTextWrapPos();
    ImGui.End();
}

function ShowAngerWindow(): void {
    const window_flags = ImGui.WindowFlags.NoScrollbar | ImGui.WindowFlags.NoTitleBar;
    ImGui.Begin("anger", null, window_flags);
    
    
    
    ImGui.End();
}

function ShowWasteWindow(): void {
    const window_flags = ImGui.WindowFlags.NoScrollbar | ImGui.WindowFlags.NoTitleBar;
    ImGui.Begin("waste", null, window_flags);
    
    
    
    ImGui.End();
}

function ShowLustWindow(): void {
    const window_flags = ImGui.WindowFlags.NoScrollbar | ImGui.WindowFlags.NoTitleBar;
    ImGui.Begin("lust", null, window_flags);
    
    
    
    ImGui.End();
}

function ShowHeavenWindow(): void {
    const window_flags = ImGui.WindowFlags.NoScrollbar | ImGui.WindowFlags.NoTitleBar;
    ImGui.Begin("heaven", null, window_flags);
    
    
    
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

let video_url: string = "assets/skibidi.mp4";
let video_element: HTMLVideoElement | null = null;
let video_gl_texture: WebGLTexture | null = null;
let video_w: number = 280;
let video_h: number = 480;

// --------------------------------------
// TODO : REFACTOR so we can have many videos playing at the same time!!
// --------------------------------------
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
    
}
