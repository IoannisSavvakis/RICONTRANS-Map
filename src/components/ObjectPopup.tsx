import { Popup } from "react-leaflet";
import { Stack, Skeleton, Typography } from '@mui/material'


interface ObjectPopupProps {
    objectName: string | string[];
    offset_y?: number;
    closeButton?: boolean;
}


function getObjectName(name: string | string[]) {
    return (typeof name === 'string' ? name : <i>Object name not available</i>);
}


function ObjectPopup(props: ObjectPopupProps) {
    return (
        <Popup
            closeButton={props.closeButton}
            offset={[0, props.offset_y ? props.offset_y : 0]}
            maxWidth={240}
            minWidth={240}
        >
            <Stack>
                <Skeleton variant='rounded' animation='wave' height={120} />
                <Typography
                    textAlign={typeof props.objectName === 'string' ? 'center' : 'left'}
                    variant={typeof props.objectName === "string" ? 'h2' : 'h3'}
                    sx={{ mt: 1.5, mx: 0 }}
                >
                    {getObjectName(props.objectName)}
                </Typography>
            </Stack>
        </Popup>
    )
}


export default ObjectPopup;