'use client';

export default function CustomButton({ title, className = "", onClick, id, ...props }) {
  const isShareButton = id === 'share-btn';
  
  return (
    <button
      id={id}
      className={`
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
      `}
      role="button"
      onClick={onClick}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">
        {isShareButton ? (
          <>
            Bagikan
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"></path>
            </svg>
          </>
        ) : (
          title || 'Button'
        )}
      </span>
    </button>
  )
}
