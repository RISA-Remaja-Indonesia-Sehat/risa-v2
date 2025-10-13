module.exports = [
"[project]/src/app/components/articles/HIV-Quiz.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HIVQuiz,
    "initHivQuiz",
    ()=>initHivQuiz
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
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
        e.preventDefault();
        const selectedValue = form.querySelector('input[name="mini-story"]:checked')?.value;
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
            feedback.className = `mt-6 p-4 rounded-xl border-l-4 ${selectedFeedback.style}`;
            feedback.classList.remove('hidden');
        }, 3000);
    });
}
function HIVQuiz() {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        initHivQuiz();
    }, []);
    return null; // This component only handles logic
}
}),
"[project]/src/app/components/ui/CustomButton.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CustomButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
'use client';
;
function CustomButton({ title, className = "", onClick, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        className: `
        relative cursor-pointer outline-none align-middle no-underline
        font-inherit touch-manipulation font-semibold text-[#382b22] uppercase
        bg-[#fff0f0] border-2 border-[#b18597] rounded-xl
        transform-gpu transition-all duration-150 ease-[cubic-bezier(0,0,0.58,1)]
        before:absolute before:content-[''] before:w-full before:h-full
        before:top-0 before:left-0 before:right-0 before:bottom-0
        before:bg-[#f9c4d2] before:rounded-xl
        before:shadow-[0_0_0_2px_#b18597,0_0.625em_0_0_#ffe3e2]
        before:transform before:translate3d-[0,0.75em,-1em]
        before:transition-all before:duration-150 before:ease-[cubic-bezier(0,0,0.58,1)]
        hover:bg-[#ffe9e9] hover:translate-y-1
        hover:before:shadow-[0_0_0_2px_#b18597,0_0.5em_0_0_#ffe3e2]
        hover:before:transform hover:before:translate3d-[0,0.5em,-1em]
        active:bg-[#ffe9e9] active:translate-y-3
        active:before:shadow-[0_0_0_2px_#b18597,0_0_#ffe3e2]
        active:before:transform active:before:translate3d-[0,0,-1em]
        ${className}
      `,
        role: "button",
        onClick: onClick,
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
}),
];

//# sourceMappingURL=src_app_components_9e6af2de._.js.map