// MyDatePicker.js
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const MyDatePicker = ({ selectedDate, onChange }) => {
  // Function to convert the selected date into words
  const formatDateToWords = (date) => {
    const options = {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  return (
    <div>
      <DatePicker
        className="birthdate01"
        selected={selectedDate}
        onChange={onChange} // Ensure that the onChange event properly updates the selected date
        dateFormat="MMMM d, yyyy"
        value={selectedDate ? formatDateToWords(selectedDate) : ""}
      />
    </div>
  );
};

export default MyDatePicker;
