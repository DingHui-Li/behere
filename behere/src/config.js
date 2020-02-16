export default {
    "dev":{ 
        "serverHost":"http://localhost:7001",
        "apiHost":"http://39.108.208.140:8008/behere",
        "wsHost":"ws://39.108.208.140:8090/ws"
    },
    "pro":{
        "serverHost":"https://holi.fun/server",
        "apiHost":"https://holi.fun/api",
        "wsHost":"wss://holi.fun:8002",
    }
} 

//docker run -p 4443:4443 -e openvidu.secret=sad123 -e openvidu.publicurl=https://holi.fun:4443 -e openvidu.cdr=true -e server.ssl.key-store=/holifun.jks -e server.ssl.key-store-password=sad123 -e server.ssl.key-alias=holifun -e KMS_STUN_IP=106.54.29.79 -e KMS_STUN_PORT=3478 -e KMS_TURN_URL=zimu:sad12345@106.54.29.79:3478  openvidu/openvidu-server-kms:2.11.0
