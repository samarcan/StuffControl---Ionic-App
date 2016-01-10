angular.module('starter.services', ['btford.socket-io'])

.factory('socket',function(socketFactory){
        //Create socket and connect to http://chat.socket.io 
    return socketFactory({
        ioSocket: io.connect('http://stuffcontrol.ddns.net:8000')
    });

        return mySocket;
})