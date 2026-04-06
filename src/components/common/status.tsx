
  export const Status = ({ icon, value, color, label }:any) => (
    <div className="flex gap-2 items-center">
      <div className={`bg-${color}-500 p-2 rounded-xl text-${color}-500  border`}>
        {icon}
      </div>
      <h5>{value}</h5>
      <span className="text-xs">{label}</span>
    </div>
  )