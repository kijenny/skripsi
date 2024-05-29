// src/components/InputForm.js
import React, { useState } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TextField } from '@mui/material';

const InputForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    month: null, // Change to null for better representation of date
    sales: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      onSubmit(formData);
      // Reset nilai form setelah data disimpan
      setFormData({ month: null, sales: '' });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDateChange = (date) => {
    // Extract the month and year from the selected date
    const formattedDate = date ? `${date.format('MM/YYYY')}` : null;

    setFormData((prevData) => ({
      ...prevData,
      month: formattedDate,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className='w-full max-w-lg'>
      <div className='flex flex-wrap -mx-3 mb-6'>
        <div className='w-full md:w-1/2 px-3 mb-6 md:mb-0 border py-5'>
          <TextField
            className='w-full mb-3'
            id="filled-password-input"
            label="Number"
            type="number"
            InputProps={{
              classes: {
                root: 'bg-gray-200',
                input: 'text-black py-3 px-4 focus:outline-none',
                notchedOutline: 'border rounded',
              },
            }}
            InputLabelProps={{
              shrink: true,
              className: 'focus:bg-white',
            }}
            name="sales"
            value={formData.sales}
            onChange={handleChange}
          />
        </div>
        <div className='w-full md:w-1/2 px-3 mb-6 md:mb-0 border py-5'>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              className='appearance-none block w-full bg-gray-200 text-black border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white'
              name='month'
              label={'"month" and "year"'}
              value={formData.month}
              views={['month', 'year']}
              onChange={handleDateChange}// Use handleDateChange for DatePicker
            />
          </LocalizationProvider>
        </div>
      </div>
      <button type="submit">Save Data</button>
    </form>
  );
};

export default InputForm;
