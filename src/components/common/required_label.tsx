
export default function RequiredLabel({
    label
} : {
    label: string
}) {
  return (
    <div className="flex flex-row gap-1">
        <p>{label}</p>
        <span className="text-destructive">*</span>
    </div>
  )
}
