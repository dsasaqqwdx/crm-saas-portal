
import { useState, useEffect } from "react";

export function usePageOffset() {
  const [offset, setOffset] = useState(
    typeof window !== "undefined" && window.innerWidth < 768 ? "0px" : "250px"
  );

  useEffect(() => {
    const update = () => setOffset(window.innerWidth < 768 ? "0px" : "250px");
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return offset;
}

export function PageContent({ children, className = "", style = {} }) {
  const offset = usePageOffset();
  const isMobile = offset === "0px";

  return (
    <div
      className={`flex-grow-1 ${className}`}
      style={{
        marginLeft: offset,
        paddingTop: isMobile ? "62px" : "0px",
        minWidth: 0,
        transition: "margin-left 0.3s ease",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
