const dataTreeSimple2 = {
	  "location": {
      "id" : "0",
      "name" : "Service Location Specification"

    },
    "cfsTree" : [
      {
        "id" : "1",
        "name" : "Service Access",
        "version": "1.0.0",
        "maxSize" : 1,
        "minSize" : 1,
        "schemaUri" : "",
        "type" : "CFSS",
        "childCFSs" : [
          {
            "id" : "2",
            "name" : "Internet",
            "version": "1.0.0",
            "maxSize" : 1,
            "minSize" : 1,
            "schemaUri" : "",
            "type" : "CFSS",
            "childCFSs" : [
      			{
                  "id" : "3",
                  "name" : "Internet Speed",
                  "version": "1.0.0",
                  "maxSize" : 1,
                  "minSize" : 1,
                  "schemaUri" : "",
                  "type" : "CFSS",
                  "childCFSs" : [],
                  "childRFSs" : []

                }            
            ],
            "childRFSs" : [
              {
                "id" : "4",
                "name" : "Modem",
                "version": "1.0.0",
                "maxSize" : 1,
                "minSize" : 1,
                "schemaUri" : "",
                "type" : "RFSS",
                "childRFSs" : []
                
              },
              {
                "id" : "5",
                "name" : "WiFiPassword",
                "version": "1.0.0",
                "maxSize" : 1,
                "minSize" : 1,
                "schemaUri" : "",
                "type" : "RFSS",
                "childRFSs" : []
                
              },
              {
                "id" : "6",
                "name" : "PPPoEAccount",
                "version": "1.0.0",
                "maxSize" : 1,
                "minSize" : 1,
                "schemaUri" : "",
                "type" : "RFSS",
                "childRFSs" : []
                
              }               
            ]
          }
        ],
        "childRFSs" : [
			{
            "id" : "7",
            "name" : "HomePass",
            "version": "1.0.0",
            "maxSize" : 1,
            "minSize" : 1,
            "schemaUri" : "",
            "type" : "RFSS",
            "childRFSs" : []
          } ,
          {
            "id" : "8",
            "name" : "Option82",
            "version": "1.0.0",
            "maxSize" : 1,
            "minSize" : 1,
            "schemaUri" : "",
            "type" : "RFSS",
            "childRFSs" : []
          } ,
          {
            "id" : "9",
            "name" : "Self Care Account",
            "version": "1.0.0",
            "maxSize" : 1,
            "minSize" : 1,
            "schemaUri" : "",
            "type" : "RFSS",
            "childRFSs" : []
          } ,
          {
            "id" : "10",
            "name" : "HDFPort",
            "version": "1.0.0",
            "maxSize" : 1,
            "minSize" : 1,
            "schemaUri" : "",
            "type" : "RFSS",
            "childRFSs" : []
          }
        ]
      }
    ]
}

export default dataTreeSimple2;