import { Button } from "./ui/button";

function WarningDialog({ title, message, onClickAction, onClickCancel }) {
  return (
    <div className='z-[999] fixed top-0 left-0 h-screen w-screen flex justify-center items-center bg-black/25 backdrop-blur animate-fade-in text-center'>
      <div className='h-[25vh] w-[75vw] min-h-[150px] min-w-[250px] max-h-[200px] max-w-[350px] grid grid-cols-2 grid-rows-auto p-5 rounded-lg bg-dialogBlack border border-white drop-shadow-md items-center justify-evenly gap-x-3'>
        <h1 className='text-white text-lg lg:text-xl row-start-1 col-span-2'>
          {title}
        </h1>
        <p className=' text-white font-thin text-sm lg:text-base row-start-2 col-span-2'>
          {message}
        </p>
        <Button
          className='bg-gray-600 text-black hover:bg-white duration-200 col-start-1 row-start-3 text-xs lg:text-base'
          onClick={onClickCancel}
        >
          Cancel
        </Button>
        <Button
          className='bg-bpmPink text-black hover:bg-white duration-200 col-start-2 row-start-3 text-xs lg:text-base'
          onClick={onClickAction}
          type='submit'
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

export default WarningDialog;
