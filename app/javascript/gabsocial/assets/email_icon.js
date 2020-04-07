const EmailIcon = ({
  className = '',
  width = '24px',
  height = '24px',
  viewBox = '0 0 48 48',
  title = 'Email',
}) => (
  <svg
    className={className}
    version='1.1'
    xmlns='http://www.w3.org/2000/svg'
    x='0px'
    y='0px'
    width={width}
    height={height}
    viewBox={viewBox}
    xmlSpace='preserve'
    aria-label={title}
  >
    <g>
      <path d='M 43.5 6 L 4.5 6 C 2.019531 6 0 8.019531 0 10.5 L 0 37.5 C 0 39.980469 2.019531 42 4.5 42 L 43.5 42 C 45.980469 42 48 39.980469 48 37.5 L 48 10.5 C 48 8.019531 45.980469 6 43.5 6 Z M 43.5 9 C 43.703125 9 43.898438 9.042969 44.074219 9.117188 L 24 26.515625 L 3.925781 9.117188 C 4.101562 9.042969 4.296875 9 4.5 9 Z M 43.5 39 L 4.5 39 C 3.671875 39 3 38.328125 3 37.5 L 3 12.285156 L 23.015625 29.632812 C 23.300781 29.878906 23.648438 30 24 30 C 24.351562 30 24.699219 29.878906 24.984375 29.632812 L 45 12.285156 L 45 37.5 C 45 38.328125 44.328125 39 43.5 39 Z M 43.5 39 '/>
    </g>
  </svg>
)

export default EmailIcon