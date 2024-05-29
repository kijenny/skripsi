import React, { useState } from 'react';

const FileInput = ({ onFileChange, onStepChange, onFileSubmit }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    onFileChange(event.target.files[0]);
  };
  // const handleStepsChange = (event) => {
  //   onStepChange(event.target.value);
  // };

  return (
    <div>
      <label className='mb-2 inline-block text-black text-lg font-bold'> Cek Stasioneritas
      </label>
      <input type="file" className='relative mb-3 block w-auto min-w-0 flex-auto cursor-pointer rounded border border-solid border-secondary-500 bg-white bg-clip-padding px-3 py-[0.32rem] text-base font-normal leading-[2.15] text-surface transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:me-3 file:cursor-pointer file:overflow-hidden file:rounded-none file:border-0 file:border-e file:border-solid file:border-inherit file:bg-gray-300 file:px-3  file:py-[0.32rem] file:text-surface focus:border-primary focus:text-gray-700 focus:shadow-inset focus:outline-none' onChange={handleFileChange} />
      {/* <input type="number" placeholder='Steps...' onChange={handleStepsChange} /> */}
      <button onClick={onFileSubmit} className='inline-block rounded bg-blue-700 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-blue-950 transition duration-150 ease-in-out hover:bg-blue-500 hover:shadow-primary-2'>Submit</button>
    </div>
  );
};

export default FileInput;
