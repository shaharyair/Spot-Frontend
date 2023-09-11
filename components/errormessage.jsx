function ErrorMessage({ message }) {
  return (
    <div className='bg-red-200 p-3 mx-5 rounded-lg'>
      <p className='text-red-700 text-sm lg:text-lg'>{message}</p>
    </div>
  );
}

export default ErrorMessage;
