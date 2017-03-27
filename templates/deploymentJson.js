module.exports = (tennantId) =>({
     "ns": {
                "apiVersion": "v1",
                "kind": "Namespace",
                "metadata": {
                    "name": `${tennantId}`
                }
             },
      "svc": {  
                "engine":{  // Loopback Service
                            "apiVersion":"v1",
                            "kind":"Service",
                            "metadata":{  
                                "name":"engine",
                                "namespace":`${tennantId}`,
                                "labels":{  
                                "app":"backend",
                                "tier":"engine"
                                }
                              },
                            "spec":{  
                                "type":"NodePort",
                                "selector":{  
                                "app":"backend"
                                },
                                "ports":[{  
                                    "port":3000
                                }]
                              }
                          },
                "bm":   {  //Backend Manager for talking to redis
                            "apiVersion":"v1",
                            "kind":"Service",
                            "metadata":{  
                                "name":"bm",
                                "namespace":`${tennantId}`,
                                "labels":{  
                                "app":"backend",
                                "tier":"bm"
                                }
                            },
                            "spec":{  
                                "type":"NodePort",
                                "selector":{  
                                "app":"backend"
                                },
                                "ports":[{  
                                    "port":3030
                                }]
                            }
                    },
                "redis":{  
                            "apiVersion":"v1",
                            "kind":"Service",
                            "metadata":{  
                                "name":"redis",
                                "labels":{  
                                "app":"backend",
                                "tier":"redis"
                                }
                             },
                            "spec":{  
                                "selector":{  
                                "app":"backend",
                                "tier":"redis"
                                },
                                "ports":[  
                                {
                                    "port": 6379,
                                    "targetPort": 6379
                                    }
                                ]
                            }
                        }
            },
     "sfs":{
             "engine":{
                        "apiVersion": "apps/v1beta1",
                        "kind": "StatefulSet",
                        "metadata": {
                            "namespace":`${tennantId}`,
                            "name": "engine",
                            "labels": {
                            "app": "backend",
                            "tier":"engine"
                            }
                         },
                        "spec": {
                            "serviceName": "engine",
                            "replicas": 1,
                            "template": {
                            "metadata": {
                                "labels": {
                                "app": "backend"
                                }
                            },
                            "spec": {
                                "containers": [
                                {
                                    "name": "engine",
                                    "image": "sukantgujar/ke:latest",
                                    "env": [
                                    {
                                        "name": "DOWNLOAD_PATH",
                                        "value": "/var/download"
                                    }
                                    ],
                                    "ports": [
                                        {
                                            "name":"web",
                                            "containerPort":3000
                                        }],
                                    "volumeMounts": [
                                    {
                                        "name": "code",
                                        "mountPath": "/var/code"
                                    },
                                    {
                                        "name": "download",
                                        "mountPath": "/var/download"
                                    }
                                    ]
                                }
                                ],
                                "volumes": [
                                {
                                    "name": "code",
                                    "emptyDir": {
                                    }
                                },
                                {
                                    "name": "download",
                                    "emptyDir": {
                                    }
                                }
                                ]
                            }
                          }
                        }
                    },      // Stateful Engine Json Completion
            "bm":   {
                            "apiVersion": "apps/v1beta1",
                            "kind": "StatefulSet",
                            "metadata": {
                                "namespace":`${tennantId}`,
                                "name": "bm",
                                "labels": {
                                "app": "backend",
                                "tier":"bm"
                                }
                            },
                            "spec": {
                                "serviceName": "bm",
                                "replicas": 1,
                                "template": {
                                "metadata": {
                                    "labels": {
                                    "app": "backend",
                                    "tier":"bm"
                                    }
                                },
                                "spec": {
                                    "containers": [
                                    {
                                        "name": "bm",
                                        "image": "sukantgujar/ke:latest",
                                        "env": [
                                        {
                                            "name": "DOWNLOAD_PATH",
                                            "value": "/var/download"
                                        }
                                        ],
                                        "ports": [
                                            {
                                                "name":"web",
                                                "containerPort":3030
                                            }],
                                        "volumeMounts": [
                                        {
                                            "name": "code",
                                            "mountPath": "/var/code"
                                        },
                                        {
                                            "name": "download",
                                            "mountPath": "/var/download"
                                        }
                                        ]
                                    }
                                    ],
                                    "volumes": [
                                    {
                                        "name": "code",
                                        "emptyDir": {
                                        }
                                    },
                                    {
                                        "name": "download",
                                        "emptyDir": {
                                        }
                                    }
                                    ]
                                }
                              }
                            }
                   },  // Backend Manager StateFul Set Json End
        "redis" : {
                            "apiVersion": "apps/v1beta1",
                            "kind": "StatefulSet",
                            "metadata": {
                                "namespace":`${tennantId}`,
                                "name": "redis",
                                "labels": {
                                "app": "backend",
                                "tier":"redis"
                                }
                            },
                            "spec": {
                                "serviceName": "redis",
                                "replicas": 1,
                                "template": {
                                "metadata": {
                                    "labels": {
                                    "app": "backend"
                                    }
                                },
                                "spec": {
                                    "containers": [
                                    {
                                        "name": "redis",
                                        "image": "sukantgujar/ke:latest",
                                        "env": [
                                        {
                                            "name": "DOWNLOAD_PATH",
                                            "value": "/var/download"
                                        }
                                        ],
                                        "ports": [
                                            {
                                                "name":"web",
                                                "containerPort":6379
                                            }],
                                        "volumeMounts": [
                                        {
                                            "name": "code",
                                            "mountPath": "/var/code"
                                        },
                                        {
                                            "name": "download",
                                            "mountPath": "/var/download"
                                        }
                                        ]
                                    }
                                    ],
                                    "volumes": [
                                    {
                                        "name": "code",
                                        "emptyDir": {
                                        }
                                    },
                                    {
                                        "name": "download",
                                        "emptyDir": {
                                        }
                                    }
                                    ]
                                }
                                }
                            }
                } //Redis StateFul Set Json End
       } 
    });