/// <reference types="vite/client" />

declare module '@iconscout/react-unicons' {
  import * as React from 'react';

  export interface IconProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
    color?: string;
    className?: string;
    style?: React.CSSProperties;
    onClick?: React.MouseEventHandler<SVGElement>;
  }

  export type Icon = React.FC<IconProps>;

  export const UilTemperature: Icon;
  export const UilTemperatureHalf: Icon;
  export const UilTemperatureQuarter: Icon;
  export const UilTemperatureThreeQuarter: Icon;
  export const UilThermometer: Icon;
  export const UilWind: Icon;
  export const UilProcessor: Icon;
  export const UilBoltAlt: Icon;
  export const UilBolt: Icon;
  export const UilSlidersV: Icon;
  export const UilSlidersVAlt: Icon;
  export const UilBell: Icon;
  export const UilBellSlash: Icon;
  export const UilVolume: Icon;
  export const UilVolumeMute: Icon;
  export const UilVolumeUp: Icon;
  export const UilVolumeOff: Icon;
  export const UilShield: Icon;
  export const UilShieldCheck: Icon;
  export const UilShieldExclamation: Icon;
  export const UilSun: Icon;
  export const UilMoon: Icon;
  export const UilChartLine: Icon;
  export const UilFileAlt: Icon;
  export const UilPlay: Icon;
  export const UilPause: Icon;
  export const UilSync: Icon;
  export const UilCheckCircle: Icon;
  export const UilExclamationTriangle: Icon;
  export const UilFire: Icon;
  export const UilHeartRate: Icon;
  export const UilDesktop: Icon;
  export const UilHdd: Icon;
  export const UilArrowUp: Icon;
  export const UilArrowDown: Icon;
  export const UilDownloadAlt: Icon;
  export const UilTrashAlt: Icon;
  export const UilFilter: Icon;
  export const UilInfoCircle: Icon;
  export const UilSetting: Icon;
  export const UilClock: Icon;
  export const UilCheck: Icon;
  export const UilServer: Icon;
  export const UilLayers: Icon;
  export const UilAirplay: Icon;
  export const UilRobot: Icon;
  export const UilTimes: Icon;
  export const UilLocationArrow: Icon;
  export const UilPagelines: Icon;
  export const UilWindowGrid: Icon;

  const icons: { [key: string]: Icon };
  export default icons;
}
