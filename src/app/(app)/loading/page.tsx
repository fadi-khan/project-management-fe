export default function Loading() {
    return (


        <div className="flex gap-2 justify-center items-center h-16">
            <div className="animate-[wiggle_0.9s_ease_infinite] [animation-delay:0s] border-2 border-blue-500 bg-blue-500  w-[6px] h-16"></div>
            <div className="animate-[wiggle_0.9s_ease_infinite] [animation-delay:-0.3s] border-2 border-green-500 bg-green-500  w-[6px] h-16"></div>
            <div className="animate-[wiggle_0.9s_ease_infinite] [animation-delay:-0.6s] border-2 border-red-500 bg-red-500  w-[6px] h-16"></div>
            <div className="animate-[wiggle_0.9s_ease_infinite] [animation-delay:-0.2s] border-2 border-yellow-500 bg-yellow-500  w-[6px] h-16"></div>
            <div className="animate-[wiggle_0.9s_ease_infinite] [animation-delay:-0.5s] border-2 border-pink-500 bg-pink-500  w-[6px] h-16"></div>
        </div>
    );
}