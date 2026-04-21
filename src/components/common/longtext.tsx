import { useState } from "react";

  const LongText = ({text}:{text:string}) => {
    const [expanded, setExpanded] = useState(false);
    const isLong = text.length > 120;
    return(
      <div className="text-justify text-muted-foreground leading-relaxed">
        <p className={` text-sm  text-justify ${expanded ? "" : "line-clamp-3"}`}>
          {text}
        </p>
      {isLong && (
        <button
        onClick={() => setExpanded((prev) => !prev)}
          className="underline text-xs"
        >
          {expanded ? "see less" : "see more"}
        </button>
      )}
      </div>
    )
  }

  export default LongText;