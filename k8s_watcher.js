
const {k8s,k8score} = require("./k8s_init.js")
const Promise = require('bluebird')
const JSONStream = require('json-stream');
const jsonStream = new JSONStream();
const backendPodStream = new JSONStream();

//watcher api, will notify when the pod is created/delete/updated
function getBackendManagerPodStatus(nameSpaceName) {
    return new Promise(function (res, rej) {
        const stream = k8score.ns(nameSpaceName).pods.get({qs: { watch: true } });
        stream.pipe(backendPodStream);
        backendPodStream.on('data', ({object,type}) => {
           let {kind,status,metadata} = object;
           if(true){
              if (kind != "Status" && status.phase == "Running" && status.conditions.find(isPodReady))
              {
                  console.log(metadata.name+" is :"+status.phase+" and Type :"+type);
                  res(metadata.name+" is :"+status.phase+" and Type :"+type);
              }
              else{
                  console.log(metadata.name+" is :"+status.phase);
                  res("Pod is :"+status.phase);
              }
           }
        });
        backendPodStream.on('error', object => {
            rej("Error Occured While Streaming Backend Pod ");
        });

    });
}

function isPodReady(condition) {
    if (condition.type === "Ready")
        return condition.status;
}

module.exports ={getBackendManagerPodStatus}