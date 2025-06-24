import React from "react";
import "./LanguageOptions.css"; // <-- Import file CSS vào đây

const LanguageOptions = ({ // Nhớ thêm dấu ngoặc nhọn {} để destructure props
  selectedTranslateLang,
  setSelectedTranslateLang,
  setShowLanguageOptions,
  handleOptionClick
}) => {
  return (
    <div className="language-options-container"> {/* Áp dụng class */}
      {/* <label className="language-label">
        Language used in video
      </label> */}
      <select
        value={selectedTranslateLang || ""}
        onChange={(e) => setSelectedTranslateLang(e.target.value)}
        className="language-select" // Áp dụng class
      >
        <option value="en">English</option>
        <option value="vi">Vietnamese</option>
        <option value="ja">Japanese</option>
        <option value="ko">Korean</option>
        <option value="es">Spanish</option>
        <option value="fr">French</option>
        <option value="de">German</option>
        <option value="zh">Chinese</option>
        <option value="ru">Russian</option>
        <option value="ar">Arabic</option>
        <option value="pt">Portuguese</option>
        <option value="it">Italian</option>
        <option value="nl">Dutch</option>
        <option value="tr">Turkish</option>
        <option value="pl">Polish</option>
        <option value="sv">Swedish</option>
        <option value="da">Danish</option>
        <option value="fi">Finnish</option>
        <option value="no">Norwegian</option>
        <option value="el">Greek</option>
        <option value="he">Hebrew</option>
        <option value="hi">Hindi</option>
        <option value="th">Thai</option>
        <option value="id">Indonesian</option>
        <option value="ms">Malay</option>
        <option value="bn">Bengali</option>
        <option value="pa">Punjabi</option>
        <option value="ur">Urdu</option>
        <option value="fa">Persian</option>
        <option value="hu">Hungarian</option>
        <option value="cs">Czech</option>
        <option value="ro">Romanian</option>
        <option value="uk">Ukrainian</option>
        <option value="bg">Bulgarian</option>
        <option value="sr">Serbian</option>
        <option value="hr">Croatian</option>
        <option value="sk">Slovak</option>
        <option value="sl">Slovenian</option>
        <option value="et">Estonian</option>
        <option value="lv">Latvian</option>
        <option value="lt">Lithuanian</option>
      </select>
      <button
        className="create-button" // Áp dụng class
        onClick={() => {
          setShowLanguageOptions(false);
          handleOptionClick("Create lyric automatically");
        }}
      >
        Tạo
      </button>
    </div>
  );
};

export default LanguageOptions;