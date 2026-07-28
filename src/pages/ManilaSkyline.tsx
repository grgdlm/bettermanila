/**
 * An original Manila skyline drawn as simple geometry in the manner of a
 * paper-cut silhouette: one solid mass on an unbroken ground bar, with the
 * detail carried by negative space (arches, the rose window, the clock face,
 * window lines). Heritage landmarks and palms sit in deep indigo; the modern
 * high-rise cluster sits behind them in brighter azure.
 *
 * Left to right: two palms, Manila Cathedral (dome, cross, rose window,
 * arched arcade), the Rizal Monument (stepped base, figure, obelisk), the
 * City Hall clock tower (clock, colonnade, domed cap), modern high-rises,
 * a broad-gabled church with pointed arches, and one more palm.
 *
 * Colours follow the owner's logo artwork: the front layer runs royal
 * (#2846b4) into the darkest logo ink (#210b6f), which is also the district
 * band behind it, so the two meet seamlessly; the back layer is tints of the
 * logo's azure (#0078d2).
 *
 * The silhouettes are suggestions drawn from scratch, not tracings.
 * Decorative only, so the whole drawing is hidden from assistive tech.
 */
export function ManilaSkyline({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 240"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <linearGradient
          id="bm-sky-back"
          x1="0"
          y1="0"
          x2="0"
          y2="240"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#b3d7f2" />
          <stop offset="1" stopColor="#66aee4" />
        </linearGradient>
        <linearGradient
          id="bm-sky-front"
          x1="0"
          y1="0"
          x2="0"
          y2="240"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#2846b4" />
          <stop offset="1" stopColor="#210b6f" />
        </linearGradient>
        {/* One palm, reused at three positions. Base of the trunk at (0,0). */}
        <g id="bm-palm">
          <path d="M -3 0 C -1 -35 4 -70 12 -96 L 18 -94 C 9 -68 6 -34 6 0 Z" />
          <path d="M 14 -96 Q 40 -104 58 -86 Q 38 -94 13 -90 Z" />
          <path d="M 14 -96 Q 44 -92 54 -70 Q 34 -84 12 -89 Z" />
          <path d="M 14 -96 Q 38 -120 62 -116 Q 40 -108 15 -93 Z" />
          <path d="M 14 -96 Q -12 -104 -30 -86 Q -10 -94 15 -90 Z" />
          <path d="M 14 -96 Q -16 -92 -26 -70 Q -6 -84 16 -89 Z" />
          <path d="M 14 -96 Q -10 -120 -34 -116 Q -12 -108 13 -93 Z" />
          <path d="M 14 -96 Q 10 -122 24 -134 Q 16 -118 19 -95 Z" />
        </g>
      </defs>

      {/* Azure layer: modern high-rise cluster */}
      <g fill="url(#bm-sky-back)">
        <rect x="884" y="60" width="64" height="162" />
        <rect x="900" y="48" width="32" height="12" />
        <rect x="956" y="124" width="52" height="98" />
        <rect x="1016" y="164" width="40" height="58" />
      </g>

      {/* Navy layer: landmarks, palms, and the unbroken ground bar */}
      <g fill="url(#bm-sky-front)">
        <rect x="0" y="222" width="1440" height="18" />

        {/* palms, left */}
        <use href="#bm-palm" transform="translate(320 222) scale(0.62)" />
        <use href="#bm-palm" transform="translate(368 222)" />

        {/* Manila Cathedral: wings, facade, drum, dome, lantern, cross */}
        <rect x="430" y="168" width="40" height="54" />
        <rect x="600" y="168" width="40" height="54" />
        <rect x="466" y="132" width="12" height="90" />
        <rect x="592" y="132" width="12" height="90" />
        <rect x="470" y="140" width="130" height="82" />
        <rect x="505" y="112" width="60" height="28" />
        <path d="M 500 112 A 35 30 0 0 1 570 112 Z" />
        <rect x="531" y="66" width="8" height="16" />
        <rect x="533" y="46" width="4" height="20" />
        <rect x="526" y="52" width="18" height="4" />

        {/* Rizal Monument: steps, figure, slender obelisk */}
        <rect x="670" y="208" width="70" height="14" />
        <rect x="678" y="194" width="54" height="14" />
        <rect x="686" y="170" width="38" height="24" />
        <path d="M 692 194 L 692 168 Q 692 158 705 156 Q 718 158 718 168 L 718 194 Z" />
        <circle cx="705" cy="144.5" r="5.2" />
        <polygon points="701.5,156 708.5,156 707,66 703,66" />
        <circle cx="705" cy="61" r="5" />

        {/* City Hall clock tower */}
        <rect x="770" y="206" width="80" height="16" />
        <rect x="778" y="96" width="64" height="110" />
        <rect x="772" y="88" width="76" height="8" />
        <rect x="782" y="64" width="56" height="24" />
        <path d="M 786 64 A 24 20 0 0 1 834 64 Z" />
        <rect x="808" y="30" width="4" height="14" />
        <circle cx="810" cy="27" r="4" />

        {/* broad-gabled church */}
        <path d="M 1060 222 L 1060 168 L 1118 128 L 1132 128 L 1190 168 L 1190 222 Z" />

        {/* palm, right, leaning back toward the city */}
        <use href="#bm-palm" transform="translate(1214 222) scale(-0.9 0.9)" />
      </g>

      {/* Negative space: the detail cut out of the mass */}
      <g fill="#ffffff">
        {/* cathedral rose window and arcade */}
        <circle cx="535" cy="166" r="11" />
        <path d="M 524 222 L 524 201 A 11 11 0 0 1 546 201 L 546 222 Z" />
        <path d="M 494 222 L 494 206 A 8 8 0 0 1 510 206 L 510 222 Z" />
        <path d="M 560 222 L 560 206 A 8 8 0 0 1 576 206 L 576 222 Z" />
        <path d="M 443 222 L 443 207 A 7 7 0 0 1 457 207 L 457 222 Z" />
        <path d="M 613 222 L 613 207 A 7 7 0 0 1 627 207 L 627 222 Z" />

        {/* clock tower: door, slits, clock, colonnade */}
        <path d="M 803 218 L 803 199 A 7 7 0 0 1 817 199 L 817 218 Z" />
        <rect x="794" y="134" width="4" height="42" />
        <rect x="822" y="134" width="4" height="42" />
        <circle cx="810" cy="116" r="16" />
        <rect x="790" y="68" width="8" height="16" />
        <rect x="806" y="68" width="8" height="16" />
        <rect x="822" y="68" width="8" height="16" />

        {/* high-rise louvers and window grids */}
        <rect x="890" y="72" width="52" height="3" />
        <rect x="890" y="84" width="52" height="3" />
        <rect x="890" y="96" width="52" height="3" />
        <rect x="890" y="108" width="52" height="3" />
        <rect x="890" y="120" width="52" height="3" />
        <rect x="890" y="132" width="52" height="3" />
        <rect x="890" y="144" width="52" height="3" />
        <rect x="890" y="156" width="52" height="3" />
        <rect x="890" y="168" width="52" height="3" />
        <rect x="890" y="180" width="52" height="3" />
        <rect x="890" y="192" width="52" height="3" />
        <rect x="890" y="204" width="52" height="3" />
        <rect x="966" y="136" width="8" height="8" />
        <rect x="984" y="136" width="8" height="8" />
        <rect x="966" y="152" width="8" height="8" />
        <rect x="984" y="152" width="8" height="8" />
        <rect x="966" y="168" width="8" height="8" />
        <rect x="984" y="168" width="8" height="8" />
        <rect x="966" y="184" width="8" height="8" />
        <rect x="984" y="184" width="8" height="8" />
        <rect x="966" y="200" width="8" height="8" />
        <rect x="984" y="200" width="8" height="8" />
        <rect x="1024" y="174" width="6" height="6" />
        <rect x="1038" y="174" width="6" height="6" />
        <rect x="1024" y="188" width="6" height="6" />
        <rect x="1038" y="188" width="6" height="6" />
        <rect x="1024" y="202" width="6" height="6" />
        <rect x="1038" y="202" width="6" height="6" />

        {/* church arches: tall centre, two sides */}
        <path d="M 1112 222 L 1112 173 L 1125 160 L 1138 173 L 1138 222 Z" />
        <path d="M 1082 222 L 1082 185 L 1091 176 L 1100 185 L 1100 222 Z" />
        <path d="M 1150 222 L 1150 185 L 1159 176 L 1168 185 L 1168 222 Z" />
      </g>

      {/* details inside the negative space */}
      <g fill="#282896">
        <circle cx="535" cy="166" r="6.5" />
        <circle cx="810" cy="116" r="2" />
        <rect x="809" y="104" width="2" height="12" />
        <rect x="810" y="115" width="10" height="2" />
      </g>
      <circle cx="535" cy="166" r="2.5" fill="#ffffff" />
    </svg>
  );
}
