import type {WidgetCardProps} from "../types/widget.ts";

const WidgetCard = ({ title, children }: WidgetCardProps) => {
  return (
    <section
      className="bg-white p-3 sm:p-4 md:p-6 rounded-xl shadow-md ring-1 ring-gray-200 focus-within:ring-2 focus-within:ring-blue-500 transition flex flex-col h-44 sm:h-52 md:h-56"
      role="listitem"
      aria-label={title}
    >
      <header className="flex items-center justify-between mb-2 sm:mb-3">
        <h2 className="text-xs sm:text-sm md:text-base font-semibold text-gray-800 truncate">{title}</h2>
        <span className="text-[10px] sm:text-xs text-gray-400 shrink-0" aria-hidden>
          Drag to rearrange
        </span>
      </header>
      <div className="text-gray-500 text-xs sm:text-sm flex-1 flex items-center justify-center text-center">
        {children || "Widget content placeholder"}
      </div>
    </section>
  );
};

export default WidgetCard;
