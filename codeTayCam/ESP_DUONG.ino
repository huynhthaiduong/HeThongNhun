#include <SocketIOClient.h>
#include <ESP8266WiFi.h>

SocketIOClient client;
char* ssid;
char* password;

int timeConnectWifi;
bool isConnectWifi = false;

char host[] = "159.65.14.146";
int port = 8888;
extern String RID;
extern String Rname;
extern String Rcontent;

bool isGet = false;

unsigned long currentMillis = 0;
unsigned long previousMillis = 0;
long interval = 5000;

int BUZZER = 10;

void setup()
{
  Serial.begin(115200);
  delay(10);

  pinMode(BUZZER, OUTPUT);
  digitalWrite(BUZZER, HIGH);

  connectWifi();

  Serial.println("");
  Serial.println("WiFi connected");  
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  if (!client.connect(host, port, "")) {
    Serial.println("connection failed");
    return;
  }

  if (client.connected())
  {
    Serial.println("connection successful");
    delay(1000);
    client.send("device", "deviceName", "DUONG");
  }
}


void loop()
{
  while (Serial.available()) {
    // get the new byte:
    char inChar = (char)Serial.read();
    if (isGet == true) {
      Serial.print(inChar);
      client.send("controlDevice", "control", (String)inChar);

      previousMillis = millis();
      isGet = false;
    }
    else if (inChar == '~') {
      isGet = true;
    }
  }

  if (client.monitor()) {
    if (RID == "buzzer") {
      if (Rcontent == "hit") {
        Serial.println("buzz hit");
        buzzerHit();
      }
      else if (Rcontent == "win") {
        Serial.println("buzz win");
        buzzerWin();
      } 
      else if (Rcontent == "lose") {
        Serial.println("buzz lose");
        buzzerLose(); 
      }
    }
  }

  unsigned long currentMillis = millis();
  if (currentMillis - previousMillis > interval) {
    previousMillis = currentMillis;

    client.send("controlDevice", "control", (String)'_');
  }
}


void connectWifi()
{
  if (isConnectWifi == false) {
    ssid     = "ESP12E";
    password = "12345679";
    timeConnectWifi = 0;
    Serial.println();
    Serial.print("Try to connect to WiFi: "); 
    Serial.println(ssid);
    
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
      if (timeConnectWifi > 20) {
        break;
      }
      delay(500);
      Serial.print(".");
      timeConnectWifi++;
    }
    if (WiFi.status() == WL_CONNECTED) {
      isConnectWifi = true;
    }
  }

  if (isConnectWifi == false) {
    ssid     = "UIT Public";
    password = "";
    timeConnectWifi = 0;
    Serial.println();
    Serial.print("Try to connect to WiFi: "); 
    Serial.println(ssid);
    
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
      if (timeConnectWifi > 20) {
        break;
      }
      delay(500);
      Serial.print(".");
      timeConnectWifi++;
    }
    if (WiFi.status() == WL_CONNECTED) {
      isConnectWifi = true;
    }
  }

  if (isConnectWifi == false) {
    ssid     = "Connecting...";
    password = "thanh171";
    timeConnectWifi = 0;
    Serial.println();
    Serial.print("Try to connect to WiFi: "); 
    Serial.println(ssid);
    
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
      if (timeConnectWifi > 20) {
        break;
      }
      delay(500);
      Serial.print(".");
      timeConnectWifi++;
    }
    if (WiFi.status() == WL_CONNECTED) {
      isConnectWifi = true;
    }
  }
}

void buzzerHit() {
  digitalWrite(BUZZER, LOW);
  delay(1000);
  digitalWrite(BUZZER, HIGH);
}

void buzzerWin() {
  digitalWrite(BUZZER, LOW);
  delay(500);
  digitalWrite(BUZZER, HIGH);
  delay(200);
  digitalWrite(BUZZER, LOW);
  delay(500);
  digitalWrite(BUZZER, HIGH);
  delay(200);
  digitalWrite(BUZZER, LOW);
  delay(500);
  digitalWrite(BUZZER, HIGH);
  delay(200);
  digitalWrite(BUZZER, LOW);
  delay(500);
  digitalWrite(BUZZER, HIGH);
}

void buzzerLose() {
  digitalWrite(BUZZER, LOW);
  delay(2000);
  digitalWrite(BUZZER, HIGH);
  delay(500);
  digitalWrite(BUZZER, LOW);
  delay(2000);
  digitalWrite(BUZZER, HIGH);
}
   
