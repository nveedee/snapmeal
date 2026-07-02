import {
  Circle,
  Defs,
  Path,
  RadialGradient,
  Rect,
  Stop,
  Svg,
} from 'react-native-svg';

type Props = {
  size?: number;
  borderRadius?: number;
};

export default function SnapMealLogo({ size = 44, borderRadius = 12 }: Props) {
  return (
    <Svg
      viewBox="0 0 1024 1024"
      width={size}
      height={size}
      style={{ borderRadius }}
    >
      <Defs>
        <RadialGradient id="bg" cx="35%" cy="28%" r="85%">
          <Stop offset="0%" stopColor="#8FCAAB" />
          <Stop offset="100%" stopColor="#52A875" />
        </RadialGradient>
      </Defs>

      {/* Hintergrund */}
      <Rect width={1024} height={1024} fill="url(#bg)" />

      {/* Blatt oben rechts */}
      <Path d="M 636 268 Q 706 232 748 274 Q 748 336 682 360 Q 626 336 636 268 Z" fill="#FFFFFF" />

      {/* Kamera-Gehäuse */}
      <Rect x={272} y={430} width={480} height={330} rx={55} fill="#FFFFFF" />

      {/* Kamera-Buckel oben */}
      <Rect x={430} y={378} width={164} height={72} rx={18} fill="#FFFFFF" />

      {/* Objektiv-Ring */}
      <Circle cx={512} cy={602} r={118} fill="none" stroke="#FFFFFF" strokeWidth={30} />

      {/* Objektiv-Kern */}
      <Circle cx={512} cy={602} r={30} fill="#FFFFFF" />

      {/* Grünes Highlight */}
      <Rect x={638} y={452} width={62} height={26} rx={13} fill="#52A875" />
    </Svg>
  );
}
