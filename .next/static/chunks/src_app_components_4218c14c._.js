(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/app/components/articles/HIV-Quiz.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HIVQuiz,
    "initHivQuiz",
    ()=>initHivQuiz
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
function initHivQuiz() {
    const form = document.getElementById('hiv-quiz');
    const loadingScreen = document.getElementById('loading-screen');
    const feedback = document.getElementById('feedback');
    const feedbackText = document.getElementById('feedback-text');
    if (!form) return;
    const feedbacks = {
        '1': {
            text: 'Kalau dicuekin, kamu malah bisa tetap bingung. Yuk, kita bahas bareng-bareng soal HIV supaya kamu nggak termakan mitos.',
            style: 'border-yellow-400 bg-yellow-50 text-yellow-800'
        },
        '2': {
            text: 'Hmm, hati-hati ya. Kalau cuma percaya cerita orang tanpa cek kebenarannya, bisa bikin kamu salah paham tentang HIV. Yuk, kita bahas bareng-bareng soal HIV supaya kamu makin paham dan bisa jaga diri.',
            style: 'border-red-400 bg-red-50 text-red-800'
        },
        '3': {
            text: 'Keren! kamu udah langkah yang tepat! Yuk, kita bahas bareng-bareng soal HIV supaya kamu makin paham dan bisa jaga diri.',
            style: 'border-green-400 bg-green-50 text-green-800'
        }
    };
    form.addEventListener('submit', (e)=>{
        var _form_querySelector;
        e.preventDefault();
        const selectedValue = (_form_querySelector = form.querySelector('input[name="mini-story"]:checked')) === null || _form_querySelector === void 0 ? void 0 : _form_querySelector.value;
        if (!selectedValue) {
            alert('Pilih salah satu jawaban dulu ya! 😊');
            return;
        }
        // Save to localStorage
        localStorage.setItem('hiv-quiz-answer', selectedValue);
        // Show loading screen
        form.style.display = 'none';
        loadingScreen.classList.remove('hidden');
        // Show feedback after 3 seconds
        setTimeout(()=>{
            loadingScreen.classList.add('hidden');
            const selectedFeedback = feedbacks[selectedValue];
            feedbackText.textContent = selectedFeedback.text;
            feedback.className = "mt-6 p-4 rounded-xl border-l-4 ".concat(selectedFeedback.style);
            feedback.classList.remove('hidden');
        }, 3000);
    });
}
function HIVQuiz() {
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HIVQuiz.useEffect": ()=>{
            initHivQuiz();
        }
    }["HIVQuiz.useEffect"], []);
    return null; // This component only handles logic
}
_s(HIVQuiz, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = HIVQuiz;
var _c;
__turbopack_context__.k.register(_c, "HIVQuiz");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/components/ui/CustomButton.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CustomButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
'use client';
;
function CustomButton(param) {
    let { title, className = "", onClick, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        className: "\n        relative cursor-pointer outline-none align-middle no-underline\n        font-inherit touch-manipulation font-semibold text-[#382b22] uppercase\n        bg-[#fff0f0] border-2 border-[#b18597] rounded-xl\n        transform-gpu transition-all duration-150 ease-[cubic-bezier(0,0,0.58,1)]\n        before:absolute before:content-[''] before:w-full before:h-full\n        before:top-0 before:left-0 before:right-0 before:bottom-0\n        before:bg-[#f9c4d2] before:rounded-xl\n        before:shadow-[0_0_0_2px_#b18597,0_0.625em_0_0_#ffe3e2]\n        before:transform before:translate3d-[0,0.75em,-1em]\n        before:transition-all before:duration-150 before:ease-[cubic-bezier(0,0,0.58,1)]\n        hover:bg-[#ffe9e9] hover:translate-y-1\n        hover:before:shadow-[0_0_0_2px_#b18597,0_0.5em_0_0_#ffe3e2]\n        hover:before:transform hover:before:translate3d-[0,0.5em,-1em]\n        active:bg-[#ffe9e9] active:translate-y-3\n        active:before:shadow-[0_0_0_2px_#b18597,0_0_#ffe3e2]\n        active:before:transform active:before:translate3d-[0,0,-1em]\n        ".concat(className, "\n      "),
        role: "button",
        onClick: onClick,
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "relative z-10",
            children: title || 'Button'
        }, void 0, false, {
            fileName: "[project]/src/app/components/ui/CustomButton.js",
            lineNumber: 29,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/components/ui/CustomButton.js",
        lineNumber: 5,
        columnNumber: 5
    }, this);
}
_c = CustomButton;
var _c;
__turbopack_context__.k.register(_c, "CustomButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_app_components_4218c14c._.js.map