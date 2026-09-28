// Hand-drawn Phantom Thieves style top hat with a flame on the brim.
export default function PhantomHat({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 240 220" aria-hidden="true">
      <g transform="rotate(-14 120 110)" stroke="#0b0b0b" strokeWidth="5" strokeLinejoin="round">
        {/* crown */}
        <path d="M72 40 L80 140 Q120 152 160 140 L168 40 Q120 56 72 40 Z" fill="#e60012" />
        <path d="M72 40 Q86 90 80 140 L97 145 Q92 92 90 49 Z" fill="#0b0b0b" stroke="none" />
        <path d="M150 52 Q156 96 152 140 L160 140 L166 45 Z" fill="#ff4a57" stroke="none" opacity="0.8" />
        <ellipse cx="120" cy="40" rx="48" ry="12" fill="#b3000e" />
        {/* band */}
        <path d="M79 116 Q120 131 161 116 L160 140 Q120 152 80 140 Z" fill="#0b0b0b" />
        {/* brim */}
        <path d="M26 142 Q120 110 214 142 Q228 160 196 171 Q120 190 44 171 Q12 160 26 142 Z" fill="#e60012" />
        <path d="M30 157 Q120 181 211 157 Q206 172 190 175 Q120 191 50 175 Q34 170 30 157 Z" fill="#0b0b0b" stroke="none" />
        {/* flame */}
        <path
          d="M146 152 C150 136 160 130 170 126 C166 118 170 110 176 102 C178 112 184 118 190 116 C188 108 194 100 203 94 C200 105 204 113 212 116 C210 110 216 103 225 100 C220 111 222 121 229 126 C222 150 200 168 168 170 Z"
          fill="#f4f4f4"
          strokeWidth="4"
        />
        <path
          d="M162 160 C168 148 178 146 184 134 C186 143 193 146 199 140 C198 135 202 129 209 126 C207 142 196 156 170 162 Z"
          fill="#e60012"
          stroke="none"
        />
      </g>
    </svg>
  )
}
