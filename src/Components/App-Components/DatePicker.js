import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const BirthdateInput = ({ selectedDate, setSelectedDate }) => {


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
        onChange={(date) => setSelectedDate(date)}
        dateFormat="MMMM d, yyyy"
        value={selectedDate ? formatDateToWords(selectedDate) : ""}
      />
    </div>
  );
};

export default BirthdateInput;
