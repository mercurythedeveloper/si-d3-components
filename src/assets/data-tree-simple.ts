const dataTreeSimple= {
  "result": [
    {"id":"1","description":"Prvi node","nodeIcon": "\uf2cb", "action": "ADD","type": "CFS"},
    {"id":"2","description":"2","parent":"1","nodeIcon": "\uf2cb"},
    {"id":"3","description":"3","parent":"1"},
    {"id":"4","description":"4","parent":"2"},
    {"id":"5","description":"5","parent":"2"},
    {"id":"6","description":"6","parent":"5"},
    {"id":"7","description":"7","parent":"5"},
    {"id":"8","description":"8","parent":"5"},
    {"id":"9","description":"9","parent":"3"}
  ]
};

export default dataTreeSimple;
