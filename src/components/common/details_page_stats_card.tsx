
export default function StatusCard({ icon, label, value, suffix = "", color, bgIcon }: any) {
    const colorClasses = color === 'green' ? 'text-emerald-500 bg-emerald-500/10 ring-emerald-500/20' : 'text-primary bg-primary/10 ring-primary/20';

    return (
        <div className="group relative bg-card border border-border p-6 md:p-8 rounded-3xl overflow-hidden transition-all hover:shadow-md">
            <div className={`absolute top-0 right-0 p-4 opacity-5 transition-opacity group-hover:opacity-10 ${color === 'green' ? 'text-emerald-500' : 'text-primary'}`}>
                {bgIcon}
            </div>
            <div className="flex items-center gap-5">
                <div className={`p-4 rounded-2xl ring-1 ${colorClasses}`}>
                    {icon}
                </div>
                <div>
                    <p className="text-xs md:text-sm text-muted-foreground font-semibold uppercase tracking-wider">
                        {label}
                    </p>
                    <h3 className="text-2xl md:text-4xl font-black tracking-tighter">
                        {(value || 0).toLocaleString()} {suffix && <span className="text-sm font-medium text-muted-foreground">{suffix}</span>}
                    </h3>
                </div>
            </div>
        </div>
    )
}
