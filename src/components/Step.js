import React, { useState } from 'react';

const StepInput = ({ onFileChange, onStepChange, onFileSubmit, onOrderPChange, onOrderDChange, onOrderQChange, onSeasonalOrderPChange, onSeasonalOrderDChange, onSeasonalOrderQChange }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    onFileChange(event.target.files[0]);
  };

  const handleStepsChange = (event) => {
    onStepChange(event.target.value);
  };

  const handleOrderPChange = (event) => {
    onOrderPChange(event.target.value);
  };

  const handleOrderDChange = (event) => {
    onOrderDChange(event.target.value);
  };

  const handleOrderQChange = (event) => {
    onOrderQChange(event.target.value);
  };

  const handleSeasonalOrderPChange = (event) => {
    onSeasonalOrderPChange(event.target.value);
  };

  const handleSeasonalOrderDChange = (event) => {
    onSeasonalOrderDChange(event.target.value);
  };

  const handleSeasonalOrderQChange = (event) => {
    onSeasonalOrderQChange(event.target.value);
  };

  return (
    <div>
      <label className='mb-2 mt-2 inline-block text-black text-lg font-bold'> Forecasting
      </label>
      <input type="file" className='relative mb-3 block w-auto min-w-0 flex-auto cursor-pointer rounded border border-solid border-secondary-500 bg-white bg-clip-padding px-3 py-[0.32rem] text-base font-normal leading-[2.15] text-surface transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:me-3 file:cursor-pointer file:overflow-hidden file:rounded-none file:border-0 file:border-e file:border-solid file:border-inherit file:bg-gray-300 file:px-3  file:py-[0.32rem] file:text-surface focus:border-primary focus:text-gray-700 focus:shadow-inset focus:outline-none' onChange={handleFileChange} />
      <div className='flex flex-wrap gap-5'>
        <input type="number" className='relative peer block min-h-[auto] mb-3 w-auto rounded border-1 bg-white px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[twe-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none text-black' placeholder='Steps...' onChange={handleStepsChange} />
        <input type="number" className='relative peer block min-h-[auto] mb-3 w-auto rounded border-1 bg-white px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[twe-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none text-black' placeholder='Order P...' onChange={handleOrderPChange} />
        <input type="number" className='relative peer block min-h-[auto] mb-3 w-auto rounded border-1 bg-white px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[twe-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none text-black' placeholder='Order D...' onChange={handleOrderDChange} />
        <input type="number" className='relative peer block min-h-[auto] mb-3 w-auto rounded border-1 bg-white px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[twe-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none text-black' placeholder='Order Q...' onChange={handleOrderQChange} />
        <input type="number" className='relative peer block min-h-[auto] mb-3 w-auto rounded border-1 bg-white px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[twe-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none text-black' placeholder='Seasonal Order P...' onChange={handleSeasonalOrderPChange} />
        <input type="number" className='relative peer block min-h-[auto] mb-3 w-auto rounded border-1 bg-white px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[twe-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none text-black' placeholder='Seasonal Order D...' onChange={handleSeasonalOrderDChange} />
        <input type="number" className='relative peer block min-h-[auto] mb-3 w-auto rounded border-1 bg-white px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[twe-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none text-black' placeholder='Seasonal Order Q...' onChange={handleSeasonalOrderQChange} />
      </div>
      <button onClick={onFileSubmit} className='inline-block rounded bg-blue-700 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-blue-950 transition duration-150 ease-in-out hover:bg-blue-500 hover:shadow-primary-2'>Submit</button>
    </div>
  );
};

export default StepInput;
