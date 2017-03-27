const Api = require('kubernetes-client')
const fs = require('fs')
const k8s = new Api.Api({
    url: 'https://192.168.99.100:8443',
    namespace: 'default',
    cert: fs.readFileSync('C:/Users/agangarde/.minikube/apiserver.crt').toString(),
    key: fs.readFileSync('C:/Users/agangarde/.minikube/apiserver.key').toString(),
    ca: fs.readFileSync('C:/Users/agangarde/.minikube/ca.crt').toString()
}),
 k8score = new Api.Core({
    url: 'https://192.168.99.100:8443',
    namespace: 'default',
    request: {
    timeout: 0,
    forever: true,
  },
    cert: fs.readFileSync('C:/Users/agangarde/.minikube/apiserver.crt').toString(),
    key: fs.readFileSync('C:/Users/agangarde/.minikube/apiserver.key').toString(),
    ca: fs.readFileSync('C:/Users/agangarde/.minikube/ca.crt').toString()
});


module.exports = {k8s,k8score}