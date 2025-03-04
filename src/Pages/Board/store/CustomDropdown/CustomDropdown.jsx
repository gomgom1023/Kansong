import React, { useState, useEffect } from "react";
import "../CustomDropdown/CustomDropdown.css";

const CustomDropdown = ({ selectedValue, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState(false); // 🔥 값이 변경되면 활성화

  const options = ["전체", "제목", "내용"];

  // 🔥 값이 변경될 때 isActive 활성화
  useEffect(() => {
    if (selectedValue) {
      setIsActive(true);
    }
  }, [selectedValue]);

  return (
    <div className={`custom-dropdown ${isOpen || isActive ? "open" : ""}`}>
      <div
        className={`dropdown-header ${isOpen || isActive ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedValue}
        <span className={`arrow ${isOpen ? "open" : ""}`}>
          <i className="xi-angle-down-min"></i>
        </span>
      </div>

      {/* 옵션 리스트 */}
      {isOpen && (
        <ul className="dropdown-list">
          {options.map((option) => (
            <li
              key={option}
              className={`dropdown-item ${selectedValue === option ? "selected" : ""}`}
              onClick={() => {
                onSelect(option);
                setIsOpen(false);
              }}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomDropdown;
