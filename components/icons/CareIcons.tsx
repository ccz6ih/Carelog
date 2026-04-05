/**
 * CareLog Icon Set — Hand-drawn comfort/caregiving line art
 * All icons are 24x24 by default, stroke-based, color-customizable
 */
import React from 'react';
import Svg, { Path, Circle, Line, G } from 'react-native-svg';
import Colors from '@/constants/Colors';

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

const defaults = { size: 28, color: Colors.primary, strokeWidth: 2.5 };

// Icon 1: Hands comfort/massage — used for Dashboard
export function IconComfort({ size = defaults.size, color = defaults.color, strokeWidth = defaults.strokeWidth }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 119.683 101.794" fill="none">
      <G>
        <Path d="M90.788,1.5c-4.489,1.627-6.85,6.545-10.782,9.254-9.811,5.525-22.378,3.885-32.469,8.652-5.211,4.422-8.299,10.98-12.543,16.303-2.576,3.289-5.292,8.577-1.814,12.113,4.814,3.852,11.779-1.048,15.062-5.057,2.265-2.802,4.249-6.541,7.822-7.007,8.591,1.128,17.581,6.01,26.192,2.392" stroke={color} strokeLinecap="round" strokeMiterlimit={10} strokeWidth={strokeWidth} />
        <Path d="M118.183,24.89c-15.461,9.931-11.156,27.764-23.696,38.839" stroke={color} strokeLinecap="round" strokeMiterlimit={10} strokeWidth={strokeWidth} />
        <Path d="M1.5,42.301c1.201,4.485,5.263,7.523,7.847,11.381,5.985,11.637,6.851,23.978,19.27,31.799" stroke={color} strokeLinecap="round" strokeMiterlimit={10} strokeWidth={strokeWidth} />
        <Path d="M18.352,12.693c6.243,6.04,14.133,10.361,22.584,12.369" stroke={color} strokeLinecap="round" strokeMiterlimit={10} strokeWidth={strokeWidth} />
        <Path d="M31.807,69.564c7.392.44,42.126,38.874,41.148,20.865-5.026-8.661-13.246-16.092-21.987-20.817" stroke={color} strokeLinecap="round" strokeMiterlimit={10} strokeWidth={strokeWidth} />
        <Path d="M74.062,91.306c1.569.99,3.693,1.018,5.289.072,9.793-6.706-15.37-26.118-20.946-30.386" stroke={color} strokeLinecap="round" strokeMiterlimit={10} strokeWidth={strokeWidth} />
        <Path d="M82.372,85.293c17.42-5.595-10.317-28.69-17.763-33.161" stroke={color} strokeLinecap="round" strokeMiterlimit={10} strokeWidth={strokeWidth} />
        <Path d="M87.811,73.672c5.962,1.023,6.255-7.054,3.476-10.688-5.937-11.166-16.012-19.821-27.397-25.327" stroke={color} strokeLinecap="round" strokeMiterlimit={10} strokeWidth={strokeWidth} />
        <Path d="M35.559,72.694c-4.978,3.655-11.247,17.904-.634,17.293,4.119-2.743,6.663-7.56,10.104-11.116" stroke={color} strokeLinecap="round" strokeMiterlimit={10} strokeWidth={strokeWidth} />
        <Path d="M38.2,87.309c-1.891,2.682-2.831,7.936,1.224,8.946,5.539-.709,9.652-6.364,13.49-10.092" stroke={color} strokeLinecap="round" strokeMiterlimit={10} strokeWidth={strokeWidth} />
        <Path d="M45.997,93.687c-1.763,2.911-.407,6.712,3.321,6.605,4.846-.45,8.4-4.65,11.729-7.837" stroke={color} strokeLinecap="round" strokeMiterlimit={10} strokeWidth={strokeWidth} />
        <Path d="M57.567,96.439c-.662,1.448,3.587,3.015,5.052,2.923,1.744-.109,3.959-1.982,5.085-3.108" stroke={color} strokeLinecap="round" strokeMiterlimit={10} strokeWidth={strokeWidth} />
      </G>
    </Svg>
  );
}

// Icon 6: Two figures with leaf — used for Visits (caregiver + recipient)
export function IconVisit({ size = defaults.size, color = defaults.color, strokeWidth = defaults.strokeWidth }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 106.5 107.82" fill="none">
      <G>
        <Path d="M26.428,17.567c.366-21.424,32.234-21.421,32.597,0-.366,21.424-32.234,21.42-32.597,0Z" stroke={color} strokeLinecap="round" strokeMiterlimit={10} strokeWidth={strokeWidth} />
        <Path d="M72.7,40.354c.343-20.1,30.242-20.097,30.582,0-.343,20.1-30.242,20.096-30.582,0Z" stroke={color} strokeLinecap="round" strokeMiterlimit={10} strokeWidth={strokeWidth} />
        <Path d="M27.977,24.719c-1.73,4.309-5.311,6.482-8.985,8.666-4.214,2.505-7.591,6.224-9.596,10.698C1.887,60.85,2.107,88.551,1.5,104.798" stroke={color} strokeLinecap="round" strokeMiterlimit={10} strokeWidth={strokeWidth} />
        <Path d="M6.372,52.802c.411,7.975,2.558,29.996,13.956,30.525,9.742.588,21.667,1.628,29.259-2.803,3.869-3.948,5.011-7.805,11.063-4.55,3.502-1.227,6.996-5.429,6.475-9.093-.524-3.198-4.028-5.233-7.267-5.145-6.688.232-11.158,6.534-17.248,8.48-4.88,1.113-13.012,1.309-17.649-.355-1.178-7.004-2.169-13.293-3.662-19.784" stroke={color} strokeLinecap="round" strokeMiterlimit={10} strokeWidth={strokeWidth} />
        <Path d="M45.584,55.222c-1.151,4.758-2.101,9.564-2.848,14.402" stroke={color} strokeLinecap="round" strokeMiterlimit={10} strokeWidth={strokeWidth} />
        <Path d="M41.167,83.327c-.682,6.833-.93,13.709-.741,20.573" stroke={color} strokeLinecap="round" strokeMiterlimit={10} strokeWidth={strokeWidth} />
        <Path d="M42.737,33.634c7.863,6.47,11.116,17.864,13.719,27.342" stroke={color} strokeLinecap="round" strokeMiterlimit={10} strokeWidth={strokeWidth} />
        <Path d="M81.676,54.22c-5.411,2.947-11.594,4.325-16.094,8.659" stroke={color} strokeLinecap="round" strokeMiterlimit={10} strokeWidth={strokeWidth} />
        <Path d="M58.682,76.882c-.091,6.949-4.91,24.831-1.442,29.438" stroke={color} strokeLinecap="round" strokeMiterlimit={10} strokeWidth={strokeWidth} />
        <Path d="M72.7,78.312c-1.876,5.821-4.657,11.611-5.278,17.818.325,3.144,2.04,5.873,3.07,8.761" stroke={color} strokeLinecap="round" strokeMiterlimit={10} strokeWidth={strokeWidth} />
        <Path d="M91.266,55.428c16.39,8.374,13.367,31.353,13.718,48.462" stroke={color} strokeLinecap="round" strokeMiterlimit={10} strokeWidth={strokeWidth} />
      </G>
    </Svg>
  );
}

// Icon 11: Heart with embracing hands — used for Family/Appreciation
export function IconHeart({ size = defaults.size, color = defaults.color, strokeWidth = defaults.strokeWidth }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 117.143 98.116" fill="none">
      <G>
        <Path d="M59.196,51.941C5.405,17.191,37.652-15.433,58.367,12.411c13.501-22.564,37.208-6.503,27.005,15.342-6.043,10.566-14.279,19.403-26.177,24.188Z" stroke={color} strokeLinecap="round" strokeMiterlimit={10} strokeWidth={strokeWidth} />
        <Path d="M2.106,58.948c11.567,3.57,23.633-6.241,35.585-4.319,7.8,1.254,14.007,7.275,21.561,9.59,7.294,2.235,16.132,1.207,21.551,6.576,2.853,2.3,1.909,6.522-1.343,8.008-11.481,2.672-24.002-.499-35.46-2.551" stroke={color} strokeLinecap="round" strokeMiterlimit={10} strokeWidth={strokeWidth} />
        <Path d="M1.5,87.988c24.53-5.429,49.358,14.641,73.748,6.777,7.941-2.609,14.572-8.071,20.997-13.417,6.7-5.574,13.513-11.276,18.168-18.643,2.187-2.65,1.519-7.017-2.498-6.55-6.162,1.684-10.527,7.167-15.779,10.587-4.122,2.94-8.865,5.375-13.927,5.438" stroke={color} strokeLinecap="round" strokeMiterlimit={10} strokeWidth={strokeWidth} />
        <Path d="M113.165,56.191c2.728-2.264,2.446-6.526-1.442-7.127-13.462,1.155-21.77,16.278-34.773,18.774" stroke={color} strokeLinecap="round" strokeMiterlimit={10} strokeWidth={strokeWidth} />
        <Path d="M105.671,49.881c-9.937-11.774-29.092,15.379-41.592,15.213" stroke={color} strokeLinecap="round" strokeMiterlimit={10} strokeWidth={strokeWidth} />
      </G>
    </Svg>
  );
}

// Icon 10: Two people embracing — used for Care Recipients
export function IconCaregiver({ size = defaults.size, color = defaults.color, strokeWidth = defaults.strokeWidth }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100.728 107.77" fill="none">
      <G>
        <Path d="M47.741,11.997c2.536-6.16,8.597-10.497,15.672-10.497,9.356,0,16.94,7.585,16.94,16.94s-7.585,16.94-16.94,16.94c-4.99,0-9.476-2.158-12.577-5.591" stroke={color} strokeLinecap="round" strokeMiterlimit={10} strokeWidth={strokeWidth} />
        <Path d="M18.979,34.47c-5.07,1.98-9.838,5.105-12.896,9.608s-4.179,10.508-2.07,15.525c.438,1.041,1.025,2.052,1.917,2.655-3.332,14.171-4.799,28.779-4.352,43.33" stroke={color} strokeLinecap="round" strokeMiterlimit={10} strokeWidth={strokeWidth} />
        <Path d="M76.454,31.992c6.282,1.164,11.459,5.912,14.542,11.507s4.349,11.995,5.26,18.318c2.059,14.288,2.517,28.752,2.972,43.18" stroke={color} strokeLinecap="round" strokeMiterlimit={10} strokeWidth={strokeWidth} />
        <Path d="M46.472,78.196c-2.369,9.132-3.039,18.701-1.967,28.074" stroke={color} strokeLinecap="round" strokeMiterlimit={10} strokeWidth={strokeWidth} />
        <Path d="M55.21,76.816c.516,9.551,1.032,19.103,1.549,28.654" stroke={color} strokeLinecap="round" strokeMiterlimit={10} strokeWidth={strokeWidth} />
        <Path d="M32.527,51.446c3.374,2.859,7.224,5.157,11.343,6.769,1.247.488,2.557.92,3.895.851,1.182-.061,2.307-.509,3.386-.994,7.04-3.159,13.245-8.157,17.833-14.361" stroke={color} strokeLinecap="round" strokeMiterlimit={10} strokeWidth={strokeWidth} />
        <Path d="M21.087,66.233c3.748,3.559,8.715,5.483,13.545,7.323,3.275,1.247,6.583,2.503,10.051,3.006,7.084,1.028,14.365-1.209,20.417-5.031s11.013-9.139,15.521-14.7" stroke={color} strokeLinecap="round" strokeMiterlimit={10} strokeWidth={strokeWidth} />
        <Path d="M5.155,62.011c1.451,1.478,3.707,2.11,5.715,1.602s3.691-2.138,4.265-4.127c.154-.533.236-1.095.5-1.583.282-.52.748-.912,1.124-1.37.692-.842,1.078-1.93,1.071-3.02-.004-.626-.13-1.273.07-1.867.183-.542.612-.959.935-1.431,1.445-2.112.543-5.168-1.316-6.927s-4.412-2.538-6.867-3.261" stroke={color} strokeLinecap="round" strokeMiterlimit={10} strokeWidth={strokeWidth} />
        <Circle cx={33.242} cy={23.034} r={18.172} stroke={color} strokeLinecap="round" strokeMiterlimit={10} strokeWidth={strokeWidth} />
      </G>
    </Svg>
  );
}

// Icon 7: Group of people — used for Family Members / Group
export function IconGroup({ size = defaults.size, color = defaults.color, strokeWidth = defaults.strokeWidth }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 120.339 122.641" fill="none">
      <G>
        <Path d="M31.042,16.137c.333-19.517,29.364-19.514,29.695,0-.333,19.516-29.364,19.513-29.695,0Z" stroke={color} strokeLinecap="round" strokeMiterlimit={10} strokeWidth={strokeWidth} />
        <Path d="M60.737,25.475c.333-19.517,29.364-19.514,29.695,0-.333,19.516-29.364,19.513-29.695,0Z" stroke={color} strokeLinecap="round" strokeMiterlimit={10} strokeWidth={strokeWidth} />
        <Path d="M35.014,27.992c-15.269,4.121-18.972,22.142-19.356,36.024-.815,5.544,1.122,11.071,6.738,12.962,4.162,1.833,19.74,6.617,16.381-2.682-2.431-3.87-7.711-4.042-11.299-6.088-1.919-7.262-.261-15.444,2.219-22.45" stroke={color} strokeLinecap="round" strokeMiterlimit={10} strokeWidth={strokeWidth} />
        <Path d="M67.87,39.468c-8.17,6.728-6.161,18.651-5.351,28.004-.12,6.938,7.808,10.093,14.201,10.077" stroke={color} strokeLinecap="round" strokeMiterlimit={10} strokeWidth={strokeWidth} />
        <Path d="M70.683,53.622c.702,9.367.005,14.871,10.189,18.864" stroke={color} strokeLinecap="round" strokeMiterlimit={10} strokeWidth={strokeWidth} />
        <Path d="M105.719,41.114c6.47,29.509,11.513,34.666-18.725,38.223-.714.084-1.417.291-2.039.65-9.512,5.503-2.182,20.445-2.064,29.118.605,3.876-4.948,10.504,2.337,10.651,20.189-3.767,8.883-15.718,9.841-27.51.144-1.773,1.262-3.311,2.915-3.969,4.976-1.98,11.568,1.061,10.429-14.041" stroke={color} strokeLinecap="round" strokeMiterlimit={10} strokeWidth={strokeWidth} />
        <Path d="M69.595,77.549c-16.261,9.567,6.87,28.288-2.47,36.336-.95.819-1.628,1.929-1.923,3.148-1.576,6.518,12.269-.14,15.669-1.771" stroke={color} strokeLinecap="round" strokeMiterlimit={10} strokeWidth={strokeWidth} />
        <Path d="M21.212,77.448c-11.626,7.691-.6,22.483-.95,32.961-16.386,14.03.684,11.872,10.94,7.129,1.938-.929,2.951-2.799,2.8-4.921.325-10.672.65-21.343.975-32.015" stroke={color} strokeLinecap="round" strokeMiterlimit={10} strokeWidth={strokeWidth} />
        <Path d="M53.824,72.485c-24.909,4.05-11,20.339-12.608,35.744-1.824,3.073-5.472,6.988-3.306,10.731,3.727,2.86,9.585.141,13.844-.451,1.278-.17,1.928-1.235,2.026-2.467,1.398-8.474,2.199-17.047,2.395-25.633.059-2.587.364-5.691,2.668-6.868" stroke={color} strokeLinecap="round" strokeMiterlimit={10} strokeWidth={strokeWidth} />
        <Path d="M55.104,28.924l7.132,3.389" stroke={color} strokeLinecap="round" strokeMiterlimit={10} strokeWidth={strokeWidth} />
        <Line x1={1.5} y1={88.063} x2={15.234} y2={88.717} stroke={color} strokeLinecap="round" strokeMiterlimit={10} strokeWidth={strokeWidth} />
        <Line x1={101.133} y1={87.736} x2={118.839} y2={88.39} stroke={color} strokeLinecap="round" strokeMiterlimit={10} strokeWidth={strokeWidth} />
      </G>
    </Svg>
  );
}

// Icon 5: Person nurturing seated figure — used for Settings gear / EVV
export function IconNurture({ size = defaults.size, color = defaults.color, strokeWidth = defaults.strokeWidth }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 96.636 109.422" fill="none">
      <G>
        <Path d="M24.758,17.835c.372-21.782,32.773-21.779,33.142,0-.372,21.782-32.773,21.778-33.142,0Z" stroke={color} strokeLinecap="round" strokeMiterlimit={10} strokeWidth={strokeWidth} />
        <Path d="M26.474,28.494C.918,42.775,4.287,78.484,1.5,102.403" stroke={color} strokeLinecap="round" strokeMiterlimit={10} strokeWidth={strokeWidth} />
        <Path d="M38.277,34.171c3.174,6.002,5.668,15.261,4.949,22.005" stroke={color} strokeLinecap="round" strokeMiterlimit={10} strokeWidth={strokeWidth} />
        <Path d="M42.621,73.982c0,13.859-1.31,18.467-1.807,29.938" stroke={color} strokeLinecap="round" strokeMiterlimit={10} strokeWidth={strokeWidth} />
        <Path d="M25.124,45.075c1.408,4.628.962,10.394,3.866,14.337,2.909,2.323,6.565-.228,9.535-1.18,8.015-2.867,16.832,6.543,11.738,13.992-2.246,3.308-6.729,3.689-8.924.414-2.484-2.093-6.187-.773-9.356-.058-15.521,3.333-14.761-6.693-18.22-18.253" stroke={color} strokeLinecap="round" strokeMiterlimit={10} strokeWidth={strokeWidth} />
        <Path d="M88.924,40.697c-.371,6.259-6.364,9.977-11.572,13.048-1.741,5.722-.317,12.836-4.477,17.38-9.563,6.479-12.222,15.036-13.283,26.178-9.783-7.791-7.311-18.636-1.623-27.78,2.16-7.027,1.628-14.842,5.043-21.528,4.051-9.207,16.31-13.994,25.912-7.298Z" stroke={color} strokeLinecap="round" strokeMiterlimit={10} strokeWidth={strokeWidth} />
        <Path d="M72.545,73.162c16.981,2.785,19.506,20.992,22.59,34.76" stroke={color} strokeLinecap="round" strokeMiterlimit={10} strokeWidth={strokeWidth} />
        <Path d="M58.498,106.371c.169-2.518.966-8.153,1.57-13.08" stroke={color} strokeLinecap="round" strokeMiterlimit={10} strokeWidth={strokeWidth} />
        <Path d="M87.387,39.75c15.764,8.587,5.31,33.5-12.013,28.002" stroke={color} strokeLinecap="round" strokeMiterlimit={10} strokeWidth={strokeWidth} />
      </G>
    </Svg>
  );
}

export default {
  Comfort: IconComfort,
  Visit: IconVisit,
  Heart: IconHeart,
  Caregiver: IconCaregiver,
  Group: IconGroup,
  Nurture: IconNurture,
};
