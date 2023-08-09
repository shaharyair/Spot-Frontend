import { Tooltip as ReactTooltip } from "react-tooltip";

function Tooltip({ childrenStyle, message, position, variant, children }) {
  const tooltipStyle = {
    backgroundColor: "#000000",
    fontWeight: "300",
    zIndex: "999",
  };

  return (
    <>
      <div
        className={childrenStyle}
        data-tooltip-id='my-tooltip'
        data-tooltip-content={message}
        data-tooltip-place={position}
        data-tooltip-variant={variant}
      >
        {children}
      </div>
      <ReactTooltip id='my-tooltip' style={tooltipStyle} />
      <div />
    </>
  );
}

export default Tooltip;
