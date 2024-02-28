import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import "./Datepicker.css";

const MyDatePicker = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = date => {
    setSelectedDate(date);
  };

  return (
    <div>
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        dateFormat="MM/dd/yyyy"
        isClearable
        placeholderText="Select a date"
      />
      {selectedDate && (
        <p>You selected: {selectedDate.toLocaleDateString()}</p>
      )}
    </div>
  );
};

export default MyDatePicker;


