export default function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (value: boolean) => void; label?: string }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer w-fit">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-violet-900 rounded-full peer-checked:bg-accent duration-200"></div>
        <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full duration-200 peer-checked:translate-x-5"></div>
      </div>
      {label && <span className="text-sm font-medium">{label}</span>}
    </label>
  )
}