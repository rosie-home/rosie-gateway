/*
 * Example File. Node-Red does not save Function nodes in separate files. This is the source of the Transform Nest Payload node 
 */
if (msg.payload.length === 0) {
  node.error("Error", "No message payload found");
}

var payload = msg.payload;

var tags = {
  environment: payload.name
};

var values = {
  temperature: payload.ambient_temperature_f,
  humidity: payload.humidity,
  target_temperature: payload.target_temperature_f,
  mode: payload.hvac_mode,
  has_leaf: payload.has_leaf
};

msg.payload = [values, tags];

node.log("Transformed Message:" + JSON.stringify(msg.payload));

return msg;