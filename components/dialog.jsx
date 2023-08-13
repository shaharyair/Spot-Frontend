import { Button } from "./ui/button";

function Dialog({ message, onClick }) {
  return (
    <div className='z-[999] fixed top-0 left-0 h-screen w-screen flex justify-center items-center bg-dialogBlack/25 backdrop-blur-[3px] animate-fade-in text-center'>
      <div className='h-[25vh] w-[75vw] min-h-[150px] min-w-[250px] max-h-[200px] max-w-[350px] p-5 rounded-lg bg-dialogBlack border border-white flex flex-col items-center justify-evenly drop-shadow-md'>
        <p className=' text-white font-thin text-lg lg:text-xl'>{message}</p>
        <Button
          className='bg-bpmPink text-black hover:bg-white duration-200'
          onClick={onClick}
        >
          Close
        </Button>
      </div>
    </div>
  );
}

export default Dialog;
