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
      let sensorCoords;
      sensors.map((sensor) => {
        if (sensor.name == selectedMenu) {
          sensorId = sensor.id;
          sensorCoords = sensor.coords;
        }
      });
      map.current.easeTo({
        center: sensorCoords,
        zoom: 16,
        duration: 1000,
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
          timelocal,
          pm1,
          pm10,
          pm25,
        } = data.data[data.data.length - 1];
        console.log(data.data[data.data.length - 1]);
        let date = new Date(time * 1000);
        var hours = date.getHours();
        var minutes = "0" + date.getMinutes();
        var seconds = "0" + date.getSeconds();
        var formattedTime = hours + ":" + minutes.substr(-2);
        setMenuData({
          name: selectedMenu,
          gas1: gas1,
          humidity: humidity ? humidity : null,
          temperature: temperature
            ? parseInt(temperature.toString().substring(0, 4))
            : null,
          latitude: latitude ? latitude : null,
          longitude: longitude ? longitude : null,
          pressure: pressure ? pressure : null,
          time: time ? time : null,
          timelocal: timelocal ? timelocal : null,
          pm1: pm1 ? pm1 : null,
          pm10: pm10 ? pm10 : null,
          pm25: pm25 ? pm25 : null,
          date: formattedTime,
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
      closeBtnFin();
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
    map.current.easeTo({
      center: [25.045456, 45.268469],
      zoom: 12,
      duration: 1000,
    });
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
                  {loading ? (
                    <i class="fa-solid fa-arrow-rotate-right animate-spin mx-0.5"></i>
                  ) : (
                    <i className="fa-solid fa-circle-xmark fa-lg"></i>
                  )}
                </button>
              </div>
            ) : null}
          </div>
          {menuOpened && !loading && (
            <div
              className={`${menuInEff ? "animate-slideIn" : ""}${
                closeBtnOutEff ? "animate-fadeOut" : ""
              } w-96 h-max bg-slate-50 rounded-lg relative p-4 shadow-md`}
              onAnimationEnd={() => {
                if (menuInEff) setMenuInEff(false);
              }}
            >
              <div
                className={`flex flex-col items-start justify-start space-y-2`}
              >
                <div className="grid grid-cols-2 grid-rows-1 w-full">
                  <div className="flex flex-row justify-start text-xl">
                    {menuData.name}
                  </div>
                  <div className="flex flex-row justify-end items-center">
                    {menuData.temperature}
                    {getUnit("temperature")}
                  </div>
                </div>
                <div className="flex flex-row justify-center items-center w-full space-x-2">
                  <span className="mb-[2px]">Particule</span>
                  <div className="w-full h-px bg-black opacity-25 rounded-full" />
                </div>
                {menuData.gas1 != null && (
                  <div className="grid grid-cols-2 grid-rows-1 w-full">
                    <div className="flex flex-row justify-start text-xl">
                      NO2
                    </div>
                    <div className="flex flex-row justify-end items-center">
                      {menuData.gas1} {getUnit("gas1")}
                    </div>
                  </div>
                )}
                {menuData.pm1 != null && (
                  <div className="grid grid-cols-2 grid-rows-1 w-full">
                    <div className="flex flex-row justify-start text-xl">
                      PM1.0
                    </div>
                    <div className="flex flex-row justify-end items-center">
                      {menuData.pm1} {getUnit("pm10")}
                    </div>
                  </div>
                )}
                {menuData.pm25 != null && (
                  <div className="grid grid-cols-2 grid-rows-1 w-full">
                    <div className="flex flex-row justify-start text-xl">
                      PM2.5
                    </div>
                    <div className="flex flex-row justify-end items-center">
                      {menuData.pm25} {getUnit("pm25")}
                    </div>
                  </div>
                )}
                {menuData.pm10 != null && (
                  <div className="grid grid-cols-2 grid-rows-1 w-full">
                    <div className="flex flex-row justify-start text-xl">
                      PM10
                    </div>
                    <div className="flex flex-row justify-end items-center">
                      {menuData.pm10} {getUnit("pm10")}
                    </div>
                  </div>
                )}
                <div className="flex flex-row justify-center items-center w-full space-x-2">
                  <span className="mb-[2px]">Altele</span>
                  <div className="w-full h-px bg-black opacity-25 rounded-full" />
                </div>
                {menuData.pressure != null && (
                  <div className="grid grid-cols-2 grid-rows-1 w-full">
                    <div className="flex flex-row justify-start text-xl">
                      Presiune
                    </div>
                    <div className="flex flex-row justify-end items-center">
                      {menuData.pressure / 100} {getUnit("pressure")}
                    </div>
                  </div>
                )}
                {menuData.humidity != null && (
                  <div className="grid grid-cols-2 grid-rows-1 w-full">
                    <div className="flex flex-row justify-start text-xl">
                      Umiditate
                    </div>
                    <div className="flex flex-row justify-end items-center">
                      {menuData.humidity} {getUnit("humidity")}
                    </div>
                  </div>
                )}
                <div className="flex flex-row justify-start items-center w-full space-x-2 pt-1">
                  <span className="mb-[2px] text-xs opacity-50">
                    Ultima actualizare la {menuData.date}
                  </span>
                </div>
              </div>
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
