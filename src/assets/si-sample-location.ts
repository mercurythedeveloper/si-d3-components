const dataTreeSimple= {
    "result": [
      {"id":"1","description":"Service Location","nodeIcon": "\uf015", "nodeSymbol": "square"},
      {"id":"2","description":"Cable Access (FTTH)","parent":"1","nodeIcon": "\uf2cb", "nodeSymbol": "square"},
      {"id":"3","description":"3","parent":"2"},
      {"id":"4","description":"4","parent":"2"},
      {"id":"5","description":"5","parent":"2"},
      {"id":"6","description":"6","parent":"5"},
      {"id":"7","description":"7","parent":"5"},
      {"id":"8","description":"8","parent":"5"},
      {"id":"9","description":"9","parent":"3"}
    ]
  };
  
  export default dataTreeSimple;
  