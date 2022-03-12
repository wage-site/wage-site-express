let { useState, useEffect, useRef, Fragment } = React;
mapboxgl.accessToken =
  "pk.eyJ1IjoiZWR5Z3V5IiwiYSI6ImNrbDNoZzB0ZjA0anoydm13ejJ2ZnI1bTUifQ.IAGnqkUNAZULY6QbYCSS7w";

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
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);
  const [mapHeight, setMapHeight] = useState(720);

  const [closeBtnInEff, setCloseBtnInEff] = useState(false);
  const [closeBtnOutEff, setCloseBtnOutEff] = useState(false);

  const [menuOpened, setMenuOpened] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("");

  const sensors = [
    { name: "Grui", coords: [25.048887, 45.286312] },
    { name: "Apa Sarata", coords: [25.020152, 45.233619] },
    { name: "Marcus", coords: [25.013783, 45.246982] },
    { name: "Aro", coords: [25.065912, 45.299029] },
    { name: "Visoi 3", coords: [25.061631, 45.279675] },
    { name: "Visoi 2", coords: [25.056184, 45.278482] },
    { name: "Dinicu", coords: [25.040256, 45.26468] },
    { name: "Schei", coords: [25.052132, 45.280552] },
    { name: "Centru II", coords: [25.048769, 45.274771] },
    { name: "Centru I", coords: [25.04354, 45.272337] },
    { name: "Flamanda", coords: [25.049944, 45.268803] },
    { name: "Aricescu", coords: [25.039517, 45.265359] },
    { name: "Pescareasa", coords: [25.011053, 45.221642] },
  ];

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [25.045456, 45.268469],
      zoom: 12,
    });
    map.current.addControl(new mapboxgl.NavigationControl());
    sensors.forEach((sensor) => {
      new mapboxgl.Marker(
        document.getElementById(sensor.name.toLowerCase().replace(" ", "-")),
        {
          color: "#34eb40",
        }
      )
        .setLngLat(sensor.coords)
        .addTo(map.current);
    });
  });

  useEffect(() => {
    setMapHeight(size.height);
  }, [size]);

  function openTab(sensor) {
    if (sensor === selectedMenu) {
      setMenuOpened(false);
      setSelectedMenu("");
    } else {
      setMenuOpened(true);
      if (!menuOpened) setCloseBtnInEff(true);
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
        <div className="flex flex-row justify-start items-center space-x-2 absolute top-0 left-0 mt-2 ml-2">
          <div className="bg-gray-800 col-span-2 px-2 py-1 rounded-full flex flex-row space-x-2 justify-start items-center w-fit text-white">
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
              } bg-gray-800 px-1.5 py-1 rounded-full flex flex-row space-x-2 justify-start items-center w-fit text-white`}
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
      </div>
      {sensors.map((sensor) => (
        <button
          className="marker"
          key={sensor.name}
          id={sensor.name.toLowerCase().replace(" ", "-")}
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
