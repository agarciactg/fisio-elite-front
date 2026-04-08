export function HeaderCell({ name, spec, img, color, noBorder }: any) {
  return (
    <div className={`h-16 px-6 flex items-center gap-4 ${noBorder ? '' : 'border-r border-surface-container-high'}`}>
      <img alt={name} className="w-8 h-8 rounded-full object-cover" src={img} />
      <div>
        <p className="text-sm font-bold mb-0">{name}</p>
        <p className={`text-[10px] ${color} font-bold uppercase tracking-wider mb-0`}>{spec}</p>
      </div>
    </div>
  );
}
