import React from 'react';

export default function Pagination({ page, pages, onPage }){
  if (pages <= 1) return null;
  const items = [];
  for (let i=1; i<=pages; i++){
    items.push(<button key={i} className={`pagebtn ${i===page?'active':''}`} onClick={()=>onPage(i)}>{i}</button>);
  }
  return <div className="pagination">{items}</div>;
}
