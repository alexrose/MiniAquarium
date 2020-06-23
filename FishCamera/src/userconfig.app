namespace UserConfig {
    
    class ConfigData
    {
        public:
            char const *ssid = "ssid";
            char const *pass = "password";
            char const *server = "http://localhost:8282";

            int mqttPort = 1234;
            char const *mqttHost = "host";
            char const *mqttUser = "user";
            char const *mqttPass = "pass";
            char const *mqttTopic = "topic";
            char const *mqttClientId = "EspClientId";


            int serverPort = 8282;
    };
}