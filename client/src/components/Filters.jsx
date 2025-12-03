import React from 'react';

const options = [
  { key: 'all', label: 'Сите' },
  { key: 't-shirt', label: 'Маици' },
  { key: 'sneakers', label: 'Патики' },
  { key: 'shorts', label: 'Шорцеви' }
];

export default function Filters({ value, onChange }){
  return (
    <div className="filters">
      {options.map(o => (
        <button
          key={o.key}
          onClick={() => onChange(o.key)}
          className={`chip ${value === o.key ? 'active' : ''}`}
        >{o.label}</button>
      ))}
    </div>
  )
}
