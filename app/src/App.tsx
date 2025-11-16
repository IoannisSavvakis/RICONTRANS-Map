import './index.css'
import 'leaflet/dist/leaflet.css'
import {
    MapContainer,
    TileLayer,
    Marker,
    useMapEvents
} from 'react-leaflet'
import { useState } from 'react'

import objects from './Objects.json'

import { Icon, LeafletMouseEvent } from 'leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import {
    Stack,
    Skeleton,
    Typography,
    Box,
    AppBar,
    Toolbar,
    Paper,
    IconButton,
    TextField
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import ObjectPopup from './components/ObjectPopup'


const globalStyles = `
  body, html, #root {
    margin: 0;
    padding: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden; /* Αποτρέπει το scrolling */
  }
  .leaflet-container {
    height: 100%;
    width: 100%;
  }
`;


const initialMapCenter: [number, number] = [41.697871, 23.859703];	//	[lat, long]


interface Coordinates {
    lat: number;
    long: number;
}
interface MuseumObject {
    srcFile: string;
    key: string;
    Name: string | string[];
    Description: string | string[];
    Materials: string | string[];
    Colors: string | string[];
    "Current Location Name": string | string[];
    "Current Location Coordinates": Coordinates | Coordinates[];
}


const MapClickHandler = ({ onMapClick }: { onMapClick: () => void }) => {
    useMapEvents({
        click() {
            onMapClick();
        },
    });
    return null;
};


function App() {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [selectedPlace, setSelectedPlace] = useState<MuseumObject | null>(null);
    const [sideBarTitle, setSideBarTitle] = useState<string | string[] | null>('');

    const appBarHeight = 70;

    const handleMouseOver = (event: LeafletMouseEvent, obj: MuseumObject) => {
        if (selectedPlace === obj) {
            event.target.closePopup()
        }
        else {
            event.target.openPopup()
        }

        return null
    }

    const handleMarkerClick = (obj: MuseumObject) => {
        if (selectedPlace === obj) {
            setSidebarOpen(false)
            setSelectedPlace(null)
            setSideBarTitle(null)
        }
        else {
            setSidebarOpen(true);
            setSelectedPlace(obj);
            setSideBarTitle(obj.Name)
        }
    };

    const handleMapClick = () => {
        setSidebarOpen(false);
        setSelectedPlace(null);
    };

    const markerIcon = new Icon({
        //iconUrl: 'https://cdn-icons-png.flaticon.com/128/3944/3944427.png',
        //iconUrl: 'https://cdn-icons-png.flaticon.com/128/6063/6063856.png',
        //iconUrl: 'https://cdn-icons-png.flaticon.com/128/7987/7987463.png',
        //iconUrl: 'https://cdn-icons-png.flaticon.com/128/17990/17990934.png',
        //iconUrl: 'https://cdn-icons-png.flaticon.com/128/18484/18484798.png',
        //iconUrl: 'https://cdn-icons-png.flaticon.com/128/18560/18560647.png',
        //iconUrl: 'https://cdn-icons-png.flaticon.com/128/927/927693.png',
        iconUrl: 'https://cdn-icons-png.flaticon.com/128/3425/3425079.png',
        //iconUrl: 'https://cdn-icons-png.flaticon.com/128/16682/16682493.png',
        iconSize: [40, 40]
    })

    return (
        <>
            <link
                rel="stylesheet"
                href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
                integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
                crossOrigin=""
            />
            <style>{globalStyles}</style>

            <Box sx={{ height: '100vh', width: '100vw', position: 'relative' }}>

                <AppBar
                    position="absolute"
                    sx={{
                        height: `${appBarHeight}px`,
                        backgroundColor: 'rgba(230, 230, 230, 0.8)',
                        backdropFilter: 'blur(5px)',
                        zIndex: 1001,
                        boxShadow: 'none',
                        borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
                    }}
                >
                    <Toolbar sx={{ alignItems: 'center' }}>
                        <IconButton
                            component="a"
                            href={"https://ricontrans-project.eu/"}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Open RICONTRANS page"
                            sx={{
                                borderRadius: 2
                            }}
                        >
                            <img
                                src={"https://ricontrans-project.eu/wp-content/uploads/ricontrans_red.png"}
                                alt="RICONTRANS Logo"
                                style={{ height: `${appBarHeight - 22}px` }}
                            />
                        </IconButton>
                        <Box sx={{ flexGrow: 1 }} />
                        <TextField
                            variant="outlined"
                            size="small"
                            placeholder="Search anything..."
                            InputProps={{
                                startAdornment: (
                                    <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
                                ),
                            }}
                            sx={{
                                width: '550px',
                                '& .MuiOutlinedInput-root': {
                                    backgroundColor: 'white',
                                    borderRadius: 2,
                                }
                            }}
                        />
                        <Box sx={{ flexGrow: 1 }} />
                        <IconButton
                            component="a"
                            href={"https://www.csd.uoc.gr/CSD/index.jsp?lang=en"}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Open CSD UoC page"
                        >
                            <img
                                src={"https://www.csd.uoc.gr/images/UoC_logo.png"}
                                alt="UoC Logo"
                                style={{ height: `${appBarHeight - 15}px` }}
                            />
                        </IconButton>
                    </Toolbar>
                </AppBar>

                <MapContainer
                    center={initialMapCenter}
                    zoomControl={false}
                    zoom={5}
                    minZoom={2}
                    scrollWheelZoom={true}
                    maxBounds={[[-90, -180], [90, 180]]}
                    style={{ height: '100%', width: '100%', zIndex: 1 }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url='https://tile.jawg.io/jawg-terrain/{z}/{x}/{y}{r}.png?access-token=mZSPyiVAxH36xNG8upfBG7uAYIcnDD7RSyr9s7aDCdJAcS1StnwDnA7AEDy2gf6V'
                    />

                    <MapClickHandler onMapClick={handleMapClick} />

                    <MarkerClusterGroup>
                        {
                            objects.map((obj: MuseumObject) => (
                                (Array.isArray(obj['Current Location Coordinates']) ? null : obj['Current Location Coordinates'].lat) &&
                                (Array.isArray(obj['Current Location Coordinates']) ? null : obj['Current Location Coordinates'].long) &&

                                <Marker
                                    key={obj.key}
                                    position={[
                                        (Array.isArray(obj['Current Location Coordinates']) ? 0 : obj['Current Location Coordinates'].lat),
                                        (Array.isArray(obj['Current Location Coordinates']) ? 0 : obj['Current Location Coordinates'].long)
                                    ]}
                                    icon={markerIcon}
                                    eventHandlers={{
                                        mouseover: (event) => handleMouseOver(event, obj),
                                        mouseout: (event) => {
                                            if (selectedPlace?.srcFile != obj.srcFile) setTimeout(() => event.target.closePopup(), 80)
                                        },
                                        click: (event) => handleMarkerClick(obj),
                                    }}
                                >
                                    <ObjectPopup
                                        objectName={obj.Name}
                                        offset_y={-10}
                                    />
                                </Marker>
                            ))
                        }
                    </MarkerClusterGroup>
                </MapContainer>

                <Paper
                    elevation={4}
                    sx={{
                        position: 'absolute',
                        top: `${appBarHeight + 10}px`,
                        bottom: '10px',
                        left: '10px',
                        width: '400px',
                        maxWidth: '90vw',
                        zIndex: 1002,

                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '12px',
                        border: '1px solid rgba(0, 0, 0, 0.12)',

                        transform: isSidebarOpen ? 'translateX(0)' : 'translateX(calc(-100% - 20px))',
                        transition: 'transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',

                        padding: '10px',
                        overflowY: 'auto',
                        '&::-webkit-scrollbar': {
                            width: 0,
                            height: 0,
                        },
                    }}
                >
                    {selectedPlace && (
                        <Stack>
                            <Skeleton variant='rounded' animation='wave' height={250} />
                            <br />
                            <Typography
                                textAlign='center'
                                variant='h1'
                                sx={{ mt: 1.5, mx: 4 }}
                            >
                                {sideBarTitle}
                            </Typography>
                            <br />
                            {
                                Array.isArray(selectedPlace.Description) ?
                                    <Typography
                                        textAlign='center'
                                        variant='h3'
                                        sx={{ mt: 1.5, mx: 4 }}
                                    >
                                        <i>no available description</i>
                                    </Typography>
                                    :
                                    <Typography
                                        textAlign='justify'
                                        variant='h2'
                                        sx={{ mt: 1.5, mx: 4 }}
                                    >
                                        {selectedPlace.Description}
                                    </Typography>
                            }

                            <br /><br /><hr /><br />

                            <Stack direction={"row"}>
                                <Typography
                                    textAlign='left'
                                    variant='h3'
                                    sx={{ mt: 1.5, mx: 4 }}
                                >
                                    Colors:
                                </Typography>
                                {
                                    Array.isArray(selectedPlace.Colors) ?
                                        selectedPlace.Colors.length === 0 ?
                                            <Typography
                                                variant='h3'
                                                sx={{ mt: 1.5, mx: 4 }}
                                            >
                                                <i>no available colors</i>
                                            </Typography>
                                            :
                                            <Typography
                                                variant='h3'
                                                sx={{ mt: 1.5, mx: 4 }}
                                            >
                                                {selectedPlace.Colors.map((color: string) => (
                                                    <>
                                                        {color}
                                                        <br />
                                                    </>
                                                ))}
                                            </Typography>
                                        :
                                        <Typography
                                            variant='h3'
                                            sx={{ mt: 1.5, mx: 4 }}
                                        >
                                            {selectedPlace.Colors}
                                        </Typography>

                                }
                            </Stack>

                            <br /><br /><hr /><br />

                            <Stack direction={"row"}>
                                <Typography
                                    textAlign='left'
                                    variant='h3'
                                    sx={{ mt: 1.5, mx: 4 }}
                                >
                                    Materials:
                                </Typography>
                                {
                                    Array.isArray(selectedPlace.Materials) ?
                                        selectedPlace.Materials.length === 0 ?
                                            <Typography
                                                variant='h3'
                                                sx={{ mt: 1.5, mx: 4 }}
                                            >
                                                <i>no available materials</i>
                                            </Typography>
                                            :
                                            <Typography
                                                variant='h3'
                                                sx={{ mt: 1.5, mx: 4 }}
                                            >
                                                {selectedPlace.Materials.map((mat: string) => (
                                                    <>
                                                        {mat}
                                                        <br />
                                                    </>
                                                ))}
                                            </Typography>
                                        :
                                        <Typography
                                            variant='h3'
                                            sx={{ mt: 1.5, mx: 4 }}
                                        >
                                            {selectedPlace.Materials}
                                        </Typography>
                                }
                            </Stack>
                        </Stack>
                    )}
                </Paper>
            </Box>
        </>
    );
}

export default App;

