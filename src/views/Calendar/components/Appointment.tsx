import { Badge, Tooltip } from "antd";

export function Appointment({
    top,
    h,
    name,
    time,
    status = 'Confirmed',
    badgeStatus = 'success',
    tx,
    scheme = {
        bg: 'bg-primary-fixed/40',
        border: 'border-primary',
        text: 'text-on-primary-fixed',
    }
}: any) {
    return (
        <Tooltip title={`${name} - ${time} (${status})`}>
            <div
                className={`
          absolute left-1 right-1
          ${scheme.bg}
          border-l-4 ${scheme.border}
          rounded-xl
          p-3
          flex flex-col justify-between
          cursor-pointer
          transition-all
          shadow-sm hover:shadow-md
        `}
                style={{ top, height: h }}
            >
                {/* Header */}
                <div className="flex justify-between items-start mb-1">
                    <p className={`text-[11px] font-black ${scheme.text} leading-tight mb-0`}>
                        {name}
                    </p>

                    <span className={`
            text-[9px]
            bg-white/80
            px-1.5 py-0.5
            rounded-full
            font-bold
            shadow-sm
            ${scheme.text}
          `}>
                        {time}
                    </span>
                </div>

                {/* Texto extra */}
                {tx && (
                    <div className={`text-[9px] ${scheme.text} opacity-80 italic line-clamp-2`}>
                        {tx}
                    </div>
                )}

                {/* Footer */}
                <div className="flex items-center gap-1 mt-auto pt-1">
                    <Badge status={badgeStatus} size="small" />
                    <span className={`text-[9px] font-bold ${scheme.text} opacity-80`}>
                        {status}
                    </span>
                </div>
            </div>
        </Tooltip>
    );
}
