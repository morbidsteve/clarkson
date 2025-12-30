'use client';

interface RankInsigniaProps {
  rank: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

// Map ranks to their pay grades for insignia rendering
const RANK_TO_GRADE: Record<string, string> = {
  // Marine Corps Enlisted (primary)
  'Pvt': 'E-1', 'PVT': 'E-1', 'Private': 'E-1',
  'PFC': 'E-2', 'Private First Class': 'E-2',
  'LCpl': 'E-3', 'Lance Corporal': 'E-3',
  'Cpl': 'E-4', 'CPL': 'E-4', 'Corporal': 'E-4',
  'Sgt': 'E-5', 'SGT': 'E-5', 'Sergeant': 'E-5',
  'SSgt': 'E-6', 'Staff Sergeant': 'E-6',
  'GySgt': 'E-7', 'Gunnery Sergeant': 'E-7',
  'MSgt': 'E-8', 'Master Sergeant': 'E-8',
  '1stSgt': 'E-8', 'First Sergeant': 'E-8',
  'MGySgt': 'E-9', 'Master Gunnery Sergeant': 'E-9',
  'SgtMaj': 'E-9', 'Sergeant Major': 'E-9',
  // Army Enlisted
  'PV2': 'E-2', 'Private Second Class': 'E-2',
  'SPC': 'E-4', 'Specialist': 'E-4',
  'SSG': 'E-6',
  'SFC': 'E-7', 'Sergeant First Class': 'E-7',
  'MSG': 'E-8',
  '1SG': 'E-8',
  'SGM': 'E-9',
  'CSM': 'E-9', 'Command Sergeant Major': 'E-9',
  // Marine Warrant Officers
  'WO': 'W-1', 'WO1': 'W-1', 'Warrant Officer': 'W-1',
  'CWO2': 'W-2', 'CW2': 'W-2', 'Chief Warrant Officer 2': 'W-2',
  'CWO3': 'W-3', 'CW3': 'W-3', 'Chief Warrant Officer 3': 'W-3',
  'CWO4': 'W-4', 'CW4': 'W-4', 'Chief Warrant Officer 4': 'W-4',
  'CWO5': 'W-5', 'CW5': 'W-5', 'Chief Warrant Officer 5': 'W-5',
  // Marine Officers
  '2ndLt': 'O-1', '2LT': 'O-1', 'Second Lieutenant': 'O-1',
  '1stLt': 'O-2', '1LT': 'O-2', 'First Lieutenant': 'O-2',
  'Capt': 'O-3', 'CPT': 'O-3', 'Captain': 'O-3',
  'Maj': 'O-4', 'MAJ': 'O-4', 'Major': 'O-4',
  'LtCol': 'O-5', 'LTC': 'O-5', 'Lieutenant Colonel': 'O-5',
  'Col': 'O-6', 'COL': 'O-6', 'Colonel': 'O-6',
  'BGen': 'O-7', 'BG': 'O-7', 'Brigadier General': 'O-7',
  'MajGen': 'O-8', 'MG': 'O-8', 'Major General': 'O-8',
  'LtGen': 'O-9', 'LTG': 'O-9', 'Lieutenant General': 'O-9', 'Lt Gen': 'O-9',
  'Gen': 'O-10', 'GEN': 'O-10', 'General': 'O-10',
};

const SIZE_MAP = {
  sm: 24,
  md: 32,
  lg: 48,
  xl: 64,
};

export function RankInsignia({ rank, size = 'md', className = '' }: RankInsigniaProps) {
  const grade = RANK_TO_GRADE[rank] || 'E-1';
  const dimension = SIZE_MAP[size];

  // Enlisted chevrons (E-1 to E-9)
  if (grade.startsWith('E-')) {
    const level = parseInt(grade.split('-')[1]);
    return (
      <svg
        width={dimension}
        height={dimension}
        viewBox="0 0 100 100"
        className={className}
        aria-label={`${rank} insignia`}
      >
        <defs>
          <linearGradient id={`chevronGold-${rank}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="50%" stopColor="#DAA520" />
            <stop offset="100%" stopColor="#B8860B" />
          </linearGradient>
          <linearGradient id={`chevronSilver-${rank}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E8E8E8" />
            <stop offset="50%" stopColor="#C0C0C0" />
            <stop offset="100%" stopColor="#A0A0A0" />
          </linearGradient>
        </defs>

        {/* Background circle */}
        <circle cx="50" cy="50" r="48" fill="#1a1a2e" stroke="#333" strokeWidth="2" />

        {level === 1 && (
          // E-1: No chevron, just circle
          <text x="50" y="58" textAnchor="middle" fill="#666" fontSize="14" fontWeight="bold">PVT</text>
        )}

        {level >= 2 && level <= 4 && (
          // E-2 to E-4: 1-3 chevrons pointing up
          <g transform="translate(50, 55)">
            {Array.from({ length: level - 1 }).map((_, i) => (
              <path
                key={i}
                d={`M -25 ${-10 - i * 12} L 0 ${-22 - i * 12} L 25 ${-10 - i * 12}`}
                fill="none"
                stroke={`url(#chevronGold-${rank})`}
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
          </g>
        )}

        {level >= 5 && level <= 6 && (
          // E-5 to E-6: Chevrons with rockers
          <g transform="translate(50, 50)">
            {/* Upper chevrons */}
            {Array.from({ length: level - 3 }).map((_, i) => (
              <path
                key={`up-${i}`}
                d={`M -25 ${-5 - i * 12} L 0 ${-17 - i * 12} L 25 ${-5 - i * 12}`}
                fill="none"
                stroke={`url(#chevronGold-${rank})`}
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
            {/* Lower rocker */}
            <path
              d="M -25 10 L 0 22 L 25 10"
              fill="none"
              stroke={`url(#chevronGold-${rank})`}
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        )}

        {level >= 7 && level <= 9 && (
          // E-7 to E-9: More chevrons and rockers
          <g transform="translate(50, 50)">
            {/* Upper chevrons */}
            {Array.from({ length: 3 }).map((_, i) => (
              <path
                key={`up-${i}`}
                d={`M -25 ${-5 - i * 10} L 0 ${-15 - i * 10} L 25 ${-5 - i * 10}`}
                fill="none"
                stroke={`url(#chevronGold-${rank})`}
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
            {/* Lower rockers */}
            {Array.from({ length: level - 6 }).map((_, i) => (
              <path
                key={`down-${i}`}
                d={`M -25 ${15 + i * 10} L 0 ${25 + i * 10} L 25 ${15 + i * 10}`}
                fill="none"
                stroke={`url(#chevronGold-${rank})`}
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
            {/* Star for E-9 */}
            {level === 9 && (
              <polygon
                points="50,35 53,44 63,44 55,50 58,60 50,54 42,60 45,50 37,44 47,44"
                transform="translate(-50, -45) scale(0.8)"
                fill={`url(#chevronGold-${rank})`}
              />
            )}
          </g>
        )}
      </svg>
    );
  }

  // Warrant Officers (W-1 to W-5)
  if (grade.startsWith('W-')) {
    const level = parseInt(grade.split('-')[1]);
    return (
      <svg
        width={dimension}
        height={dimension}
        viewBox="0 0 100 100"
        className={className}
        aria-label={`${rank} insignia`}
      >
        <defs>
          <linearGradient id={`woGold-${rank}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="100%" stopColor="#B8860B" />
          </linearGradient>
        </defs>

        <circle cx="50" cy="50" r="48" fill="#1a1a2e" stroke="#333" strokeWidth="2" />

        {/* WO bars */}
        <g transform="translate(50, 50)">
          <rect x="-20" y="-25" width="40" height="50" fill="none" stroke={`url(#woGold-${rank})`} strokeWidth="3" rx="3" />
          {/* Horizontal divisions */}
          {Array.from({ length: level }).map((_, i) => (
            <rect
              key={i}
              x="-17"
              y={-22 + i * 12}
              width="34"
              height="10"
              fill={i % 2 === 0 ? `url(#woGold-${rank})` : '#1a1a2e'}
            />
          ))}
        </g>
      </svg>
    );
  }

  // Officers (O-1 to O-10)
  if (grade.startsWith('O-')) {
    const level = parseInt(grade.split('-')[1]);
    return (
      <svg
        width={dimension}
        height={dimension}
        viewBox="0 0 100 100"
        className={className}
        aria-label={`${rank} insignia`}
      >
        <defs>
          <linearGradient id={`officerGold-${rank}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="50%" stopColor="#DAA520" />
            <stop offset="100%" stopColor="#B8860B" />
          </linearGradient>
          <linearGradient id={`officerSilver-${rank}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F0F0F0" />
            <stop offset="50%" stopColor="#C0C0C0" />
            <stop offset="100%" stopColor="#909090" />
          </linearGradient>
        </defs>

        <circle cx="50" cy="50" r="48" fill="#1a1a2e" stroke="#333" strokeWidth="2" />

        {/* O-1 and O-2: Bars */}
        {level <= 2 && (
          <g transform="translate(50, 50)">
            {level === 1 ? (
              // Single gold bar
              <rect x="-15" y="-8" width="30" height="16" fill={`url(#officerGold-${rank})`} stroke="#8B7500" strokeWidth="1" rx="2" />
            ) : (
              // Single silver bar
              <rect x="-15" y="-8" width="30" height="16" fill={`url(#officerSilver-${rank})`} stroke="#708090" strokeWidth="1" rx="2" />
            )}
          </g>
        )}

        {/* O-3: Double silver bars */}
        {level === 3 && (
          <g transform="translate(50, 50)">
            <rect x="-20" y="-8" width="16" height="16" fill={`url(#officerSilver-${rank})`} stroke="#708090" strokeWidth="1" rx="2" />
            <rect x="4" y="-8" width="16" height="16" fill={`url(#officerSilver-${rank})`} stroke="#708090" strokeWidth="1" rx="2" />
          </g>
        )}

        {/* O-4: Gold oak leaf */}
        {level === 4 && (
          <g transform="translate(50, 50)">
            <ellipse cx="0" cy="0" rx="18" ry="22" fill={`url(#officerGold-${rank})`} />
            <path d="M 0 -18 Q 5 -10 0 0 Q -5 -10 0 -18" fill="#1a1a2e" opacity="0.3" />
            <path d="M 0 18 Q 5 10 0 0 Q -5 10 0 18" fill="#1a1a2e" opacity="0.3" />
            <line x1="-12" y1="0" x2="12" y2="0" stroke="#8B7500" strokeWidth="2" />
          </g>
        )}

        {/* O-5: Silver oak leaf */}
        {level === 5 && (
          <g transform="translate(50, 50)">
            <ellipse cx="0" cy="0" rx="18" ry="22" fill={`url(#officerSilver-${rank})`} />
            <path d="M 0 -18 Q 5 -10 0 0 Q -5 -10 0 -18" fill="#1a1a2e" opacity="0.3" />
            <path d="M 0 18 Q 5 10 0 0 Q -5 10 0 18" fill="#1a1a2e" opacity="0.3" />
            <line x1="-12" y1="0" x2="12" y2="0" stroke="#708090" strokeWidth="2" />
          </g>
        )}

        {/* O-6: Eagle */}
        {level === 6 && (
          <g transform="translate(50, 50)">
            {/* Simplified eagle */}
            <path
              d="M 0 -20 L -25 0 L -20 5 L 0 -5 L 20 5 L 25 0 Z"
              fill={`url(#officerSilver-${rank})`}
              stroke="#708090"
              strokeWidth="1"
            />
            <circle cx="0" cy="-12" r="6" fill={`url(#officerSilver-${rank})`} />
            <path d="M 0 0 L 0 20" stroke={`url(#officerSilver-${rank})`} strokeWidth="4" />
            <path d="M -15 15 L 15 15" stroke={`url(#officerSilver-${rank})`} strokeWidth="3" />
          </g>
        )}

        {/* O-7 to O-10: Stars */}
        {level >= 7 && (
          <g transform="translate(50, 50)">
            {level === 7 && (
              // 1 star
              <polygon
                points="0,-25 6,-8 25,-8 10,4 16,22 0,12 -16,22 -10,4 -25,-8 -6,-8"
                fill={`url(#officerSilver-${rank})`}
                stroke="#708090"
                strokeWidth="1"
              />
            )}
            {level === 8 && (
              // 2 stars
              <>
                <polygon
                  points="0,-25 4,-12 18,-12 7,-3 11,10 0,3 -11,10 -7,-3 -18,-12 -4,-12"
                  transform="translate(-15, 0) scale(0.7)"
                  fill={`url(#officerSilver-${rank})`}
                />
                <polygon
                  points="0,-25 4,-12 18,-12 7,-3 11,10 0,3 -11,10 -7,-3 -18,-12 -4,-12"
                  transform="translate(15, 0) scale(0.7)"
                  fill={`url(#officerSilver-${rank})`}
                />
              </>
            )}
            {level === 9 && (
              // 3 stars
              <>
                <polygon
                  points="0,-25 4,-12 18,-12 7,-3 11,10 0,3 -11,10 -7,-3 -18,-12 -4,-12"
                  transform="translate(0, -12) scale(0.6)"
                  fill={`url(#officerSilver-${rank})`}
                />
                <polygon
                  points="0,-25 4,-12 18,-12 7,-3 11,10 0,3 -11,10 -7,-3 -18,-12 -4,-12"
                  transform="translate(-18, 10) scale(0.6)"
                  fill={`url(#officerSilver-${rank})`}
                />
                <polygon
                  points="0,-25 4,-12 18,-12 7,-3 11,10 0,3 -11,10 -7,-3 -18,-12 -4,-12"
                  transform="translate(18, 10) scale(0.6)"
                  fill={`url(#officerSilver-${rank})`}
                />
              </>
            )}
            {level === 10 && (
              // 4 stars
              <>
                <polygon
                  points="0,-25 4,-12 18,-12 7,-3 11,10 0,3 -11,10 -7,-3 -18,-12 -4,-12"
                  transform="translate(-18, -10) scale(0.5)"
                  fill={`url(#officerSilver-${rank})`}
                />
                <polygon
                  points="0,-25 4,-12 18,-12 7,-3 11,10 0,3 -11,10 -7,-3 -18,-12 -4,-12"
                  transform="translate(18, -10) scale(0.5)"
                  fill={`url(#officerSilver-${rank})`}
                />
                <polygon
                  points="0,-25 4,-12 18,-12 7,-3 11,10 0,3 -11,10 -7,-3 -18,-12 -4,-12"
                  transform="translate(-18, 15) scale(0.5)"
                  fill={`url(#officerSilver-${rank})`}
                />
                <polygon
                  points="0,-25 4,-12 18,-12 7,-3 11,10 0,3 -11,10 -7,-3 -18,-12 -4,-12"
                  transform="translate(18, 15) scale(0.5)"
                  fill={`url(#officerSilver-${rank})`}
                />
              </>
            )}
          </g>
        )}
      </svg>
    );
  }

  // Default fallback
  return (
    <svg
      width={dimension}
      height={dimension}
      viewBox="0 0 100 100"
      className={className}
      aria-label={`${rank} insignia`}
    >
      <circle cx="50" cy="50" r="48" fill="#1a1a2e" stroke="#333" strokeWidth="2" />
      <text x="50" y="55" textAnchor="middle" fill="#888" fontSize="12" fontWeight="bold">
        {rank.substring(0, 3)}
      </text>
    </svg>
  );
}
