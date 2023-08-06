import { BarLoader } from "react-spinners";

function LoadingBar() {
  return (
    <BarLoader
      color='#E73059'
      cssOverride={{
        width: "50vw",
        maxWidth: "350px",
        minWidth: "250px",
      }}
    />
  );
}

export default LoadingBar;
