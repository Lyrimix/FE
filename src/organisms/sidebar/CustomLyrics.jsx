import React, { useState, useEffect } from "react";
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
    { label: "Primary Colour", value: primaryColor, setter: setPrimaryColor },
    {
      label: "Secondary Colour",
      value: secondaryColor,
      setter: setSecondaryColor,
    },
    { label: "Outline Colour", value: outlineColor, setter: setOutlineColor },
    { label: "Back Colour", value: backColor, setter: setBackColor },
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

  return (
    <Offcanvas
      isOpen={isOpen}
      toggle={toggle}
      direction="end"
      backdrop={false}
      className="custom-offcanvas"
    >
      <OffcanvasHeader
        toggle={toggle}
        className="d-flex justify-content-between align-items-center px-3 py-3 bg-dark text-light"
      >
        <div className="d-flex gap-2 px-3 py-2 shadow-sm h-100 p-10 rounded-0">
          Custom Lyrics
        </div>
      </OffcanvasHeader>
      <OffcanvasBody className="bg-black">
        <div
          className="container border w-100 p-0"
          style={{ overflowY: "auto" }}
        >
          <ul
            className="nav nav-tabs w-100 p-0 m-0 bg-dark-subtle"
            id="myTab"
            role="tablist"
          >
            {TABS_CUSTOMS.map((tab) => (
              <li
                key={tab.id}
                className="nav-item flex-fill p-0"
                role="presentation"
              >
                <button
                  className={`nav-link w-100 h-100 rounded-0 text-dark ${
                    activeTab === tab.id ? "active" : ""
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                  id={`${tab.id}-tab`}
                  data-bs-toggle="tab"
                  data-bs-target={`#${tab.id}`}
                  type="button"
                  role="tab"
                  aria-controls={tab.id}
                  aria-selected={activeTab === tab.id}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
          <div className="tab-content p-3" id="myTabContent">
            <div
              className={`tab-pane fade ${
                activeTab === "font" ? "show active" : ""
              }`}
              id="font"
              role="tabpanel"
              aria-labelledby="font-tab"
            >
              <div className="d-flex align-items-center gap-1 mb-2">
                <select
                  className="form-select form-select-sm w-auto h-100 text-center rounded-0"
                  onChange={(e) => setFont(e.target.value)}
                  value={font}
                >
                  {ASS_FONTS.map((font) => (
                    <option key={font} value={font}>
                      {font}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  className="form-control form-control-sm w-25 h-100 text-center rounded-0"
                  value={fontSize}
                  onChange={(e) => setFontSize(e.target.value)}
                />
              </div>

              <div className="d-flex align-items-center gap-2 mb-2">
                {BUTTONS.map((btn) => (
                  <button
                    key={btn.state}
                    className={`btn btn-sm ${
                      eval(btn.state) ? "btn-secondary" : "btn-light"
                    } rounded-0 ${btn.styleClass}`}
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
            </div>

            <div
              className={`tab-pane fade ${
                activeTab === "color" ? "show active" : ""
              }`}
              id="color"
              role="tabpanel"
              aria-labelledby="color-tab"
            >
              {colors.map((color, index) => (
                <div
                  key={index}
                  className="d-flex justify-content-between align-items-center mb-2"
                >
                  <input
                    type="color"
                    className="form-control form-control-sm rounded-0 p-1"
                    style={{
                      width: "32px",
                      height: "30px",
                      cursor: "pointer",
                      padding: "0",
                    }}
                    value={color.value.rgb}
                    onChange={(e) => color.setter(e.target.value)}
                  />
                  <span className="w-75 text-light">{color.label}</span>
                </div>
              ))}
            </div>

            <div
              className={`tab-pane fade ${
                activeTab === "align" ? "show active" : ""
              }`}
              id="align"
              role="tabpanel"
              aria-labelledby="align-tab"
            >
              <div className="mb-3">
                <div
                  className="tab-pane fade show active"
                  id="align"
                  role="tabpanel"
                  aria-labelledby="align-tab"
                >
                  <div
                    className="mb-3 d-grid gap-3"
                    style={{ gridTemplateColumns: "repeat(2, 1fr)" }}
                  >
                    {INPUT_FIELDS.map((input, index) => (
                      <div
                        key={input.label}
                        className={`d-flex ${
                          index < 2 ? "flex-column" : "align-items-center gap-2"
                        }`}
                      >
                        <p className="text-light mb-1">{input.label}</p>
                        <input
                          type="number"
                          className="form-control w-75 rounded-0 input-field"
                          value={input.value}
                          onChange={(e) => input.onChange(e.target.value)}
                          placeholder={input.placeholder}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="container">
                    <div className="row">
                      <div className="col-6 d-flex flex-column justify-content-center align-items-center">
                        <div className="mb-2 fw-bold text-light">Alignment</div>
                        <div className="align-box">
                          {POSITIONS.map((pos, index) => (
                            <div
                              key={pos}
                              className={`align-item ${
                                selected === index ? "active" : ""
                              }`}
                              onClick={() => handleSelectAlign(pos)}
                            >
                              {pos}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="col-6 d-flex flex-column justify-content-center">
                        <div className="mb-2 mt-1 fw-bold text-light">
                          Margin
                        </div>
                        <div className="d-flex flex-column gap-2">
                          {MARGINS.map((margin) => (
                            <input
                              key={margin.id}
                              type="number"
                              className="form-control input-margin w-50 rounded-0"
                              value={margin.value}
                              placeholder={margin.placeholder}
                              onChange={(e) =>
                                handleMarginChange(margin.id, e.target.value)
                              }
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
            className="preview-text"
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
          color="light"
          className="mt-5 w-100"
          onClick={() => {
            handleSave();
          }}
        >
          Save
        </Button>
      </OffcanvasBody>
    </Offcanvas>
  );
};

export default CustomLyrics;
