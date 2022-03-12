let { useState, useEffect, useRef, Fragment } = React;

mapboxgl.accessToken =
  "pk.eyJ1IjoiZWR5Z3V5IiwiYSI6ImNrbDNoZzB0ZjA0anoydm13ejJ2ZnI1bTUifQ.IAGnqkUNAZULY6QbYCSS7w";

var userid = "7137",
  userkey = "a8e0ed5e1cf288124d1b84cd0c994958";

function getUnit(sensor) {
  switch (sensor) {
    case "temperature":
      return "°C";
    case "cpm":
      return "CPM";
    case "voltage1":
      return "Volts";
    case "duty":
      return "‰";
    case "pressure":
      return "Pa";
    case "humidity":
      return "% RH";
    case "gas1":
      return "ppm";
    case "gas2":
      return "ppm";
    case "gas3":
      return "ppm";
    case "gas4":
      return "ppm";
    case "dust":
      return "mg/m³";
    case "co2":
      return "ppm";
    case "ch2o":
      return "ppm";
    case "pm25":
      return "µg/m³";
    case "pm10":
      return "µg/m³";
    case "noise":
      return "dBA";
    case "voc":
      return "voc";
  }
}

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}

function Harta() {
  const size = useWindowSize();

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapHeight, setMapHeight] = useState(720);

  const [closeBtnInEff, setCloseBtnInEff] = useState(false);
  const [closeBtnOutEff, setCloseBtnOutEff] = useState(false);
  const [menuInEff, setMenuInEff] = useState(false);

  const [menuOpened, setMenuOpened] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("");

  const [sensors, setSensors] = useState([]);

  const [menuData, setMenuData] = useState({});

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [25.045456, 45.268469],
      zoom: 12,
    });
    map.current.addControl(new mapboxgl.NavigationControl());
    axios({
      method: "GET",
      url: `https://data.uradmonitor.com/api/v1/devices/userid/${userid}`,
      responseType: "json",
    }).then((data) => {
      if (Object.keys(data)[0] == "error") {
        console.error("Error occured!");
      } else {
        let sensorArray = data.data;
        let finArray = [];
        sensorArray.forEach((sensor) => {
          finArray.push({
            id: sensor.id,
            name:
              sensor.note == "Apa"
                ? "Apa Sarata"
                : sensor.note == "Nanu"
                ? "Nanu Muscel"
                : sensor.note == "Iorgulescu"
                ? "Oprea Iorgulescu"
                : sensor.note == "Aricescu"
                ? "C.D. Aricescu"
                : sensor.note == "Spiru"
                ? "Spiru Haret"
                : sensor.note == "Aman"
                ? "Theodor Aman"
                : sensor.note,
            coords: [sensor.longitude, sensor.latitude],
            active: Boolean(sensor.status),
          });
        });
        setSensors(finArray);
      }
    });
  });

  useEffect(() => {
    sensors.forEach((sensor) => {
      new mapboxgl.Marker(document.getElementById(sensor.id), {
        color: "#34eb40",
      })
        .setLngLat(sensor.coords)
        .addTo(map.current);
    });
  }, [sensors]);

  useEffect(() => {
    setMapHeight(size.height);
  }, [size]);

  useEffect(() => {
    if (selectedMenu == "wagepedia") return;
    else if (selectedMenu == "") {
      setMenuData({});
    } else {
      setLoading(true);
      let sensorId;
      sensors.map((sensor) => {
        if (sensor.name == selectedMenu) sensorId = sensor.id;
      });
      axios({
        method: "GET",
        url: `https://data.uradmonitor.com/api/v1/devices/${sensorId}/all`,
        headers: {
          "Content-Type": "text/plain",
          "X-User-id": userid,
          "X-User-hash": userkey,
        },
        responseType: "json",
      }).then((data) => {
        let {
          gas1,
          humidity,
          temperature,
          latitude,
          longitude,
          pressure,
          time,
          voltage1,
          pm1,
          pm10,
          pm25,
        } = data.data[data.data.length - 1];
        setMenuData({
          name: selectedMenu,
          gas1: gas1 ? gas1 : null,
          humidity: humidity ? humidity : null,
          temperature: temperature
            ? parseInt(temperature.toString().substring(0, 4))
            : null,
          latitude: latitude ? latitude : null,
          longitude: longitude ? longitude : null,
          pressure: pressure ? pressure : null,
          time: time ? time : null,
          voltage1: voltage1 ? voltage1 : null,
          pm1: pm1 ? pm1 : null,
          pm10: pm10 ? pm10 : null,
          pm25: pm25 ? pm25 : null,
        });
        setLoading(false);
      });
    }
  }, [selectedMenu]);

  useEffect(() => {
    if (menuData !== {}) console.log(menuData);
  }, [menuData]);

  function openTab(sensor) {
    if (sensor === selectedMenu) {
      setMenuOpened(false);
      setSelectedMenu("");
    } else {
      setMenuOpened(true);
      if (!menuOpened) {
        setCloseBtnInEff(true);
        setMenuInEff(true);
      }
      setSelectedMenu(sensor);
    }
  }

  function closeBtnFin() {
    setCloseBtnOutEff(false);
    setMenuOpened(false);
    setSelectedMenu("");
  }

  function closeTab() {
    setCloseBtnOutEff(true);
  }

  return (
    <div className="relative w-full">
      <div
        ref={mapContainer}
        style={{
          height: mapHeight,
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
        }}
      />
      <div className="relative z-10 top-0 left-0 ">
        <div className="absolute top-0 left-0 mt-2 ml-2 space-y-2 flex flex-col justify-start items-start">
          <div className="flex flex-row justify-start items-center space-x-2">
            <div className="bg-gray-50 col-span-2 px-1.5 py-1 rounded-full flex flex-row space-x-2 justify-start items-center w-fit text-gray-900">
              <a href="/">
                <i className="fa-solid fa-circle-chevron-left fa-lg"></i>
              </a>
              <button
                className="outline-none"
                onClick={() => openTab("wagepedia")}
              >
                <i className="fa-solid fa-circle-info fa-lg"></i>
              </button>
            </div>
            {menuOpened ? (
              <div
                className={`${closeBtnInEff && "animate-fadeIn"} ${
                  closeBtnOutEff && "animate-fadeOut"
                } bg-gray-50 px-1.5 py-1 rounded-full flex flex-row space-x-2 justify-start items-center w-fit text-gray-900`}
                onAnimationEnd={() => {
                  if (closeBtnInEff) setCloseBtnInEff(false);
                  else if (closeBtnOutEff) closeBtnFin();
                }}
              >
                <button className={`outline-none`} onClick={() => closeTab()}>
                  <i className="fa-solid fa-circle-xmark fa-lg"></i>
                </button>
              </div>
            ) : null}
          </div>
          {menuOpened && (
            <div
              className={`${menuInEff ? "animate-slideIn" : ""}${
                closeBtnOutEff ? "animate-fadeOut" : ""
              } w-96 h-max bg-slate-50 rounded-lg relative p-4`}
              onAnimationEnd={() => {
                if (menuInEff) setMenuInEff(false);
              }}
            >
              {loading ? (
                <div>Loading...</div>
              ) : (
                <div className="flex flex-col items-start justify-start">
                  <div className="grid grid-cols-2 grid-rows-1 w-full">
                    <div className="flex flex-row justify-start text-xl">
                      {menuData.name}
                    </div>
                    <div className="flex flex-row justify-end">
                      {menuData.temperature}
                      {getUnit("temperature")}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {sensors.map((sensor) => (
        <button
          className={`marker ${sensor.active ? "" : "grayscale"}`}
          key={sensor.name}
          id={sensor.id}
          disabled={sensor.active ? false : true}
          onClick={() => openTab(sensor.name)}
        ></button>
      ))}
    </div>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <Harta />
  </React.StrictMode>,
  document.getElementById("root")
);
