const {k8s,k8score} = require("./k8s_init.js")
const k8sWatcher = require("./k8s_watcher.js")
const Promise = require('bluebird')
const rs = require('randomstring')
const template = require('./templates/deploymentJson.js');
const tennantObjectsInfo ={};


/* Generate Salt of 5 Letters (Alphanumeric Chars) to randomize
 the tenantize instance name for security purpose*/

const createSalt = () =>
    rs.generate({
        length: 5,
        charset: 'alphanumeric',
        capitalization: 'lowercase'
    });


function wrapPromise(fn) {
    return function(...params) {
        return new Promise((res, rej) => {
            fn(...params, (err, results) => {
                err ? rej(err) : res(results)
            })
        })
    }
}

//nameSpaceName = {tennantId-salt} 
const getDeploymentJson = (nameSpaceName) => template(nameSpaceName);

const createDeployment = (nameSpaceName) => {

    // Getting Deployment Json
    let deploymentJson = template(nameSpaceName);
    let k8ServicesJson = Object.keys(deploymentJson.svc).map(function (k) {
        return deploymentJson.svc[k]
    });
    let k8StatefulSetsJson = Object.keys(deploymentJson.sfs).map(function (k) {
        return deploymentJson.sfs[k]
    });

    //NameSpaces
    const k8sNameSpace = k8s.group("v1").ns();
    const createNameSpace = wrapPromise(k8sNameSpace.post.bind(k8sNameSpace));
    //Services
    const k8sService = k8s.group("v1").ns(nameSpaceName).kind("Service")
    const createService = wrapPromise(k8sService.post.bind(k8sService));
    //StateFulSets
    const k8sStateFulSet = k8s.group("apps/v1beta1").ns(nameSpaceName).kind("StatefulSet")
    const createStateFulSet = wrapPromise(k8sStateFulSet.post.bind(k8sStateFulSet));

    createNameSpace({ body: deploymentJson.ns })
        .then(function (nameSpaceResult) {
            tennantObjectsInfo.ns = nameSpaceResult;
            return Promise.all(k8StatefulSetsJson.map(function (sfs) {
                return createStateFulSet({ body: sfs })
            }
            ));
        })
        .then(function (stateFulSetResult) {
            tennantObjectsInfo.sfs = stateFulSetResult;
            return Promise.all(k8ServicesJson.map(function (svc) {
                return createService({ body: svc })
            }
            ));
        }).then(function (serviceResult) {
            tennantObjectsInfo.svc = serviceResult;
            return getBackendManagerStatus(nameSpaceName);
        })
        .catch(function (err) {
            console.log(err);
        });

}


const getBackendManagerStatus = (nameSpaceName) => {
    k8sWatcher.getBackendManagerPodStatus(nameSpaceName)
    .then(function(status){
        console.log(status)
    })
    .catch(function(err){
        console.log(err);
    });
}


//createDeployment("tennant");

//Nilesh Code will call the getDeploymentJson and createDeployment()

/*let nameSpaceName = "tennant-"+createSalt();
getDeploymentJson(nameSpaceName);
createDeployment(nameSpaceName);*/


getBackendManagerStatus("tennant-w8k7v");

