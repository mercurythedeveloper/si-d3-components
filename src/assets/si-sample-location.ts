const dataTreeSimple= {
    "result": [
      {"id":"1","description":"Service Location","nodeIcon": "\uf015", "nodeSymbol": "square", "nodeColor" : ""},
      {"id":"2","description":"Cable Access (FTTH)","parent":"1","nodeIcon": "\uf22c", "nodeSymbol": "square", "nodeColor" : ""},
      {"id":"3","description":"Digital TV","parent":"2","nodeIcon": "\uf26c", "nodeSymbol": "square", "nodeColor" : ""},
      {"id":"4","description":"Internet","parent":"2","nodeIcon": "\uf1eb", "nodeSymbol": "square"},
      {"id":"5","description":"Voice","parent":"2","nodeIcon": "\uf095", "nodeSymbol": "square"},
      {"id":"6","description":"Internet Speed 20/5 Mbit/s","parent":"4","nodeIcon": "\uf496", "nodeSymbol": "square"},
      {"id":"7","description":"7","parent":"5"},
      {"id":"8","description":"8","parent":"5"},
      {"id":"9","description":"9","parent":"3"}
    ]
  };
  
  export default dataTreeSimple;
  