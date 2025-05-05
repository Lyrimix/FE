import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Offcanvas, OffcanvasHeader, OffcanvasBody, Button } from "reactstrap";
import {
  ASS_FONTS,
  ALIGNMENT_MAPPING,
  POSITIONS,
  TABS_CUSTOMS,
  BUTTONS,
} from "../../utils/constant";
import { bgrToRgb, convertHexToASS } from "../../utils/file";
import "../sidebar/CustomLyrics.css";
import { useProjectContext } from "../../utils/context/ProjectContext";

const CustomLyrics = ({ isOpen, toggle, lyric, handleSaveLyric }) => {
  const [lyricEdit, setLyricEdit] = useState([]);
  const [align, setAlign] = useState(null);
  const [font, setFont] = useState("Arial");
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);
  const [fontSize, setFontSize] = useState(22);
  const [primaryColor, setPrimaryColor] = useState("");
  const [secondaryColor, setSecondaryColor] = useState("");
  const [outlineColor, setOutlineColor] = useState("");
  const [backColor, setBackColor] = useState("");
  const [strikeOut, setStrikeOut] = useState(0);
  const [activeBorder, setActiveBorder] = useState(false);
  const [borderStyle, setBorderStyle] = useState(1);
  const [selected, setSelected] = useState(2);
  const [scaleX, setScaleX] = useState(100);
  const [scaleY, setScaleY] = useState(100);
  const [outline, setOutline] = useState(0);
  const [shadow, setShadow] = useState(0);
  const [marginL, setMarginL] = useState(null);
  const [marginR, setMarginR] = useState(null);
  const [marginV, setMarginV] = useState(null);
  const [activeTab, setActiveTab] = useState("font");
  const { alignAttribute, setAlignAttribute } = useProjectContext();

  const colors = [
    { label: "Primary", value: primaryColor, setter: setPrimaryColor },
    {
      label: "Secondary",
      value: secondaryColor,
      setter: setSecondaryColor,
    },
    { label: "Outline", value: outlineColor, setter: setOutlineColor },
    { label: "Background", value: backColor, setter: setBackColor },
  ];
  const INPUT_FIELDS = [
    { label: "Scale X", value: scaleX, onChange: setScaleX, placeholder: "X" },
    { label: "Scale Y", value: scaleY, onChange: setScaleY, placeholder: "Y" },
    {
      label: "Outline",
      value: outline,
      onChange: (val) => setOutline(Math.max(0, Number(val))),
      placeholder: "0",
    },
    {
      label: "Shadow",
      value: shadow,
      onChange: (val) => setShadow(Math.max(0, Number(val))),
      placeholder: "0",
    },
  ];

  const MARGINS = [
    { id: "left", value: marginL, placeholder: "L" },
    { id: "right", value: marginR, placeholder: "R" },
    { id: "vertical", value: marginV, placeholder: "V" },
  ];
  const getHorizontalAlign = () => {
    if (align?.endsWith("L")) return "flex-start";
    if (align?.endsWith("C")) return "center";
    if (align?.endsWith("R")) return "flex-end";
    return "center";
  };

  const getVerticalAlign = () => {
    if (align?.startsWith("T")) return "flex-start";
    if (align?.startsWith("C")) return "center";
    if (align?.startsWith("B")) return "flex-end";
    return "center";
  };
  useEffect(() => {
    if (Array.isArray(lyric) && typeof lyric[0] === "string") {
      const assContent = lyric[0];
      const lines = assContent.split("\n");

      const styleSection = lines.slice(
        lines.findIndex((line) => line.startsWith("[V4+ Styles]")) + 1,
        lines.findIndex((line) => line.startsWith("[Events]"))
      );

      const styleFormat = styleSection.find((line) =>
        line.startsWith("Style:")
      );

      if (styleFormat) {
        const parts = styleFormat.split(",");

        setFont(parts[1].trim());
        setFontSize(parseInt(parts[2].trim(), 10));
        setPrimaryColor(bgrToRgb(parts[3].trim()));
        setSecondaryColor(bgrToRgb(parts[4].trim()));
        setOutlineColor(bgrToRgb(parts[5].trim()));
        setBackColor(bgrToRgb(parts[6].trim()));

        setBold(parts[7].trim() === "-1");
        setItalic(parts[8].trim() === "-1");
        setUnderline(parts[9].trim() === "-1");
        setStrikeOut(parts[10].trim() === "-1");

        setScaleX(parseFloat(parts[11].trim()));
        setScaleY(parseFloat(parts[12].trim()));
        setOutline(parseFloat(parts[16].trim()));
        setShadow(parseFloat(parts[17].trim()));

        setSelected(parseInt(parts[18].trim(), 10));
        setMarginL(parseInt(parts[19].trim(), 10));
        setMarginR(parseInt(parts[20].trim(), 10));
        setMarginV(parseInt(parts[21].trim(), 10));
      }

      setLyricEdit([]);
    } else {
      setLyricEdit([]);
    }
  }, [lyric]);

  const toggleBorder = () => {
    setActiveBorder(!activeBorder);
  };

  const getAlignmentNumber = (pos) => {
    return parseInt(ALIGNMENT_MAPPING[pos] || 5, 10);
  };

  const handleSelectAlign = (pos) => {
    setAlign(pos);
    setSelected(POSITIONS.indexOf(pos));
    setAlignAttribute(getAlignmentNumber(pos));
  };
  const handleMarginChange = (side, value) => {
    if (side === "left") setMarginL(value);
    if (side === "right") setMarginR(value);
    if (side === "vertical") setMarginV(value);
  };

  const handleSave = async (pos) => {
    if (!lyric || lyric.length === 0) return;
    let lines = lyric[0].split("\n");
    const styleStart = lines.findIndex((line) =>
      line.startsWith("[V4+ Styles]")
    );

    const eventStart = lines.findIndex((line) => line.startsWith("[Events]"));
    if (styleStart === -1 || eventStart === -1) {
      return;
    }

    const primaryColorValue = convertHexToASS(primaryColor);
    const secondaryColorValue = convertHexToASS(secondaryColor);
    const outlineColorValue = convertHexToASS(outlineColor);
    const backColorValue = convertHexToASS(backColor);

    if (
      !font ||
      !fontSize ||
      !primaryColorValue ||
      !secondaryColorValue ||
      !outlineColorValue ||
      !backColorValue
    ) {
      console.error("Missing style properties!");
      return;
    }

    const styleLine = `Style: Default,${font},${fontSize},${primaryColorValue},${secondaryColorValue},${outlineColorValue},${backColorValue},${
      bold ? "-1" : "0"
    },${italic ? "-1" : "0"},${underline ? "-1" : "0"},${
      strikeOut ? "-1" : "0"
    },${scaleX || 100},${scaleY || 100},0,0,${borderStyle || 1},${
      outline || 2
    },${shadow || 1},${alignAttribute || 2},${marginL || 10},${marginR || 10},${
      marginV || 30
    },1`;

    lines = lines.map((line, index) => {
      if (index === styleStart + 2) return styleLine.trim();
      return line;
    });

    const assContent = lines.join("\n");

    handleSaveLyric(assContent);
  };

  const fontOptions = ASS_FONTS.map((f) => ({ value: f, label: f }));
  return (
    <Offcanvas
      isOpen={isOpen}
      toggle={toggle}
      direction="end"
      backdrop={false}
      className="custom-offcanvas"
      fade={false}
    >
      <OffcanvasHeader
        toggle={toggle}
        className="header d-flex bg-white justify-content-between align-items-center px-3 py-3 text-black"
      >
        <div className="d-flex gap-1 px-1 py-2  h-100 p-10">Custom Lyrics</div>
      </OffcanvasHeader>
      <OffcanvasBody className="custom-lyric">
        <div className="tab-content" id="myTabContent">
          <h5 className=" mb-1 mt-1 name-text">Font</h5>

          <div className="d-flex align-items-center gap-1 mb-2">
            <Select
              options={fontOptions}
              value={fontOptions.find((option) => option.value === font)}
              onChange={(selected) => setFont(selected.value)}
              styles={{
                container: (provided) => ({
                  ...provided,
                  width: "155px",
                }),
                control: (provided) => ({
                  ...provided,
                  minHeight: "30px",
                  height: "30px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  padding: "0 6px",
                  display: "flex",
                  alignItems: "center",
                }),
                valueContainer: (provided) => ({
                  ...provided,
                  padding: "0 6px",
                  height: "30px",
                  display: "flex",
                }),
                indicatorsContainer: (provided) => ({
                  ...provided,
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                }),
                dropdownIndicator: (provided) => ({
                  ...provided,
                  padding: "0 6px",
                  display: "flex",
                  alignItems: "center",
                }),
                singleValue: (provided) => ({
                  ...provided,
                  display: "flex",
                  alignItems: "center",
                  lineHeight: "normal",
                  fontSize: "13px",
                }),
                menu: (provided) => ({
                  ...provided,
                  fontSize: "13px",
                }),

                menuList: (provided) => ({
                  ...provided,
                  maxHeight: "120px",
                  overflowY: "auto",
                  paddingTop: 0,
                  paddingBottom: 0,
                }),
                option: (provided) => ({
                  ...provided,
                  padding: "6px 8px",
                  fontSize: "13px",
                }),
              }}
            />

            <input
              type="number"
              className="form-control form-control-sm text-center"
              style={{
                width: "70px",
                height: "30px",
                fontSize: "13px",
                marginLeft: "20px",
                borderRadius: "6px",
                padding: "0 6px",
                lineHeight: "1",
              }}
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
            />
          </div>

          <div className="d-flex align-items-center gap-2 mb-2">
            {BUTTONS.map((btn) => (
              <button
                key={btn.state}
                className={`btn btn-sm btn-toggle ${
                  eval(btn.state) ? "btn-secondary" : "btn-light"
                } ${btn.styleClass}`}
                onClick={() => {
                  switch (btn.state) {
                    case "bold":
                      setBold(!bold);
                      break;
                    case "italic":
                      setItalic(!italic);
                      break;
                    case "underline":
                      setUnderline(!underline);
                      break;
                    case "strikeOut":
                      setStrikeOut(!strikeOut);
                      break;
                    default:
                      break;
                  }
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>

          <h5 className="mb-1 name-text">Color</h5>

          <div className="d-flex flex-wrap gap-2">
            {colors.map((color, index) => (
              <div
                key={index}
                className="d-flex align-items-center justify-content-between px-2"
                style={{
                  width: "48%",
                  height: "26px",
                  backgroundColor: "#ddd",
                  borderRadius: "4px",
                }}
              >
                <span
                  style={{
                    fontSize: "14px",

                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  {color.label}
                </span>

                <input
                  type="color"
                  style={{
                    width: "20px",
                    height: "20px",
                    border: "none",
                    backgroundColor: "transparent",
                    cursor: "pointer",
                  }}
                  value={color.value.rgb}
                  onChange={(e) => color.setter(e.target.value)}
                />
              </div>
            ))}
          </div>
          <div
            className="mb-1 d-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "1px 5px",
            }}
          >
            {INPUT_FIELDS.map((input) => (
              <div key={input.label} className="d-flex flex-column">
                <label
                  className="form-label name-text"
                  style={{
                    fontSize: "14px",
                    paddingTop: "3px",
                  }}
                >
                  {input.label}
                </label>
                <input
                  type="number"
                  className="form-control form-control-sm rounded-2"
                  style={{
                    fontSize: "13px",
                    padding: "0 6px",
                    height: "24px",
                  }}
                  value={input.value}
                  onChange={(e) => input.onChange(e.target.value)}
                  placeholder={input.placeholder}
                />
              </div>
            ))}
          </div>

          <div className="container my-1 g-0">
            <div className="row g-0">
              <div className="col-md-6 d-flex flex-column ">
                <h5 className="mb-1 mt-1 name-text">Alignment</h5>
                <div className="align-box d-grid gap-2 ">
                  {POSITIONS.map((pos, index) => (
                    <div
                      key={pos}
                      className={`align-item ${
                        selected === index ? "active" : ""
                      }`}
                      onClick={() => handleSelectAlign(pos)}
                      title={pos}
                    >
                      &nbsp;
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-md-6 d-flex flex-column ">
                <div className="mb-0 mt-1 name-text">Margin</div>
                <div className="d-flex flex-column gap-2">
                  {MARGINS.map((margin) => (
                    <input
                      key={margin.id}
                      type="number"
                      className="form-control form-margin input-margin rounded-2"
                      value={margin.value}
                      onChange={(e) =>
                        handleMarginChange(margin.id, e.target.value)
                      }
                      placeholder={margin.placeholder}
                      aria-label={margin.id}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div
            id="box-preview"
            style={{
              alignItems: getVerticalAlign(),
              justifyContent: getHorizontalAlign(),
            }}
          >
            <span
              className="preview-text rounded-2"
              style={{
                fontFamily: font,
                justifyContent: getHorizontalAlign(),
                alignItems: getVerticalAlign(),
                fontSize: `${fontSize}px`,
                backgroundColor: `${backColor}`,
                color: `${primaryColor}`,
                textShadow: `2px 2px 4px ${secondaryColor}`,
                WebkitTextStroke: `${outline}px`,
                WebkitTextStrokeColor: `${outlineColor}`,
                fontWeight: bold ? "bold" : "normal",
                fontStyle: italic ? "italic" : "normal",
                textDecoration: `${underline ? "underline" : ""} ${
                  strikeOut ? "line-through" : ""
                }`,
                transform: `scale(${scaleX / 100}, ${scaleY / 100}) `,
                borderStyle: borderStyle === "1" ? "solid" : "none",
                textShadow: `1px 1px ${shadow}px #fff`,
                marginLeft: `${marginL}px`,
                marginRight: `${marginR}px`,
                marginTop: `${marginV}px`,
              }}
            >
              Preview
            </span>
          </div>

          <Button
            className="mt-2 w-100"
            onClick={() => {
              handleSave();
            }}
          >
            Save
          </Button>
        </div>
      </OffcanvasBody>
    </Offcanvas>
  );
};

export default CustomLyrics;
