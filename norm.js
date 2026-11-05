// Shared result normalization (browser + node build).
(function(g){
  function cell(v){
    if(v===null||v===undefined) return 'NULL';
    if(typeof v==='bigint') v=Number(v);
    if(typeof v==='boolean') return v?'true':'false';
    if(v instanceof Date) return v.toISOString().slice(0,10);
    if(typeof v==='number') return (Math.round(v*100)/100).toFixed(2);
    var s=String(v);
    if(/^-?\d+(\.\d+)?$/.test(s)) return (Math.round(parseFloat(s)*100)/100).toFixed(2);
    return s;
  }
  function normRows(rows,fields,ordered){
    var out=rows.map(function(r){return fields.map(function(f){return cell(r[f])}).join('\u241F')});
    if(!ordered) out.sort();
    return out;
  }
  g.AENorm={cell:cell,normRows:normRows,
    parsers:{1082:function(x){return x},1114:function(x){return x},1184:function(x){return x},1700:function(x){return x}}};
})(typeof window!=='undefined'?window:globalThis);
